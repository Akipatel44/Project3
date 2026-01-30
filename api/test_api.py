#!/usr/bin/env python
"""Test all API endpoints"""
import requests
import json
from pprint import pprint

BASE_URL = "http://127.0.0.1:8000"

def test_api():
    print("="*80)
    print("OSAMVISTA API - COMPREHENSIVE ENDPOINT TEST")
    print("="*80)
    
    # 1. Health Check
    print("\n✓ Testing Health Endpoint")
    r = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {r.status_code} | Response: {r.json()}")
    
    # 2. Root Endpoint
    print("\n✓ Testing Root Endpoint")
    r = requests.get(f"{BASE_URL}/")
    print(f"   Status: {r.status_code} | Response: {r.json()}")
    
    # 3. Swagger Documentation
    print("\n✓ Testing Swagger UI")
    r = requests.get(f"{BASE_URL}/docs")
    print(f"   Status: {r.status_code} | Available at /docs")
    
    # 4. Test Auth Register
    print("\n✓ Testing Auth Register")
    user_data = {
        "email": "test@osamvista.com",
        "password": "Test@123",
        "full_name": "Test User"
    }
    r = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        user_id = r.json().get("id")
        print(f"   User Created: {r.json()}")
    else:
        print(f"   Response: {r.json()}")
    
    # 5. Test Auth Login
    print("\n✓ Testing Auth Login")
    login_data = {
        "email": "admin@osamvista.com",
        "password": "Admin@123"
    }
    r = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        token = r.json().get("access_token")
        print(f"   Token: {token[:50]}...")
    else:
        print(f"   Response: {r.json()}")
    
    headers = {"Authorization": f"Bearer {token}"} if r.status_code == 200 else {}
    
    # 6-12. Places API (7 endpoints)
    print("\n" + "="*80)
    print("PLACES API - 7 ENDPOINTS")
    print("="*80)
    
    # Create Place
    print("\n✓ POST /api/places - Create Place")
    place_data = {
        "name": "Test Temple",
        "description": "A test temple",
        "address": "Test Address",
        "latitude": 22.0,
        "longitude": 71.0,
        "place_type": "temple"
    }
    r = requests.post(f"{BASE_URL}/api/places", json=place_data, headers=headers)
    print(f"   Status: {r.status_code}")
    if r.status_code in [200, 201]:
        place = r.json()
        place_id = place.get("id")
        print(f"   Place Created: {place.get('name')}")
    
    # Get all places
    print("\n✓ GET /api/places - Get All Places")
    r = requests.get(f"{BASE_URL}/api/places", headers=headers)
    print(f"   Status: {r.status_code} | Count: {len(r.json()) if isinstance(r.json(), list) else 'N/A'}")
    
    # Get place by ID
    if 'place_id' in locals():
        print(f"\n✓ GET /api/places/{place_id} - Get Place by ID")
        r = requests.get(f"{BASE_URL}/api/places/{place_id}", headers=headers)
        print(f"   Status: {r.status_code} | Place: {r.json().get('name', 'N/A')}")
    
    # Update place
    if 'place_id' in locals():
        print(f"\n✓ PUT /api/places/{place_id} - Update Place")
        update_data = {"name": "Updated Temple"}
        r = requests.put(f"{BASE_URL}/api/places/{place_id}", json=update_data, headers=headers)
        print(f"   Status: {r.status_code}")
    
    # Delete place
    if 'place_id' in locals():
        print(f"\n✓ DELETE /api/places/{place_id} - Delete Place")
        r = requests.delete(f"{BASE_URL}/api/places/{place_id}", headers=headers)
        print(f"   Status: {r.status_code}")
    
    # Search places
    print("\n✓ GET /api/places?search=temple - Search Places")
    r = requests.get(f"{BASE_URL}/api/places?search=temple", headers=headers)
    print(f"   Status: {r.status_code}")
    
    # Filter by type
    print("\n✓ GET /api/places?place_type=temple - Filter by Type")
    r = requests.get(f"{BASE_URL}/api/places?place_type=temple", headers=headers)
    print(f"   Status: {r.status_code}")
    
    print("\n" + "="*80)
    print("EVENTS API - 10 ENDPOINTS")
    print("="*80)
    
    # Create Event
    from datetime import datetime, timedelta
    print("\n✓ POST /api/events - Create Event")
    event_data = {
        "title": "Test Marathon",
        "description": "A test marathon event",
        "start_date": (datetime.now() + timedelta(days=10)).isoformat(),
        "end_date": (datetime.now() + timedelta(days=10, hours=6)).isoformat(),
        "address": "Test Location",
        "event_type": "marathon",
        "created_by": 1
    }
    r = requests.post(f"{BASE_URL}/api/events", json=event_data, headers=headers)
    print(f"   Status: {r.status_code}")
    if r.status_code in [200, 201]:
        event = r.json()
        event_id = event.get("id")
        print(f"   Event Created: {event.get('title')}")
    
    # Get all events
    print("\n✓ GET /api/events - Get All Events")
    r = requests.get(f"{BASE_URL}/api/events", headers=headers)
    print(f"   Status: {r.status_code} | Count: {len(r.json()) if isinstance(r.json(), list) else 'N/A'}")
    
    print("\n" + "="*80)
    print("GALLERY API - 9 ENDPOINTS")
    print("="*80)
    
    # Create Gallery
    print("\n✓ POST /api/gallery - Create Gallery Entry")
    gallery_data = {
        "title": "Test Image",
        "description": "Test gallery image",
        "category": "temple",
        "image_url": "https://via.placeholder.com/400"
    }
    r = requests.post(f"{BASE_URL}/api/gallery", json=gallery_data, headers=headers)
    print(f"   Status: {r.status_code}")
    if r.status_code in [200, 201]:
        gallery = r.json()
        print(f"   Gallery Created: {gallery.get('title')}")
    
    # Get all gallery
    print("\n✓ GET /api/gallery - Get All Gallery")
    r = requests.get(f"{BASE_URL}/api/gallery", headers=headers)
    print(f"   Status: {r.status_code} | Count: {len(r.json()) if isinstance(r.json(), list) else 'N/A'}")
    
    # Get recent gallery
    print("\n✓ GET /api/gallery/recent - Get Recent Gallery")
    r = requests.get(f"{BASE_URL}/api/gallery/recent", headers=headers)
    print(f"   Status: {r.status_code}")
    
    # Get by category
    print("\n✓ GET /api/gallery/category/temple - Get by Category")
    r = requests.get(f"{BASE_URL}/api/gallery/category/temple", headers=headers)
    print(f"   Status: {r.status_code}")
    
    # Get statistics
    print("\n✓ GET /api/gallery/stats/categories - Get Statistics")
    r = requests.get(f"{BASE_URL}/api/gallery/stats/categories", headers=headers)
    print(f"   Status: {r.status_code}")
    
    print("\n" + "="*80)
    print("✅ API TESTING COMPLETE")
    print("="*80)

if __name__ == "__main__":
    test_api()
