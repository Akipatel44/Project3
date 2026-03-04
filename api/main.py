# Minimal FastAPI application
# Run with: uvicorn main:app --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.controllers.auth import router as auth_router
from app.controllers.place import router as place_router
from app.controllers.event import event_router
from app.controllers.gallery import gallery_router
from app.core.seed import init_database

# Initialize FastAPI app
app = FastAPI(
    title="OsamVista API",
    description="API-first architecture with Clean Architecture pattern",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for images
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/images", StaticFiles(directory=os.path.join(static_dir, "images")), name="images")

# Startup event - seed database
@app.on_event("startup")
async def startup_event():
    """Initialize database on app startup"""
    init_database()

# Include routers
app.include_router(auth_router)
app.include_router(place_router)
app.include_router(event_router)
app.include_router(gallery_router)

# Health check endpoint
@app.get("/health")
async def health_check():
    """API health check endpoint"""
    return {"status": "healthy", "message": "API is running"}

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to OsamVista API", "version": "0.1.0"}

# Run with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
