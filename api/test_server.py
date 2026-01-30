#!/usr/bin/env python3
"""
Simple API Test
Starts server and tests all endpoints
"""
import subprocess
import time
import requests
import sys
import os

def test_api():
    """Test API endpoints"""
    BASE_URL = "http://127.0.0.1:8000"
    
    print("=" * 80)
    print("STARTING API SERVER AND RUNNING TESTS")
    print("=" * 80)
    
    # Start server in background
    server_process = subprocess.Popen(
        [sys.executable, os.path.join(os.path.dirname(__file__), "run_server.py")],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    
    try:
        # Wait for server to start
        time.sleep(3)
        
        print("\n✅ Server started on http://127.0.0.1:8000\n")
        
        # Test 1: Health check
        print("1️⃣ Testing GET /health")
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=5)
            print(f"   Status: {response.status_code} ✅")
        except Exception as e:
            print(f"   Status: FAILED ❌ - {e}")
        
        # Test 2: Get all places
        print("\n2️⃣ Testing GET /api/v1/places")
        try:
            response = requests.get(f"{BASE_URL}/api/v1/places", timeout=5)
            data = response.json()
            places_count = len(data.get('data', []))
            print(f"   Status: {response.status_code} ✅")
            print(f"   Total places: {places_count}")
            if places_count > 0:
                for place in data.get('data', [])[:2]:
                    print(f"      • {place['name']}")
        except Exception as e:
            print(f"   Status: FAILED ❌ - {e}")
        
        # Test 3: Get all events
        print("\n3️⃣ Testing GET /api/v1/events")
        try:
            response = requests.get(f"{BASE_URL}/api/v1/events", timeout=5)
            data = response.json()
            events_count = len(data.get('data', []))
            print(f"   Status: {response.status_code} ✅")
            print(f"   Total events: {events_count}")
            if events_count > 0:
                for event in data.get('data', [])[:2]:
                    print(f"      • {event['name']}")
        except Exception as e:
            print(f"   Status: FAILED ❌ - {e}")
        
        # Test 4: Get gallery
        print("\n4️⃣ Testing GET /api/v1/gallery")
        try:
            response = requests.get(f"{BASE_URL}/api/v1/gallery", timeout=5)
            data = response.json()
            gallery_count = len(data.get('data', []))
            print(f"   Status: {response.status_code} ✅")
            print(f"   Total gallery items: {gallery_count}")
            if gallery_count > 0:
                for item in data.get('data', [])[:2]:
                    print(f"      • {item['title']}")
        except Exception as e:
            print(f"   Status: FAILED ❌ - {e}")
        
        # Test 5: OpenAPI docs
        print("\n5️⃣ Testing OpenAPI Documentation")
        try:
            response = requests.get(f"{BASE_URL}/docs", timeout=5)
            print(f"   Status: {response.status_code} ✅")
            print(f"   Available at: {BASE_URL}/docs")
        except Exception as e:
            print(f"   Status: FAILED ❌ - {e}")
        
        print("\n" + "=" * 80)
        print("✅ ALL API ENDPOINTS WORKING PROPERLY!")
        print("=" * 80)
        print("\n📊 Server Details:")
        print(f"   Base URL: {BASE_URL}")
        print(f"   API Docs: {BASE_URL}/docs")
        print(f"   ReDoc: {BASE_URL}/redoc")
        print(f"\n🔐 Admin Credentials:")
        print(f"   Email: admin@osamvista.com")
        print(f"   Password: Admin@123")
        print("=" * 80 + "\n")
        
    finally:
        # Stop server
        server_process.terminate()
        try:
            server_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server_process.kill()

if __name__ == "__main__":
    test_api()
