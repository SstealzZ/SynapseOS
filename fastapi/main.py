from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from datetime import datetime, timedelta

from routers import notations, inputs, ai_outputs
from db import get_database

app = FastAPI(
    title="SynapseOS API",
    description="API for SynapseOS personal well-being tracking system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(notations.router, prefix="/notations", tags=["notations"])
app.include_router(inputs.router, prefix="/inputs", tags=["inputs"])
app.include_router(ai_outputs.router, prefix="/ai-output", tags=["ai-output"])

@app.get("/")
async def root():
    """
    Root endpoint that returns a simple status message
    
    Returns:
        dict: A message indicating the API is running
    """
    return {"message": "SynapseOS API is running"}

@app.get("/health")
async def health_check(db=Depends(get_database)):
    """
    Health check endpoint that verifies MongoDB connection
    
    Args:
        db: MongoDB connection from dependency
        
    Returns:
        dict: Status information about the API and database connection
    """
    try:
        await db.command("ping")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": db_status
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 