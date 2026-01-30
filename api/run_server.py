#!/usr/bin/env python3
"""Start the FastAPI server"""
from fastapi import FastAPI
import uvicorn
from main import app

if __name__ == "__main__":
    print("=" * 80)
    print("Starting FastAPI Server")
    print("=" * 80)
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
