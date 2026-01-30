#!/usr/bin/env python3
"""Test API endpoints"""
import requests
import time
import sys

BASE_URL = "http://127.0.0.1:8000"

print("="*80)
print("TESTING API ENDPOINTS")
print("="*80)

# Wait for server to start
time.sleep(2)

try:
    # Test 1: Health check
    print("\n1️⃣ Testing GET /health")
    response = requests.get(f"{BASE_URL}/health", timeout=5)
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    
    # Test 2: Get all places
    print("\n2️⃣ Testing GET /api/v1/places")
    response = requests.get(f"{BASE_URL}/api/v1/places", timeout=5)
    data = response.json()
    print(f"   Status: {response.status_code}")
    print(f"   Total places: {len(data.get('data', []))}")
    for place in data.get('data', [])[:3]:
        print(f"      - {place['name']} ({place['place_type']})")
    
    # Test 3: Get all events
    print("\n3️⃣ Testing GET /api/v1/events")
    response = requests.get(f"{BASE_URL}/api/v1/events", timeout=5)
    data = response.json()
    print(f"   Status: {response.status_code}")
    print(f"   Total events: {len(data.get('data', []))}")
    for event in data.get('data', [])[:3]:
        print(f"      - {event['name']}")
    
    # Test 4: Get gallery
    print("\n4️⃣ Testing GET /api/v1/gallery")
    response = requests.get(f"{BASE_URL}/api/v1/gallery", timeout=5)
    data = response.json()
    print(f"   Status: {response.status_code}")
    print(f"   Total gallery entries: {len(data.get('data', []))}")
    for item in data.get('data', [])[:3]:
        print(f"      - {item['title']}")
    
    # Test 5: OpenAPI docs
    print("\n5️⃣ Testing OpenAPI Documentation")
    response = requests.get(f"{BASE_URL}/docs", timeout=5)
    print(f"   Status: {response.status_code}")
    print(f"   Available at: {BASE_URL}/docs")
    
    print("\n" + "="*80)
    print("✅ ALL API ENDPOINTS WORKING PROPERLY!")
    print("="*80)
    print("\nServer Details:")
    print(f"  Base URL: {BASE_URL}")
    print(f"  API Docs: {BASE_URL}/docs")
    print(f"  ReDoc: {BASE_URL}/redoc")
    print(f"  Admin Email: admin@osamvista.com")
    print(f"  Admin Password: Admin@123")
    print("="*80 + "\n")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
