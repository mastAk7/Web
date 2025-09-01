#!/usr/bin/env python3
"""
sanity.py - Numeric & temporal sanity checks
Flags unrealistic numbers, dates, currencies, and units
"""

import yaml
import re
from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime, timedelta
import dateparser
import spacy


class SanityChecker:
    """Check numeric and temporal sanity of extracted claims"""

    def __init__(self, rules_path: str = "components/rules.yaml"):
        """Initialize with sanity rules from YAML config"""
        with open(rules_path, 'r') as f:
            config = yaml.safe_load(f)

        self.sanity_config = config['sanity']
        self.rules = self.sanity_config['rules']
        self.thresholds = self.sanity_config['thresholds']
        self.currencies = self.sanity_config['currencies']

        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            raise RuntimeError("Please install spaCy English model")

    def check_sentence_claims(self, sentence_data: Dict[str, Any]) -> Tuple[float, List[str]]:
        """
        Check sanity of all claims in a sentence

        Args:
            sentence_data: Sentence data with extracted claims

        Returns:
            Tuple of (num_sanity_score, list_of_flags)
        """
        flags = []
        claims = sentence_data['claims']
        text = sentence_data['text']

        numeric_claims = (len(claims['percents']) + len(claims['money']) +
                         len(claims['numbers']) + len(claims['dates']))

        if numeric_claims == 0:
            return 0.0, []

        flags.extend(self._check_percent_jumps(claims['percents'], claims['dates'], text))
        flags.extend(self._check_currency_mismatch(claims['money'], text))
        flags.extend(self._check_unit_absurdity(claims['numbers'], text))
        flags.extend(self._check_temporal_conflicts(claims['dates'], text))

        num_sanity_score = len(flags) / max(1, numeric_claims)

        return min(num_sanity_score, 1.0), flags

    def _check_percent_jumps(self, percents: List[Dict], dates: List[Dict], text: str) -> List[str]:
        """Check for unrealistic percentage jumps in short time periods"""
        flags = []
        rule = self.rules['percent_jump']

        if not rule['enabled'] or not percents:
            return flags

        is_daily_context = any(keyword in text.lower() for keyword in ['in one day', 'in a single day', 'daily']) or \
                           any('day' in d['text'].lower() for d in dates)

        if is_daily_context:
            threshold = rule['threshold']
            for percent in percents:
                percent_text = percent['text'].replace('%', '')
                try:
                    value = abs(float(percent_text))
                    if value > threshold:
                        flags.append(f"percent_jump_{value}")
                except ValueError:
                    continue

        return flags

    def _check_currency_mismatch(self, money_claims: List[Dict], text: str) -> List[str]:
        """Check for currency symbol/context mismatches"""
        flags = []
        if not self.rules['currency_mismatch']['enabled']:
            return flags

        text_lower = text.lower()
        inr_context = any(word in text_lower for word in ['rupee', 'inr', 'indian'])
        usd_context = any(word in text_lower for word in ['dollar', 'usd', 'american'])

        for money in money_claims:
            money_text = money['text']
            if '$' in money_text and inr_context:
                flags.append("currency_mismatch_usd_inr_context")
            elif '₹' in money_text and usd_context:
                flags.append("currency_mismatch_inr_usd_context")

        return flags

    def _check_unit_absurdity(self, numbers: List[Dict], text: str) -> List[str]:
        """Check for absurd numeric values based on context"""
        flags = []
        if not self.rules['unit_absurdity']['enabled']:
            return flags

        text_lower = text.lower()
        
        # Check for human-related measurements
        if any(word in text_lower for word in ['height', 'tall', 'cm', 'centimeter']):
            for num in numbers:
                try:
                    value = float(num['text'])
                    if value > self.thresholds['human_height_cm']:
                        flags.append(f"absurd_height_{value}cm")
                except ValueError:
                    continue

        if any(word in text_lower for word in ['weight', 'kg', 'kilogram']):
            for num in numbers:
                try:
                    value = float(num['text'])
                    if value > self.thresholds['human_weight_kg']:
                        flags.append(f"absurd_weight_{value}kg")
                except ValueError:
                    continue

        # Check for temperature
        if any(word in text_lower for word in ['temperature', 'celsius', '°c']):
            for num in numbers:
                try:
                    value = float(num['text'])
                    if abs(value) > self.thresholds['temperature_celsius']:
                        flags.append(f"absurd_temperature_{value}°c")
                except ValueError:
                    continue

        return flags

    def _check_temporal_conflicts(self, dates: List[Dict], text: str) -> List[str]:
        """Check for temporal conflicts like future dates for past events"""
        flags = []
        if not self.rules['future_past_conflict']['enabled']:
            return flags

        text_lower = text.lower()
        past_indicators = ['yesterday', 'last week', 'last month', 'last year', 'previous', 'past']
        is_past_context = any(indicator in text_lower for indicator in past_indicators)

        if is_past_context:
            current_year = datetime.now().year
            for date in dates:
                try:
                    parsed_date = dateparser.parse(date['text'])
                    if parsed_date and parsed_date.year > current_year:
                        flags.append(f"future_date_past_context_{parsed_date.year}")
                except:
                    continue

        return flags


def demo():
    """Demo the sanity checker"""
    checker = SanityChecker()
    
    # Create dummy sentence data
    sentence_data = {
        'text': 'The stock jumped 500% in one day, reaching $1000 billion market cap.',
        'claims': {
            'percents': [{'text': '500%'}],
            'money': [{'text': '$1000 billion'}],
            'numbers': [{'text': '1000'}],
            'dates': []
        }
    }
    
    score, flags = checker.check_sentence_claims(sentence_data)
    
    print("Sanity Check Demo:")
    print("-" * 50)
    print(f"Sentence: {sentence_data['text']}")
    print(f"Sanity Score: {score:.3f}")
    print(f"Flags: {flags}")


if __name__ == "__main__":
    demo()
