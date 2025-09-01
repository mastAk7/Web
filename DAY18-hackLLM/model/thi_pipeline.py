#!/usr/bin/env python3
"""
thi_pipeline.py - Integrated Triangulated Hallucination Index Pipeline
Combines both models to compute THI using five training-free signals
"""

import json
import numpy as np
from typing import Dict, List, Any, Tuple, Optional
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
from sentence_transformers import SentenceTransformer
import spacy
import re
from datetime import datetime
import yaml
from pathlib import Path

# Import components from components directory
from components import SpeculativeScorer, SanityChecker, ParaphraseGenerator, ClaimExtractor


class THIPipeline:
    """
    Integrated Triangulated Hallucination Index Pipeline
    
    THI = w₁·Contradiction + w₂·(1−Support) + w₃·Instability + w₄·Speculative + w₅·NumericSanity
    Default weights: [0.35, 0.30, 0.15, 0.10, 0.10]
    """
    
    def __init__(self, 
                 nli_model_name: str = "distilbert-base-uncased",
                 embedding_model_name: str = "all-MiniLM-L6-v2",
                 rules_path: str = "components/rules.yaml",
                 weights: Optional[List[float]] = None):
        """
        Initialize the THI pipeline
        
        Args:
            nli_model_name: HuggingFace model for NLI
            embedding_model_name: Sentence transformer for semantic similarity
            rules_path: Path to rules.yaml for speculative and sanity checks
            weights: Custom weights for THI components [contradiction, support, instability, speculative, numeric]
        """
        self.weights = weights or [0.35, 0.30, 0.15, 0.10, 0.10]
        
        # Initialize NLI model
        print(f"Loading NLI model: {nli_model_name}")
        self.nli_pipeline = pipeline(
            "text-classification",
            model=nli_model_name,
            return_all_scores=True
        )
        
        # Initialize sentence transformer for semantic similarity
        print(f"Loading embedding model: {embedding_model_name}")
        self.embedding_model = SentenceTransformer(embedding_model_name)
        
        # Initialize components from components directory
        print("Loading components...")
        self.extractor = ClaimExtractor()
        self.spec_scorer = SpeculativeScorer(rules_path)
        self.sanity_checker = SanityChecker(rules_path)
        self.paraphraser = ParaphraseGenerator(rules_path)
        
        # Load spaCy for text processing
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("Warning: spaCy model not found. Please install: python -m spacy download en_core_web_sm")
            self.nlp = None
    
    def split_sentences(self, text: str) -> List[str]:
        """Split text into sentences using spaCy"""
        if self.nlp:
            doc = self.nlp(text)
            return [sent.text.strip() for sent in doc.sents]
        else:
            # Fallback to simple sentence splitting
            return [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    
    def compute_contradiction_score(self, claim: str, evidence: str) -> float:
        """
        Compute contradiction score using NLI
        
        Args:
            claim: The claim to evaluate
            evidence: Evidence text to compare against
            
        Returns:
            Contradiction probability [0, 1]
        """
        try:
            # NLI expects premise and hypothesis
            result = self.nli_pipeline(
                premise=evidence,
                hypothesis=claim
            )
            
            # Find contradiction label (usually "CONTRADICTION" or similar)
            for score in result[0]:
                if "contradict" in score['label'].lower():
                    return score['score']
            
            # Fallback: look for the highest score among available labels
            return max(score['score'] for score in result[0])
            
        except Exception as e:
            print(f"Error in NLI prediction: {e}")
            return 0.5  # Neutral score on error
    
    def compute_support_score(self, claim: str, evidence: str) -> float:
        """
        Compute support score using NLI entailment and semantic similarity
        
        Args:
            claim: The claim to evaluate
            evidence: Evidence text to compare against
            
        Returns:
            Support score [0, 1] (higher = more supported)
        """
        try:
            # NLI entailment
            nli_result = self.nli_pipeline(
                premise=evidence,
                hypothesis=claim
            )
            
            # Find entailment label
            entailment_score = 0.0
            for score in nli_result[0]:
                if "entail" in score['label'].lower():
                    entailment_score = score['score']
                    break
            
            # Semantic similarity using sentence transformers
            embeddings = self.embedding_model.encode([claim, evidence])
            similarity = np.dot(embeddings[0], embeddings[1]) / (
                np.linalg.norm(embeddings[0]) * np.linalg.norm(embeddings[1])
            )
            
            # Combine NLI and similarity scores
            support_score = 0.7 * entailment_score + 0.3 * max(0, similarity)
            return min(support_score, 1.0)
            
        except Exception as e:
            print(f"Error in support computation: {e}")
            return 0.5
    
    def compute_instability_score(self, claim: str, evidence: str) -> float:
        """
        Compute instability score using paraphrases
        
        Args:
            claim: Original claim
            evidence: Evidence text
            
        Returns:
            Instability score [0, 1] (higher = more unstable)
        """
        try:
            # Generate paraphrases
            paraphrases = self.paraphraser.generate_paraphrases(claim)
            
            # Score original claim
            original_contra = self.compute_contradiction_score(claim, evidence)
            original_support = self.compute_support_score(claim, evidence)
            
            # Score paraphrases
            paraphrase_scores = []
            for para in paraphrases:
                para_contra = self.compute_contradiction_score(para, evidence)
                para_support = self.compute_support_score(para, evidence)
                
                # Calculate risk score for this paraphrase
                risk_score = para_contra + (1 - para_support)
                paraphrase_scores.append(risk_score)
            
            # Calculate variance of risk scores
            if len(paraphrase_scores) > 1:
                variance = np.var(paraphrase_scores)
                # Scale variance to [0, 1] range
                instability_score = min(variance * 10, 1.0)  # Scale factor
            else:
                instability_score = 0.0
            
            return instability_score
            
        except Exception as e:
            print(f"Error in instability computation: {e}")
            return 0.0
    
    def compute_speculative_score(self, claim: str) -> float:
        """
        Compute speculative language score
        
        Args:
            claim: The claim to evaluate
            
        Returns:
            Speculative score [0, 1] (higher = more speculative)
        """
        try:
            score, _ = self.spec_scorer.score_sentence(claim)
            return score
        except Exception as e:
            print(f"Error in speculative scoring: {e}")
            return 0.0
    
    def compute_numeric_sanity_score(self, claim: str) -> float:
        """
        Compute numeric sanity score
        
        Args:
            claim: The claim to evaluate
            
        Returns:
            Numeric sanity score [0, 1] (higher = more suspicious)
        """
        try:
            # Extract claims from the sentence
            sentence_data = self.extractor.extract_sentence_claims(claim)
            if sentence_data:
                score, _ = self.sanity_checker.check_sentence_claims(sentence_data[0])
                return score
            return 0.0
        except Exception as e:
            print(f"Error in numeric sanity checking: {e}")
            return 0.0
    
    def compute_thi_for_claim(self, claim: str, evidence: str) -> Dict[str, Any]:
        """
        Compute THI for a single claim
        
        Args:
            claim: The claim to evaluate
            evidence: Evidence text to compare against
            
        Returns:
            Dictionary with THI scores and components
        """
        # Compute all component scores
        contradiction_score = self.compute_contradiction_score(claim, evidence)
        support_score = self.compute_support_score(claim, evidence)
        instability_score = self.compute_instability_score(claim, evidence)
        speculative_score = self.compute_speculative_score(claim)
        numeric_score = self.compute_numeric_sanity_score(claim)
        
        # Calculate THI using the formula
        thi_score = (
            self.weights[0] * contradiction_score +
            self.weights[1] * (1 - support_score) +
            self.weights[2] * instability_score +
            self.weights[3] * speculative_score +
            self.weights[4] * numeric_score
        )
        
        return {
            "claim": claim,
            "evidence": evidence,
            "thi_score": round(thi_score, 4),
            "components": {
                "contradiction_score": round(contradiction_score, 4),
                "support_score": round(support_score, 4),
                "instability_score": round(instability_score, 4),
                "speculative_score": round(speculative_score, 4),
                "numeric_score": round(numeric_score, 4)
            },
            "weights": self.weights,
            "explanation": {
                "contradiction": f"P(contradiction) = {contradiction_score:.3f}",
                "lack_of_support": f"1 - P(entailment) = {1-support_score:.3f}",
                "instability": f"Variance over paraphrases = {instability_score:.3f}",
                "speculative": f"Risky language density = {speculative_score:.3f}",
                "numeric_sanity": f"Fraction of flagged claims = {numeric_score:.3f}"
            }
        }
    
    def process_text(self, text: str, evidence: Optional[str] = None) -> Dict[str, Any]:
        """
        Process text and compute THI for all claims
        
        Args:
            text: Input text to analyze
            evidence: Optional evidence text (if not provided, will use text itself)
            
        Returns:
            Complete THI analysis results
        """
        if evidence is None:
            evidence = text  # Use text as evidence if none provided
        
        # Split into sentences
        sentences = self.split_sentences(text)
        
        # Process each sentence
        claim_results = []
        total_thi = 0.0
        
        for sentence in sentences:
            if sentence.strip():
                result = self.compute_thi_for_claim(sentence, evidence)
                claim_results.append(result)
                total_thi += result["thi_score"]
        
        # Calculate overall THI
        avg_thi = total_thi / len(claim_results) if claim_results else 0.0
        
        # Determine binary label (default threshold 0.5)
        binary_label = avg_thi > 0.5
        
        return {
            "input_text": text,
            "evidence": evidence,
            "total_claims": len(claim_results),
            "overall_thi": round(avg_thi, 4),
            "binary_label": binary_label,
            "threshold_used": 0.5,
            "weights_used": self.weights,
            "claims": claim_results,
            "summary": {
                "high_risk_claims": len([r for r in claim_results if r["thi_score"] > 0.7]),
                "medium_risk_claims": len([r for r in claim_results if 0.4 <= r["thi_score"] <= 0.7]),
                "low_risk_claims": len([r for r in claim_results if r["thi_score"] < 0.4])
            }
        }
    
    def update_weights(self, new_weights: List[float]):
        """Update THI component weights"""
        if len(new_weights) != 5:
            raise ValueError("Must provide exactly 5 weights")
        if not all(0 <= w <= 1 for w in new_weights):
            raise ValueError("Weights must be between 0 and 1")
        
        # Normalize weights to sum to 1
        total = sum(new_weights)
        self.weights = [w / total for w in new_weights]
        print(f"Updated weights: {self.weights}")


def demo():
    """Demo the THI pipeline"""
    print("THI Pipeline Demo")
    print("=" * 50)
    
    # Initialize pipeline
    thi_pipeline = THIPipeline()
    
    # Test text
    test_text = """
    Apple Inc. definitely reported exceptional earnings that increased 25% in Q2 2024.
    The stock price jumped an unbelievable 500% in one day, reaching $250 billion market cap.
    Analysts suggest the company might see continued growth, possibly driven by new products.
    """
    
    print(f"Input text:\n{test_text}")
    print("\n" + "=" * 50)
    
    # Process text
    results = thi_pipeline.process_text(test_text)
    
    print("Results:")
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    demo()
