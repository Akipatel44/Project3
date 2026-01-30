# Minimal FastAPI application
# Run with: uvicorn main:app --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI(
    title="OsamVista API",
    description="API-first architecture with Clean Architecture pattern",
    version="0.1.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """API health check endpoint"""
    return {"status": "healthy", "message": "API is running"}

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to OsamVista API"}

# Run with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
