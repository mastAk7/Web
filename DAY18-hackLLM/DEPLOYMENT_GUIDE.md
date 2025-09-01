# 🚀 Deployment Guide

## Quick Deployment Steps

### 1. Frontend (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables:
     ```
     VITE_API_BASE=https://your-backend.railway.app
     VITE_AI_MODEL_URL=https://your-model.render.com
     ```
   - Deploy

### 2. Backend (Railway)

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Deploy**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables**
   - Go to Railway dashboard
   - Set variables from `env.production`

### 3. AI Model (Render)

1. **Connect Repository**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repo
   - Select Python environment

2. **Configure Service**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python thi_server.py`
   - Set environment variables from `env.production`

## Environment Variables

### Frontend (Vercel)
```
VITE_API_BASE=https://your-backend.railway.app
VITE_AI_MODEL_URL=https://your-model.render.com
```

### Backend (Railway)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
AI_BASE_URL=https://your-model.render.com
CORS_ORIGIN=https://your-frontend.vercel.app
```

### AI Model (Render)
```
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-backend.railway.app
```

## Testing Deployment

1. **Check Health Endpoints**
   ```bash
   curl https://your-backend.railway.app/health
   curl https://your-model.render.com/health
   ```

2. **Test Analysis**
   ```bash
   curl -X POST https://your-backend.railway.app/api/analyze/thi \
     -H "Content-Type: application/json" \
     -d '{"response_text": "Test", "optional_context": []}'
   ```

## Troubleshooting

- **CORS Errors**: Check ALLOWED_ORIGINS in model server
- **Connection Timeouts**: Verify AI_BASE_URL in backend
- **Build Failures**: Check Python/Node.js versions in hosting platforms

## Next Steps

1. Set up custom domains
2. Configure monitoring and logging
3. Set up CI/CD pipelines
4. Add SSL certificates
5. Configure backup strategies
