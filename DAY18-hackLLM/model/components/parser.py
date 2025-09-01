#!/usr/bin/env python3
"""
parser.py - Claim extraction from text
Extracts entities, numbers, dates, percentages, and money from sentences
"""

import re
import spacy
from typing import Dict, List, Any
from datetime import datetime


class ClaimExtractor:
    """Extract structured claims from text sentences"""
    
    def __init__(self):
        """Initialize the claim extractor"""
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            raise RuntimeError("Please install spaCy English model")
    
    def extract_sentence_claims(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract claims from a sentence
        
        Args:
            text: Input sentence text
            
        Returns:
            List of sentence data with extracted claims
        """
        # Process with spaCy
        doc = self.nlp(text)
        
        # Extract different types of claims
        entities = self._extract_entities(doc)
        numbers = self._extract_numbers(text)
        percents = self._extract_percentages(text)
        money = self._extract_money(text)
        dates = self._extract_dates(text)
        
        # Create sentence data structure
        sentence_data = {
            'text': text,
            'claims': {
                'entities': entities,
                'numbers': numbers,
                'percents': percents,
                'money': money,
                'dates': dates
            }
        }
        
        return [sentence_data]
    
    def _extract_entities(self, doc) -> List[Dict[str, str]]:
        """Extract named entities from spaCy doc"""
        entities = []
        
        for ent in doc.ents:
            if ent.label_ in ['PERSON', 'ORG', 'GPE', 'PRODUCT', 'EVENT']:
                entities.append({
                    'text': ent.text,
                    'label': ent.label_,
                    'start': ent.start_char,
                    'end': ent.end_char
                })
        
        return entities
    
    def _extract_numbers(self, text: str) -> List[Dict[str, str]]:
        """Extract numeric values from text"""
        numbers = []
        
        # Pattern for various number formats
        patterns = [
            r'\b\d+(?:\.\d+)?\b',  # Basic numbers (1, 1.5, 123)
            r'\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b',  # Numbers with commas (1,000)
            r'\b\d+(?:\.\d+)?[kKmMbB]\b',  # Numbers with K, M, B (1K, 1.5M)
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text)
            for match in matches:
                numbers.append({
                    'text': match.group(),
                    'start': match.start(),
                    'end': match.end()
                })
        
        return numbers
    
    def _extract_percentages(self, text: str) -> List[Dict[str, str]]:
        """Extract percentage values from text"""
        percents = []
        
        # Pattern for percentages
        patterns = [
            r'\b\d+(?:\.\d+)?%\b',  # 25%, 25.5%
            r'\b\d+(?:\.\d+)?\s*percent\b',  # 25 percent, 25.5 percent
            r'\b\d+(?:\.\d+)?\s*per\s*cent\b',  # 25 per cent
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                percents.append({
                    'text': match.group(),
                    'start': match.start(),
                    'end': match.end()
                })
        
        return percents
    
    def _extract_money(self, text: str) -> List[Dict[str, str]]:
        """Extract monetary values from text"""
        money = []
        
        # Pattern for money
        patterns = [
            r'\$[\d,]+(?:\.\d{2})?\b',  # $100, $1,000, $1,000.50
            r'\b[\d,]+(?:\.\d{2})?\s*dollars?\b',  # 100 dollars, 1,000 dollars
            r'₹[\d,]+(?:\.\d{2})?\b',  # ₹100, ₹1,000
            r'\b[\d,]+(?:\.\d{2})?\s*rupees?\b',  # 100 rupees, 1,000 rupees
            r'€[\d,]+(?:\.\d{2})?\b',  # €100, €1,000
            r'\b[\d,]+(?:\.\d{2})?\s*euros?\b',  # 100 euros, 1,000 euros
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                money.append({
                    'text': match.group(),
                    'start': match.start(),
                    'end': match.end()
                })
        
        return money
    
    def _extract_dates(self, text: str) -> List[Dict[str, str]]:
        """Extract date values from text"""
        dates = []
        
        # Pattern for dates
        patterns = [
            r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',  # MM/DD/YYYY, DD-MM-YY
            r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b',  # January 1, 2024
            r'\b\d{4}\b',  # Just year (2024)
            r'\bQ[1-4]\s+\d{4}\b',  # Q1 2024, Q2 2024
            r'\b(?:yesterday|today|tomorrow)\b',  # Relative dates
            r'\b(?:last|next)\s+(?:week|month|year|quarter)\b',  # Relative periods
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                dates.append({
                    'text': match.group(),
                    'start': match.start(),
                    'end': match.end()
                })
        
        return dates


def demo():
    """Demo the claim extractor"""
    extractor = ClaimExtractor()
    
    test_text = "Apple Inc. reported quarterly revenue of $119.6 billion in Q1 2024, up 25% from last year."
    
    print("Claim Extraction Demo:")
    print("-" * 50)
    print(f"Input text: {test_text}")
    
    results = extractor.extract_sentence_claims(test_text)
    
    if results:
        claims = results[0]['claims']
        print(f"\nExtracted claims:")
        print(f"Entities: {[e['text'] for e in claims['entities']]}")
        print(f"Numbers: {[n['text'] for n in claims['numbers']]}")
        print(f"Percentages: {[p['text'] for p in claims['percents']]}")
        print(f"Money: {[m['text'] for m in claims['money']]}")
        print(f"Dates: {[d['text'] for d in claims['dates']]}")


if __name__ == "__main__":
    demo()
