# THI Hallucination Detection System

A comprehensive AI hallucination detection system using the Triangulated Hallucination Index (THI) approach. This system combines multiple lightweight detectors to identify potential hallucinations in AI-generated text without requiring fine-tuning.

## 🌟 Features

- **5-Detector Approach**: Contradiction, Evidence Support, Self-Consistency, Speculative Language, and Numeric Sanity checks
- **Explainable Results**: Each claim shows why it's suspicious with detailed breakdowns
- **Model-Agnostic**: Works on any AI text output without retraining
- **Real-time Analysis**: Fast processing with configurable thresholds
- **User Authentication**: Secure user registration and login system
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🏗️ Architecture

```
Frontend (Vercel) ←→ Backend (Railway) ←→ AI Model (Render)
     Port 5173           Port 8080           Port 8000
```

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **AI Model**: Python + FastAPI + Transformers

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or Atlas)

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd THI
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install
cp env.example .env
# Edit .env with your configuration

# Frontend
cd ../frontend
npm install
cp env.example .env
# Edit .env with your configuration

# AI Model
cd ../model
pip install -r requirements.txt
cp env.example .env
# Edit .env with your configuration
```

### 3. Start All Services

**Windows:**
```bash
# Full version with dependency checking
start_local_dev.bat

# Simple version (recommended for first run)
start_simple.bat
```

**Unix/Linux/Mac:**
```bash
# Full version with dependency checking
chmod +x start_local_dev.sh stop_local_dev.sh
./start_local_dev.sh

# Simple version (recommended for first run)
chmod +x start_simple.sh
./start_simple.sh
```

**Stop Services:**
```bash
# Windows
stop_local_dev.bat

# Unix/Linux/Mac
chmod +x stop_local_dev.sh
./stop_local_dev.sh
```

**Manual Start:**
```bash
# Terminal 1: AI Model Server
cd model && python thi_server.py

# Terminal 2: Backend Server
cd backend && npm run dev

# Terminal 3: Frontend
cd frontend && npm run dev
```

**Smart Startup Scripts:**
The startup scripts automatically:
- ✅ Check prerequisites (Python, Node.js, npm)
- ✅ Verify port availability
- ✅ Create .env files from examples if missing
- ✅ Install dependencies if needed
- ✅ Start services in the correct order
- ✅ Provide colored output and status updates

### 4. Access the System

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **AI Model API**: http://localhost:8000
- **Model Docs**: http://localhost:8000/docs

## 🌐 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `VITE_API_BASE`: Your backend URL
   - `VITE_AI_MODEL_URL`: Your model server URL
4. Deploy

### Backend (Railway)

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`
4. Set environment variables in Railway dashboard

### AI Model (Render)

1. Connect GitHub repository to Render
2. Select Python environment
3. Set environment variables:
   - `ALLOWED_ORIGINS`: Your frontend and backend URLs
4. Deploy

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```bash
PORT=8080
MONGODB_URI=mongodb://localhost:27017/hallucination-detect
JWT_SECRET=your-secret-key
AI_MODE=live
AI_BASE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env)
```bash
VITE_API_BASE=http://localhost:8080
VITE_AI_MODEL_URL=http://localhost:8000
```

#### AI Model (.env)
```bash
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080
```

## 🔧 API Endpoints

### Backend API
- `GET /health` - Health check
- `POST /api/analyze/thi` - Analyze text for hallucinations
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### AI Model API
- `GET /health` - Health check
- `POST /analyze` - Main analysis endpoint
- `GET /docs` - API documentation (dev only)

## 📊 THI Algorithm

The system uses 5 lightweight detectors:

1. **Contradiction Checker** (35%): NLI-based contradiction detection
2. **Evidence Support** (30%): Semantic similarity and entailment
3. **Self-Consistency** (15%): Variance over paraphrases
4. **Speculative Language** (10%): Risky word detection
5. **Numeric Sanity** (10%): Rule-based validation

**Formula**: `THI = 0.35×Contradiction + 0.30×(1-Support) + 0.15×Instability + 0.10×Speculative + 0.10×NumericSanity`

## 🧪 Testing

### Test the System

1. Start all services
2. Go to http://localhost:5173
3. Try these example texts:

**High Risk Example:**
```
Apple Inc. definitely reported earnings of $100 billion in Q1 2024, 
but the company actually lost money that quarter.
```

**Low Risk Example:**
```
Apple Inc. reported quarterly revenue of $119.6 billion in Q1 2024.
```

### API Testing

```bash
# Test backend health
curl http://localhost:8080/health

# Test AI model health
curl http://localhost:8000/health

# Test analysis
curl -X POST http://localhost:8080/api/analyze/thi \
  -H "Content-Type: application/json" \
  -d '{"response_text": "Test text", "optional_context": []}'
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Windows
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   
   # Unix/Linux
   lsof -ti:8000 | xargs kill -9
   ```

2. **Model Server Not Starting**
   - Check Python version (3.9+)
   - Install spaCy model: `python -m spacy download en_core_web_sm`
   - Check requirements.txt installation

3. **CORS Errors**
   - Verify CORS_ORIGIN in backend .env
   - Check ALLOWED_ORIGINS in model .env

4. **Database Connection**
   - Verify MongoDB is running
   - Check MONGODB_URI in backend .env

### Logs

- **Backend**: Check terminal output
- **Frontend**: Browser console
- **AI Model**: Terminal output

## 📝 Development

### Project Structure

```
THI/
├── backend/          # Node.js backend
├── frontend/         # React frontend
├── model/            # Python AI model
├── start_local_dev.* # Startup scripts
└── README.md         # This file
```

### Adding New Features

1. **Backend**: Add routes in `src/routes/`, controllers in `src/controllers/`
2. **Frontend**: Add components in `src/components/`, pages in `src/pages/`
3. **AI Model**: Extend `thi_pipeline.py` with new detectors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Hugging Face Transformers for pre-trained models
- FastAPI for the Python web framework
- React and Vite for the frontend framework
- Tailwind CSS for styling

---

**Note**: This is a development version. For production use, ensure proper security configurations, environment variables, and monitoring are in place.
