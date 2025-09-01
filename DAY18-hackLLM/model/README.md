# THI Pipeline - Triangulated Hallucination Index

An integrated pipeline that computes a comprehensive hallucination detection score using five training-free signals.

## 🎯 Overview

The THI (Triangulated Hallucination Index) pipeline provides robust hallucination detection by combining multiple analysis techniques:

- **NLI-based contradiction detection** using DeBERTa-v3-MNLI
- **Semantic similarity** with SBERT embeddings  
- **Self-consistency** via paraphrase generation
- **Lexicon-based** risky language detection
- **Rule-based** numeric validation

## 🧮 THI Formula

```
THI = w₁·Contradiction + w₂·(1−Support) + w₃·Instability + w₄·Speculative + w₅·NumericSanity
```

**Default Weights:**
- **Contradiction (35%)**: NLI-based contradiction detection
- **Lack of Support (30%)**: Evidence support via NLI + semantic similarity  
- **Instability (15%)**: Self-consistency over paraphrases
- **Speculative Language (10%)**: Risky language detection
- **Numeric Sanity (10%)**: Numeric/temporal validation

## 🚀 Features

- **Zero-shot NLI**: Uses DeBERTa-v3-MNLI for contradiction detection
- **Semantic Similarity**: SBERT embeddings for evidence support
- **Self-consistency**: Paraphrase generation and variance analysis
- **Lexicon-based**: Hedge/absolute word detection
- **Rule-based**: Numeric and temporal sanity checks
- **FastAPI Server**: RESTful API for MERN frontend integration
- **Configurable**: Editable weights and thresholds via API

## 📁 Project Structure

```
├── thi_pipeline.py          # Main THI pipeline integration
├── thi_server.py            # FastAPI server
├── thi_config.yaml          # Configuration file
├── requirements.txt          # Python dependencies
├── test_components.py       # Component testing suite
├── test_thi_integration.py  # Integration tests
├── README.md                # This file
├── components/              # Core components
│   ├── __init__.py         # Package initialization
│   ├── speculative.py      # Speculative language scoring
│   ├── sanity.py           # Numeric sanity checking
│   ├── paraphrase.py       # Paraphrase generation
│   ├── parser.py           # Claim extraction
│   └── rules.yaml          # Configuration rules
├── start_thi_server.bat     # Windows startup script
├── start_thi_server.ps1     # PowerShell startup script
└── results/                 # Output directory
```

## 🛠️ Installation

### 1. Clone and Setup

```bash
# Navigate to project directory
cd finalModel

# Create virtual environment
python -m venv thi_env
source thi_env/bin/activate  # On Windows: thi_env\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Install spaCy Model

```bash
python -m spacy download en_core_web_sm
```

### 3. Verify Installation

```bash
# Test individual components first
python test_components.py

# Then test full integration
python test_thi_integration.py
```

## 🚀 Quick Start

### 1. Run the FastAPI Server

```bash
python thi_server.py
```

The server will start at `http://localhost:8000`

### 2. Test the API

```bash
# Health check
curl http://localhost:8000/health

# Analyze text
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Apple Inc. definitely reported earnings of $100 billion in Q1 2024.",
    "threshold": 0.5
  }'
```

### 3. View API Documentation

Open your browser to:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 📊 API Endpoints

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/health` | GET | Health check and model status |
| `/analyze` | POST | Analyze single text for hallucinations |
| `/analyze/batch` | POST | Batch analysis |
| `/weights` | GET/POST | Get/update THI component weights |
| `/reload` | POST | Reload pipeline without restart |

### Analysis Request

```json
{
  "text": "Text to analyze for hallucinations",
  "evidence": "Optional evidence text",
  "threshold": 0.5,
  "custom_weights": [0.35, 0.30, 0.15, 0.10, 0.10]
}
```

### Analysis Response

```json
{
  "success": true,
  "overall_thi": 0.7234,
  "binary_label": true,
  "threshold_used": 0.5,
  "weights_used": [0.35, 0.30, 0.15, 0.10, 0.10],
  "total_claims": 3,
  "claims": [
    {
      "claim": "Apple Inc. definitely reported...",
      "thi_score": 0.8234,
      "components": {
        "contradiction_score": 0.1234,
        "support_score": 0.5678,
        "instability_score": 0.2345,
        "speculative_score": 0.3456,
        "numeric_score": 0.1234
      }
    }
  ],
  "summary": {
    "high_risk_claims": 1,
    "medium_risk_claims": 1,
    "low_risk_claims": 1
  }
}
```

## 🔧 Configuration

### THI Weights

Edit `thi_config.yaml` to customize:

```yaml
weights:
  contradiction: 0.35      # NLI contradiction detection
  support: 0.30           # Evidence support
  instability: 0.15       # Self-consistency
  speculative: 0.10       # Risky language
  numeric_sanity: 0.10    # Numeric validation
```

### Thresholds

```yaml
thresholds:
  default_binary: 0.5     # Default classification threshold
  min_threshold: 0.3      # Minimum allowed threshold
  max_threshold: 0.7      # Maximum allowed threshold
```

### Models

```yaml
models:
  nli:
    name: "microsoft/deberta-v3-base-mnli"
  embedding:
    name: "all-MiniLM-L6-v2"
```

## 🔍 Component Details

### 1. Contradiction Detection
- **Method**: Zero-shot NLI using DeBERTa-v3-MNLI
- **Input**: Claim vs Evidence
- **Output**: P(contradiction) probability

### 2. Evidence Support
- **Method**: NLI entailment + SBERT similarity
- **Input**: Claim vs Evidence
- **Output**: Combined support score [0,1]

### 3. Self-Consistency
- **Method**: Paraphrase generation + variance analysis
- **Input**: Original claim + 3 paraphrases
- **Output**: Instability score based on score variance

### 4. Speculative Language
- **Method**: Lexicon-based detection
- **Input**: Text with hedge/absolute words
- **Output**: Risk score based on word density

### 5. Numeric Sanity
- **Method**: Rule-based validation
- **Input**: Extracted numbers, dates, currencies
- **Output**: Fraction of flagged claims

## 🧪 Testing

### 1. Test Individual Components

```bash
python test_components.py
```

### 2. Test Full Integration

```bash
python test_thi_integration.py
```

### 3. Test Individual Components

```bash
# Test speculative scoring
python -c "
from components.speculative import SpeculativeScorer
scorer = SpeculativeScorer('components/rules.yaml')
score, counts = scorer.score_sentence('This might be true.')
print(f'Score: {score}, Counts: {counts}')
"
```

## 🌐 MERN Frontend Integration

### CORS Configuration

The server is configured with CORS for MERN frontend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Frontend Usage Example

```javascript
// React component example
const analyzeText = async (text) => {
  try {
    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, threshold: 0.5 })
    });
    
    const result = await response.json();
    console.log('THI Score:', result.overall_thi);
    console.log('Is Hallucination:', result.binary_label);
    
  } catch (error) {
    console.error('Analysis failed:', error);
  }
};
```

## 📈 Performance

### Model Loading
- **NLI Model**: ~500MB (DeBERTa-v3-MNLI)
- **Embedding Model**: ~90MB (all-MiniLM-L6-v2)
- **Initialization Time**: ~30-60 seconds (first run)

### Processing Speed
- **Single Claim**: ~2-5 seconds
- **Batch Processing**: ~1-3 seconds per claim
- **Memory Usage**: ~2-4GB RAM

## 🚨 Troubleshooting

### Common Issues

1. **Import Errors**
   ```bash
   # Ensure components directory is accessible
   export PYTHONPATH="${PYTHONPATH}:./components"
   ```

2. **Model Loading Failures**
   ```bash
   # Check internet connection for model downloads
   # Verify sufficient disk space (~1GB)
   ```

3. **Memory Issues**
   ```bash
   # Reduce batch size in thi_config.yaml
   # Use CPU-only mode if GPU memory insufficient
   ```

4. **spaCy Model Missing**
   ```bash
   python -m spacy download en_core_web_sm
   ```

### Debug Mode

Enable detailed logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 🔄 Updates and Maintenance

### Reload Pipeline

```bash
# Without restarting server
curl -X POST http://localhost:8000/reload
```

### Update Weights

```bash
curl -X POST "http://localhost:8000/weights" \
  -H "Content-Type: application/json" \
  -d '{"weights": [0.40, 0.25, 0.15, 0.10, 0.10]}'
```

## 📚 References

- **NLI Models**: [DeBERTa-v3-MNLI](https://huggingface.co/microsoft/deberta-v3-base-mnli)
- **Sentence Transformers**: [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- **FastAPI**: [FastAPI Documentation](https://fastapi.tiangolo.com/)
- **spaCy**: [spaCy Documentation](https://spacy.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the test output
3. Check the API documentation at `/docs`
4. Open an issue with detailed error information

---

**Happy Hallucination Detection! 🎯✨**
