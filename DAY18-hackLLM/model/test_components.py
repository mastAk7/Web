#!/usr/bin/env python3
"""
test_components.py - Test individual components independently
Run this before testing the full THI pipeline
"""

import sys
import traceback

def test_speculative():
    """Test speculative scoring component"""
    print("Testing SpeculativeScorer...")
    try:
        from components.speculative import SpeculativeScorer
        scorer = SpeculativeScorer("components/rules.yaml")
        
        # Test basic functionality
        score, counts = scorer.score_sentence("This might be true, possibly.")
        print(f"✓ Speculative scoring works: {score} (counts: {counts})")
        
        # Test with absolute language
        score, counts = scorer.score_sentence("This is definitely true without doubt.")
        print(f"✓ Absolute language detection works: {score} (counts: {counts})")
        
        return True
    except Exception as e:
        print(f"✗ SpeculativeScorer failed: {e}")
        traceback.print_exc()
        return False

def test_sanity():
    """Test sanity checking component"""
    print("\nTesting SanityChecker...")
    try:
        from components.sanity import SanityChecker
        checker = SanityChecker("components/rules.yaml")
        
        # Test with dummy data
        sentence_data = {
            'text': 'The stock jumped 500% in one day.',
            'claims': {
                'percents': [{'text': '500%'}],
                'money': [],
                'numbers': [],
                'dates': []
            }
        }
        
        score, flags = checker.check_sentence_claims(sentence_data)
        print(f"✓ Sanity checking works: {score} (flags: {flags})")
        
        return True
    except Exception as e:
        print(f"✗ SanityChecker failed: {e}")
        traceback.print_exc()
        return False

def test_paraphrase():
    """Test paraphrase generation component"""
    print("\nTesting ParaphraseGenerator...")
    try:
        from components.paraphrase import ParaphraseGenerator
        generator = ParaphraseGenerator("components/rules.yaml")
        
        # Test paraphrase generation
        paraphrases = generator.generate_paraphrases("Apple reported earnings.")
        print(f"✓ Paraphrase generation works: {len(paraphrases)} paraphrases")
        for i, para in enumerate(paraphrases, 1):
            print(f"  {i}. {para}")
        
        return True
    except Exception as e:
        print(f"✗ ParaphraseGenerator failed: {e}")
        traceback.print_exc()
        return False

def test_parser():
    """Test claim extraction component"""
    print("\nTesting ClaimExtractor...")
    try:
        from components.parser import ClaimExtractor
        extractor = ClaimExtractor()
        
        # Test claim extraction
        test_text = "Apple Inc. reported $119.6 billion revenue in Q1 2024, up 25% from last year."
        results = extractor.extract_sentence_claims(test_text)
        
        if results:
            claims = results[0]['claims']
            print(f"✓ Claim extraction works:")
            print(f"  Entities: {[e['text'] for e in claims['entities']]}")
            print(f"  Numbers: {[n['text'] for n in claims['numbers']]}")
            print(f"  Percentages: {[p['text'] for p in claims['percents']]}")
            print(f"  Money: {[m['text'] for m in claims['money']]}")
            print(f"  Dates: {[d['text'] for d in claims['dates']]}")
        
        return True
    except Exception as e:
        print(f"✗ ClaimExtractor failed: {e}")
        traceback.print_exc()
        return False

def test_rules():
    """Test rules.yaml loading"""
    print("\nTesting rules.yaml...")
    try:
        import yaml
        
        with open('components/rules.yaml', 'r') as f:
            rules = yaml.safe_load(f)
        
        print("✓ Rules loaded successfully:")
        print(f"  Speculative: {len(rules['speculative']['hedges'])} hedges, {len(rules['speculative']['absolutes'])} absolutes")
        print(f"  Sanity: {len(rules['sanity']['rules'])} rules")
        print(f"  Paraphrase: {len(rules['paraphrase']['synonyms'])} synonym groups")
        
        return True
    except Exception as e:
        print(f"✗ Rules loading failed: {e}")
        traceback.print_exc()
        return False

def main():
    """Run all component tests"""
    print("Component Testing Suite")
    print("=" * 50)
    
    tests = [
        ("Rules Loading", test_rules),
        ("SpeculativeScorer", test_speculative),
        ("SanityChecker", test_sanity),
        ("ParaphraseGenerator", test_paraphrase),
        ("ClaimExtractor", test_parser)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"✗ {test_name} test failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("COMPONENT TEST SUMMARY")
    print("=" * 50)
    
    passed = 0
    for test_name, success in results:
        status = "✓ PASS" if success else "✗ FAIL"
        print(f"{test_name}: {status}")
        if success:
            passed += 1
    
    print(f"\nOverall: {passed}/{len(results)} component tests passed")
    
    if passed == len(results):
        print("🎉 All components working! Ready to test full pipeline.")
        print("\nNext: Run 'python test_thi_integration.py'")
    else:
        print("❌ Some components failed. Fix these before testing full pipeline.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
