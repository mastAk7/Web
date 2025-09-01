#!/usr/bin/env python3
"""
thi_server.py - FastAPI server for THI (Triangulated Hallucination Index) Pipeline
Provides REST API endpoints for hallucination detection and analysis
"""

import os
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uvicorn
import json
import logging
from datetime import datetime
import asyncio
from pathlib import Path

# Import our THI pipeline
from thi_pipeline import THIPipeline

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment variables
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 8000))
ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')
LOG_LEVEL = os.getenv('LOG_LEVEL', 'info')

# Initialize FastAPI app
app = FastAPI(
    title="THI Pipeline API",
    description="Triangulated Hallucination Index API for detecting AI-generated hallucinations",
    version="1.0.0",
    docs_url="/docs" if ENVIRONMENT == 'development' else None,
    redoc_url="/redoc" if ENVIRONMENT == 'development' else None
)

# CORS configuration
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:8080,http://localhost:3000')
if allowed_origins:
    origins = [origin.strip() for origin in allowed_origins.split(',')]
else:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global THI pipeline instance
thi_pipeline: Optional[THIPipeline] = None

# Pydantic models for request/response
class THIRequest(BaseModel):
    text: str = Field(..., description="Text to analyze for hallucinations")
    evidence: Optional[str] = Field(None, description="Optional evidence text to compare against")
    threshold: Optional[float] = Field(0.5, ge=0.3, le=0.7, description="Threshold for binary classification")
    custom_weights: Optional[List[float]] = Field(None, description="Custom weights for THI components [contradiction, support, instability, speculative, numeric]")

class THIResponse(BaseModel):
    success: bool
    timestamp: str
    input_text: str
    evidence: str
    overall_thi: float
    binary_label: bool
    threshold_used: float
    weights_used: List[float]
    total_claims: int
    claims: List[Dict[str, Any]]
    summary: Dict[str, Any]
    processing_time_ms: float
    error: Optional[str] = None

class WeightsUpdateRequest(BaseModel):
    weights: List[float] = Field(..., description="New weights for THI components")

class WeightsResponse(BaseModel):
    success: bool
    message: str
    current_weights: List[float]

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    pipeline_loaded: bool
    model_info: Dict[str, Any]

class BatchRequest(BaseModel):
    texts: List[str] = Field(..., description="List of texts to analyze")
    evidence: Optional[str] = Field(None, description="Optional evidence text for all")
    threshold: Optional[float] = Field(0.5, ge=0.3, le=0.7)

class BatchResponse(BaseModel):
    success: bool
    timestamp: str
    total_texts: int
    results: List[Dict[str, Any]]
    processing_time_ms: float

# Initialize THI pipeline
async def initialize_pipeline():
    """Initialize the THI pipeline asynchronously"""
    global thi_pipeline
    try:
        logger.info("Initializing THI pipeline...")
        
        # Use environment variables for model configuration
        nli_model = os.getenv('NLI_MODEL_NAME', 'microsoft/deberta-v3-base-mnli')
        embedding_model = os.getenv('EMBEDDING_MODEL_NAME', 'all-MiniLM-L6-v2')
        
        thi_pipeline = THIPipeline(
            nli_model_name=nli_model,
            embedding_model_name=embedding_model
        )
        logger.info("THI pipeline initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize THI pipeline: {e}")
        thi_pipeline = None

@app.on_event("startup")
async def startup_event():
    """Initialize pipeline on startup"""
    await initialize_pipeline()

@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint"""
    return {
        "message": "THI Pipeline API",
        "version": "1.0.0",
        "environment": ENVIRONMENT,
        "docs": "/docs" if ENVIRONMENT == 'development' else "disabled in production",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    global thi_pipeline
    
    model_info = {}
    if thi_pipeline:
        try:
            model_info = {
                "nli_model": "microsoft/deberta-v3-base-mnli",
                "embedding_model": "all-MiniLM-L6-v2",
                "weights": thi_pipeline.weights,
                "components_loaded": True
            }
        except Exception as e:
            model_info = {"error": str(e)}
    
    return HealthResponse(
        status="healthy" if thi_pipeline else "unhealthy",
        timestamp=datetime.now().isoformat(),
        pipeline_loaded=thi_pipeline is not None,
        model_info=model_info
    )

@app.post("/analyze", response_model=THIResponse)
async def analyze_text(request: THIRequest):
    """
    Analyze text for hallucinations using THI pipeline
    
    This endpoint processes the input text and returns:
    - Overall THI score
    - Binary classification (hallucination or not)
    - Per-claim breakdown with component scores
    - Explanations for each component
    """
    global thi_pipeline
    
    if not thi_pipeline:
        raise HTTPException(status_code=503, detail="THI pipeline not initialized")
    
    start_time = datetime.now()
    
    try:
        # Update weights if custom weights provided
        if request.custom_weights:
            thi_pipeline.update_weights(request.custom_weights)
        
        # Process text through pipeline
        results = thi_pipeline.process_text(request.text, request.evidence)
        
        # Override threshold if provided
        if request.threshold != 0.5:
            results["binary_label"] = results["overall_thi"] > request.threshold
            results["threshold_used"] = request.threshold
        
        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return THIResponse(
            success=True,
            timestamp=datetime.now().isoformat(),
            input_text=results["input_text"],
            evidence=results["evidence"],
            overall_thi=results["overall_thi"],
            binary_label=results["binary_label"],
            threshold_used=results["threshold_used"],
            weights_used=results["weights_used"],
            total_claims=results["total_claims"],
            claims=results["claims"],
            summary=results["summary"],
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        logger.error(f"Error processing text: {e}")
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return THIResponse(
            success=False,
            timestamp=datetime.now().isoformat(),
            input_text=request.text,
            evidence=request.evidence or request.text,
            overall_thi=0.0,
            binary_label=False,
            threshold_used=request.threshold,
            weights_used=thi_pipeline.weights if thi_pipeline else [],
            total_claims=0,
            claims=[],
            summary={},
            processing_time_ms=round(processing_time, 2),
            error=str(e)
        )

@app.post("/analyze/batch", response_model=BatchResponse)
async def analyze_batch(request: BatchRequest):
    """
    Analyze multiple texts in batch
    
    Useful for processing multiple documents or claims at once
    """
    global thi_pipeline
    
    if not thi_pipeline:
        raise HTTPException(status_code=503, detail="THI pipeline not initialized")
    
    start_time = datetime.now()
    
    try:
        results = []
        for text in request.texts:
            try:
                result = thi_pipeline.process_text(text, request.evidence)
                results.append({
                    "text": text,
                    "thi_score": result["overall_thi"],
                    "binary_label": result["binary_label"],
                    "total_claims": result["total_claims"],
                    "summary": result["summary"]
                })
            except Exception as e:
                results.append({
                    "text": text,
                    "error": str(e),
                    "thi_score": 0.0,
                    "binary_label": False,
                    "total_claims": 0,
                    "summary": {}
                })
        
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return BatchResponse(
            success=True,
            timestamp=datetime.now().isoformat(),
            total_texts=len(request.texts),
            results=results,
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        logger.error(f"Error in batch processing: {e}")
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return BatchResponse(
            success=False,
            timestamp=datetime.now().isoformat(),
            total_texts=len(request.texts),
            results=[],
            processing_time_ms=round(processing_time, 2)
        )

@app.get("/weights", response_model=WeightsResponse)
async def get_weights():
    """Get current THI component weights"""
    global thi_pipeline
    
    if not thi_pipeline:
        raise HTTPException(status_code=503, detail="THI pipeline not initialized")
    
    return WeightsResponse(
        success=True,
        message="Current THI weights retrieved successfully",
        current_weights=thi_pipeline.weights
    )

@app.post("/weights", response_model=WeightsResponse)
async def update_weights(request: WeightsUpdateRequest):
    """
    Update THI component weights
    
    Weights should be provided in order: [contradiction, support, instability, speculative, numeric]
    They will be automatically normalized to sum to 1.0
    """
    global thi_pipeline
    
    if not thi_pipeline:
        raise HTTPException(status_code=503, detail="THI pipeline not initialized")
    
    try:
        thi_pipeline.update_weights(request.weights)
        
        return WeightsResponse(
            success=True,
            message="Weights updated successfully",
            current_weights=thi_pipeline.weights
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating weights: {e}")
        raise HTTPException(status_code=500, detail="Failed to update weights")

@app.post("/reload")
async def reload_pipeline(background_tasks: BackgroundTasks):
    """
    Reload the THI pipeline
    
    Useful for updating models or configurations without restarting the server
    """
    background_tasks.add_task(initialize_pipeline)
    
    return {
        "success": True,
        "message": "Pipeline reload initiated",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/examples")
async def get_examples():
    """Get example texts for testing the API"""
    examples = [
        {
            "name": "High Risk - Contradictory Claims",
            "text": "Apple Inc. definitely reported earnings of $100 billion in Q1 2024, but the company actually lost money that quarter.",
            "description": "Contains contradictory statements about earnings"
        },
        {
            "name": "Medium Risk - Speculative Language",
            "text": "The stock might increase by 500% tomorrow, possibly reaching new highs.",
            "description": "Uses speculative language and unrealistic predictions"
        },
        {
            "name": "Low Risk - Factual Statement",
            "text": "Apple Inc. reported quarterly revenue of $119.6 billion in Q1 2024.",
            "description": "Specific, factual statement with concrete numbers"
        }
    ]
    
    return {
        "examples": examples,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/components")
async def get_component_info():
    """Get information about THI components"""
    components = {
        "contradiction": {
            "description": "NLI-based contradiction detection",
            "weight": 0.35,
            "method": "Zero-shot NLI using DeBERTa-v3-MNLI"
        },
        "support": {
            "description": "Evidence support via NLI and semantic similarity",
            "weight": 0.30,
            "method": "Entailment + SBERT similarity"
        },
        "instability": {
            "description": "Self-consistency over paraphrases",
            "weight": 0.15,
            "method": "Variance of scores over 3 paraphrases"
        },
        "speculative": {
            "description": "Risky language detection",
            "weight": 0.10,
            "method": "Lexicon-based hedge/absolute word detection"
        },
        "numeric_sanity": {
            "description": "Numeric and temporal sanity checks",
            "weight": 0.10,
            "method": "Regex + rule-based validation"
        }
    }
    
    return {
        "components": components,
        "formula": "THI = 0.35×Contradiction + 0.30×(1-Support) + 0.15×Instability + 0.10×Speculative + 0.10×NumericSanity",
        "timestamp": datetime.now().isoformat()
    }

# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "timestamp": datetime.now().isoformat(),
            "detail": str(exc)
        }
    )

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "thi_server:app",
        host=HOST,
        port=PORT,
        reload=True,
        log_level=LOG_LEVEL
    )
