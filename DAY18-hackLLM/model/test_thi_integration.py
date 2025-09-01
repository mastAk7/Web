#!/usr/bin/env python3
"""
test_thi_integration.py - Test script for THI pipeline integration
Tests the integration of both models and verifies THI computation
"""

import sys
import json
import time
from pathlib import Path

# Add current directory to path for imports
sys.path.append('.')

def test_thi_pipeline():
    """Test the THI pipeline integration"""
    print("Testing THI Pipeline Integration")
    print("=" * 50)
    
    try:
        # Import the THI pipeline
        from thi_pipeline import THIPipeline
        print("✓ THI pipeline imported successfully")
        
        # Test text with known characteristics
        test_text = """
        Apple Inc. definitely reported exceptional earnings that increased 25% in Q2 2024.
        The stock price jumped an unbelievable 500% in one day, reaching $250 billion market cap.
        Analysts suggest the company might see continued growth, possibly driven by new products.
        """
        
        print(f"\nTest text:\n{test_text}")
        
        # Initialize pipeline
        print("\nInitializing THI pipeline...")
        start_time = time.time()
        
        thi_pipeline = THIPipeline()
        init_time = time.time() - start_time
        
        print(f"✓ Pipeline initialized in {init_time:.2f} seconds")
        print(f"✓ Weights: {thi_pipeline.weights}")
        
        # Test processing
        print("\nProcessing text through pipeline...")
        start_time = time.time()
        
        results = thi_pipeline.process_text(test_text)
        process_time = time.time() - start_time
        
        print(f"✓ Text processed in {process_time:.2f} seconds")
        
        # Display results
        print("\nResults:")
        print(f"Overall THI: {results['overall_thi']}")
        print(f"Binary Label: {results['binary_label']}")
        print(f"Total Claims: {results['total_claims']}")
        print(f"Threshold Used: {results['threshold_used']}")
        
        print("\nClaims Breakdown:")
        for i, claim in enumerate(results['claims']):
            print(f"\nClaim {i+1}: {claim['claim'][:100]}...")
            print(f"  THI Score: {claim['thi_score']}")
            print(f"  Components:")
            for comp, score in claim['components'].items():
                print(f"    {comp}: {score}")
        
        print("\nSummary:")
        for key, value in results['summary'].items():
            print(f"  {key}: {value}")
        
        return True
        
    except ImportError as e:
        print(f"✗ Import error: {e}")
        print("Make sure all dependencies are installed and paths are correct")
        return False
        
    except Exception as e:
        print(f"✗ Error during testing: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_individual_components():
    """Test individual components from components directory"""
    print("\nTesting Individual Components")
    print("=" * 50)
    
    try:
        # Test speculative scoring
        from components import SpeculativeScorer, SanityChecker, ParaphraseGenerator, ClaimExtractor
        
        print("✓ All components imported successfully")
        
        # Test speculative scorer
        spec_scorer = SpeculativeScorer("components/rules.yaml")
        score, counts = spec_scorer.score_sentence("This might be true, possibly.")
        print(f"✓ Speculative scoring: {score} (counts: {counts})")
        
        # Test sanity checker
        sanity_checker = SanityChecker("components/rules.yaml")
        print("✓ Sanity checker initialized")
        
        # Test paraphrase generator
        paraphraser = ParaphraseGenerator("components/rules.yaml")
        paraphrases = paraphraser.generate_paraphrases("Apple reported earnings.")
        print(f"✓ Paraphrase generation: {len(paraphrases)} paraphrases")
        
        # Test claim extractor
        extractor = ClaimExtractor()
        print("✓ Claim extractor initialized")
        
        return True
        
    except Exception as e:
        print(f"✗ Component testing error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_configuration():
    """Test configuration loading"""
    print("\nTesting Configuration")
    print("=" * 50)
    
    try:
        import yaml
        
        # Test main config
        with open('thi_config.yaml', 'r') as f:
            config = yaml.safe_load(f)
        
        print("✓ Main configuration loaded successfully")
        print(f"  NLI Model: {config['models']['nli']['name']}")
        print(f"  Weights: {config['weights']}")
        print(f"  Default Threshold: {config['thresholds']['default_binary']}")
        
        # Test components rules
        with open('components/rules.yaml', 'r') as f:
            rules = yaml.safe_load(f)
        
        print("✓ Components rules loaded successfully")
        print(f"  Speculative rules: {len(rules['speculative']['hedges'])} hedges, {len(rules['speculative']['absolutes'])} absolutes")
        
        return True
        
    except Exception as e:
        print(f"✗ Configuration error: {e}")
        return False

def main():
    """Run all tests"""
    print("THI Pipeline Integration Test Suite")
    print("=" * 60)
    
    tests = [
        ("Configuration", test_configuration),
        ("Individual Components", test_individual_components),
        ("THI Pipeline", test_thi_pipeline)
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
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    for test_name, success in results:
        status = "✓ PASS" if success else "✗ FAIL"
        print(f"{test_name}: {status}")
        if success:
            passed += 1
    
    print(f"\nOverall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed! THI pipeline is ready to use.")
        print("\nNext steps:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Install spaCy model: python -m spacy download en_core_web_sm")
        print("3. Run server: python thi_server.py")
        print("4. Test API: curl http://localhost:8000/health")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
