"""
paraphrase.py - Self-consistency via paraphrases
Creates deterministic paraphrases and measures stability
"""

import yaml
import re
import random
from typing import List, Dict, Any, Tuple
import spacy
import numpy as np


class ParaphraseGenerator:
    """Generate deterministic paraphrases for stability testing"""

    def __init__(self, rules_path: str = "components/rules.yaml"):
        """Initialize with paraphrase rules from config"""
        with open(rules_path, 'r') as f:
            config = yaml.safe_load(f)

        self.synonyms = config['paraphrase']['synonyms']
        # load hedges to allow inserting hedge words into paraphrases
        self.hedges = config.get('speculative', {}).get('hedges', [])

        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            raise RuntimeError("Please install spaCy English model")

        # Fixed seed for deterministic paraphrases
        random.seed(42)

    def generate_paraphrases(self, text: str) -> List[str]:
        """
        Generate 3 deterministic paraphrases using different strategies

        Args:
            text: Original sentence

        Returns:
            List of 3 paraphrases
        """
        paraphrases = []

        # Paraphrase 1: Synonym substitution (may change some words)
        p1 = self._synonym_paraphrase(text)
        paraphrases.append(p1)

        # Paraphrase 2: Insert a hedge word deterministically (gives spec signal)
        p2 = self._insert_hedge_paraphrase(text)
        paraphrases.append(p2)

        # Paraphrase 3: Minor token shuffle / clause reordering to change structure
        p3 = self._minor_shuffle_paraphrase(text)
        paraphrases.append(p3)

        return paraphrases

    def _synonym_paraphrase(self, text: str) -> str:
        """Replace words with synonyms from the dictionary"""
        result = text.lower()

        # Apply synonym substitutions deterministically
        for word, synonyms in self.synonyms.items():
            if word in result:
                # Always use first synonym for deterministic output
                result = result.replace(word, synonyms[0])

        # Capitalize first letter and fix common issues
        if result:
            result = result[0].upper() + result[1:]
            # Fix common typos that might occur from synonym substitution
            result = result.replace('announceed', 'announced')
            result = result.replace('rised', 'rose')
            result = result.replace('growed', 'grew')
            result = result.replace('falled', 'fell')
            result = result.replace('dropped', 'dropped')  # Already correct
            result = result.replace('declined', 'declined')  # Already correct

        return result

    def _insert_hedge_paraphrase(self, text: str) -> str:
        """Insert a hedge word to make the statement more speculative"""
        if not self.hedges:
            return text
        
        # Simple strategy: add "possibly" before the main verb
        doc = self.nlp(text)
        
        # Find the main verb (first verb that's not auxiliary)
        main_verb = None
        for token in doc:
            if token.pos_ == "VERB" and token.dep_ != "aux":
                main_verb = token
                break
        
        if main_verb:
            # Insert "possibly" before the main verb
            hedge = "possibly"
            if hedge not in text.lower():
                # Simple insertion before the verb
                verb_text = main_verb.text
                result = text.replace(verb_text, f"{hedge} {verb_text}", 1)
                return result
        
        # Fallback: just add "possibly" at the beginning
        return f"Possibly {text}"

    def _minor_shuffle_paraphrase(self, text: str) -> str:
        """Minor structural changes that preserve meaning"""
        doc = self.nlp(text)
        
        # Strategy: try to move time expressions to the beginning
        time_indicators = ['yesterday', 'today', 'tomorrow', 'last week', 'next month', 'in 2024']
        
        for indicator in time_indicators:
            if indicator.lower() in text.lower():
                # Move time indicator to the beginning
                if text.lower().startswith(indicator.lower()):
                    continue  # Already at beginning
                
                # Remove from current position and add to beginning
                result = text.replace(indicator, "", 1)
                result = f"{indicator} {result}"
                return result
        
        # If no time indicators, try to rephrase with "it is" construction
        if text.lower().startswith('the '):
            # "The company reported..." -> "It is reported that the company..."
            result = text.replace('The ', 'It is reported that the ', 1)
            return result
        
        # Fallback: just return original with minor capitalization change
        return text

    def calculate_instability(self, original_scores: Dict[str, float], 
                            paraphrase_scores: List[Dict[str, float]]) -> float:
        """
        Calculate instability score based on variance of scores
        
        Args:
            original_scores: Scores for original text
            paraphrase_scores: List of score dicts for paraphrases
            
        Returns:
            Instability score [0, 1] (higher = more unstable)
        """
        if not paraphrase_scores:
            return 0.0
        
        # Extract the same score type from all paraphrases
        score_type = 'spec_score'  # Default to speculative score
        
        # Get scores for the same metric across paraphrases
        scores = []
        if score_type in original_scores:
            scores.append(original_scores[score_type])
        
        for para_scores in paraphrase_scores:
            if score_type in para_scores:
                scores.append(para_scores[score_type])
        
        if len(scores) < 2:
            return 0.0
        
        # Calculate variance and scale to [0, 1]
        variance = np.var(scores)
        instability_score = min(variance * 10, 1.0)  # Scale factor
        
        return instability_score


def demo():
    """Demo the paraphrase generator"""
    generator = ParaphraseGenerator()
    
    test_text = "Apple Inc. reported quarterly revenue of $119.6 billion in Q1 2024."
    
    print("Paraphrase Generation Demo:")
    print("-" * 50)
    print(f"Original: {test_text}")
    
    paraphrases = generator.generate_paraphrases(test_text)
    
    print("\nParaphrases:")
    for i, para in enumerate(paraphrases, 1):
        print(f"{i}. {para}")
    
    # Test instability calculation
    original_scores = {'spec_score': 0.1}
    para_scores = [
        {'spec_score': 0.15},
        {'spec_score': 0.12},
        {'spec_score': 0.18}
    ]
    
    instability = generator.calculate_instability(original_scores, para_scores)
    print(f"\nInstability Score: {instability:.3f}")


if __name__ == "__main__":
    demo()
