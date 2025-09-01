#!/usr/bin/env python3
"""
Simplified THI server for testing - no heavy ML dependencies
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import uvicorn
from datetime import datetime

# Initialize FastAPI app
app = FastAPI(
    title="THI Pipeline API (Simple)",
    description="Simplified THI API for testing",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class THIRequest(BaseModel):
    text: str
    evidence: str = None
    threshold: float = 0.5

class THIResponse(BaseModel):
    success: bool
    timestamp: str
    input_text: str
    evidence: str
    overall_thi: float
    binary_label: bool
    threshold_used: float
    weights_used: list
    total_claims: int
    claims: list
    summary: Dict[str, Any]
    processing_time_ms: float

@app.get("/")
async def root():
    return {
        "message": "THI Pipeline API (Simple Version)",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "pipeline_loaded": True,
        "model_info": {
            "version": "simple",
            "note": "Using mock THI calculations"
        }
    }

@app.post("/analyze", response_model=THIResponse)
async def analyze_text(request: THIRequest):
    """Mock THI analysis for testing"""
    
    # Simple mock THI calculation
    text = request.text.lower()
    evidence = request.evidence or request.text
    
    # Mock scores based on text content
    contradiction_score = 0.3
    support_score = 0.7
    instability_score = 0.2
    speculative_score = 0.1
    numeric_score = 0.1
    
    # Calculate mock THI
    weights = [0.35, 0.30, 0.15, 0.10, 0.10]
    thi_score = (
        weights[0] * contradiction_score +
        weights[1] * (1 - support_score) +
        weights[2] * instability_score +
        weights[3] * speculative_score +
        weights[4] * numeric_score
    )
    
    # Create mock response
    return THIResponse(
        success=True,
        timestamp=datetime.now().isoformat(),
        input_text=request.text,
        evidence=evidence,
        overall_thi=round(thi_score, 4),
        binary_label=thi_score > request.threshold,
        threshold_used=request.threshold,
        weights_used=weights,
        total_claims=1,
        claims=[{
            "claim": request.text,
            "thi_score": round(thi_score, 4),
            "components": {
                "contradiction_score": contradiction_score,
                "support_score": support_score,
                "instability_score": instability_score,
                "speculative_score": speculative_score,
                "numeric_score": numeric_score
            },
            "evidence": evidence,
            "explanation": {
                "contradiction": f"Mock contradiction score: {contradiction_score}",
                "lack_of_support": f"Mock support score: {support_score}",
                "instability": f"Mock instability score: {instability_score}",
                "speculative": f"Mock speculative score: {speculative_score}",
                "numeric_sanity": f"Mock numeric score: {numeric_score}"
            }
        }],
        summary={
            "high_risk_claims": 1 if thi_score > 0.7 else 0,
            "medium_risk_claims": 1 if 0.4 <= thi_score <= 0.7 else 0,
            "low_risk_claims": 1 if thi_score < 0.4 else 0
        },
        processing_time_ms=50.0
    )

if __name__ == "__main__":
    print("Starting Simple THI Server...")
    print("This is a mock version for testing - no ML models loaded")
    uvicorn.run(
        "thi_server_simple:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
