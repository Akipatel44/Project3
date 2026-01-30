# Places API Documentation

## Overview

Complete CRUD API for managing places - temples, mythology spots, and nature spots.

All data is stored in and retrieved from the MySQL database.

Base URL: `/api/places`

---

## Place Types

- `temple` - Religious temples and sacred sites
- `mythology_spot` - Sites related to mythology and folklore  
- `nature_spot` - Natural attractions and scenic locations

---

## Endpoints

### 1. Create Place
**POST** `/api/places`

Create a new place in the database.

**Request Body:**
```json
{
  "name": "Varanasi Ghats",
  "description": "Ancient ghats along the Ganges River with spiritual significance",
  "place_type": "temple",
  "latitude": 25.3176,
  "longitude": 82.9739,
  "address": "Varanasi, Uttar Pradesh, India"
}
```

**Field Requirements:**
- `name`: String, 1-255 characters (required)
- `place_type`: One of [temple, mythology_spot, nature_spot] (required)
- `description`: String, max 5000 characters (optional)
- `latitude`: Float (optional)
- `longitude`: Float (optional)
- `address`: String, max 500 characters (optional)

**Response (201 Created):**
```json
{
  "message": "Place created successfully",
  "place": {
    "id": 1,
    "name": "Varanasi Ghats",
    "description": "Ancient ghats along the Ganges River...",
    "place_type": "temple",
    "latitude": 25.3176,
    "longitude": 82.9739,
    "address": "Varanasi, Uttar Pradesh, India",
    "created_at": "2026-01-30T12:00:00",
    "updated_at": "2026-01-30T12:00:00"
  }
}
```

---

### 2. Get All Places
**GET** `/api/places`

Retrieve all places with pagination and optional search.

**Query Parameters:**
- `skip` - Offset for pagination (default: 0, min: 0)
- `limit` - Max results to return (default: 50, min: 1, max: 100)
- `search` - Optional search query (searches name and description)

**Examples:**
```bash
# Get first 50 places
GET /api/places

# Get next 50 places
GET /api/places?skip=50&limit=50

# Search for places
GET /api/places?search=Ganges

# Get 20 results starting from record 10
GET /api/places?skip=10&limit=20
```

**Response (200 OK):**
```json
{
  "total": 100,
  "count": 10,
  "places": [
    {
      "id": 1,
      "name": "Varanasi Ghats",
      "description": "...",
      "place_type": "temple",
      "latitude": 25.3176,
      "longitude": 82.9739,
      "address": "Varanasi, Uttar Pradesh, India",
      "created_at": "2026-01-30T12:00:00",
      "updated_at": "2026-01-30T12:00:00"
    }
  ]
}
```

---

### 3. Get Place by ID
**GET** `/api/places/{place_id}`

Get a specific place by its ID.

**Path Parameters:**
- `place_id` - Place ID (integer)

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Varanasi Ghats",
  "description": "...",
  "place_type": "temple",
  "latitude": 25.3176,
  "longitude": 82.9739,
  "address": "Varanasi, Uttar Pradesh, India",
  "created_at": "2026-01-30T12:00:00",
  "updated_at": "2026-01-30T12:00:00"
}
```

**Possible Errors:**
- `404 Not Found` - Place with given ID doesn't exist

---

### 4. Get Places by Type
**GET** `/api/places/type/{place_type}`

Get all places of a specific type.

**Path Parameters:**
- `place_type` - One of: temple, mythology_spot, nature_spot

**Query Parameters:**
- `skip` - Pagination offset (default: 0)
- `limit` - Max results (default: 50, max: 100)

**Example:**
```bash
# Get all temples
GET /api/places/type/temple

# Get mythology spots with pagination
GET /api/places/type/mythology_spot?skip=0&limit=20
```

**Response (200 OK):**
```json
{
  "place_type": "temple",
  "total": 25,
  "count": 10,
  "places": [...]
}
```

**Possible Errors:**
- `400 Bad Request` - Invalid place_type

---

### 5. Update Place
**PUT** `/api/places/{place_id}`

Update an existing place (all fields optional).

**Path Parameters:**
- `place_id` - Place ID to update

**Request Body (all optional):**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "place_type": "temple",
  "latitude": 25.3176,
  "longitude": 82.9739,
  "address": "New Address"
}
```

**Response (200 OK):**
```json
{
  "message": "Place updated successfully",
  "place": {...}
}
```

**Possible Errors:**
- `404 Not Found` - Place doesn't exist
- `400 Bad Request` - Invalid update data

---

### 6. Delete Place
**DELETE** `/api/places/{place_id}`

Delete a place from the database.

**Path Parameters:**
- `place_id` - Place ID to delete

**Response (200 OK):**
```json
{
  "message": "Place deleted successfully",
  "place_id": 1
}
```

**Possible Errors:**
- `404 Not Found` - Place doesn't exist

---

### 7. Place Type Statistics
**GET** `/api/places/stats/types`

Get count of places by type.

**Response (200 OK):**
```json
{
  "message": "Place type statistics",
  "stats": {
    "temple": 15,
    "mythology_spot": 8,
    "nature_spot": 12
  },
  "total": 35
}
```

---

## cURL Examples

### Create a Temple
```bash
curl -X POST http://localhost:8000/api/places \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Taj Mahal",
    "description": "Ivory-white marble mausoleum",
    "place_type": "temple",
    "latitude": 27.1751,
    "longitude": 78.0421,
    "address": "Agra, Uttar Pradesh, India"
  }'
```

### Get All Temples
```bash
curl http://localhost:8000/api/places/type/temple
```

### Search Places
```bash
curl "http://localhost:8000/api/places?search=Ganges"
```

### Get Specific Place
```bash
curl http://localhost:8000/api/places/1
```

### Update Place
```bash
curl -X PUT http://localhost:8000/api/places/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description"
  }'
```

### Delete Place
```bash
curl -X DELETE http://localhost:8000/api/places/1
```

### Get Statistics
```bash
curl http://localhost:8000/api/places/stats/types
```

---

## Database Schema

### places table
```sql
CREATE TABLE places (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL INDEX,
  description TEXT,
  place_type ENUM('temple', 'mythology_spot', 'nature_spot') NOT NULL INDEX,
  latitude FLOAT,
  longitude FLOAT,
  address VARCHAR(500),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);
```

---

## Pagination

All list endpoints support pagination:

- **skip**: Start position (default: 0)
- **limit**: Number of results (default: 50, max: 100)

Example:
```
Total records: 150
/api/places?skip=0&limit=50    # Records 1-50
/api/places?skip=50&limit=50   # Records 51-100
/api/places?skip=100&limit=50  # Records 101-150
```

---

## Search

The search endpoint uses case-insensitive matching:

```bash
# Searches both name and description
/api/places?search=gandhi

# Results include:
# - Places with "gandhi" in name
# - Places with "gandhi" in description
```

---

## Error Handling

All errors follow consistent format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## Interactive Testing

Use Swagger UI for interactive API testing:

```
http://localhost:8000/docs
```

Or ReDoc:
```
http://localhost:8000/redoc
```

Both provide try-it-out functionality.

---

## Architecture

```
Request
  ↓
PlaceController (HTTP handling)
  ↓
PlaceService (Business logic)
  ↓
Database (SQLAlchemy + MySQL)
  ↓
Response (JSON)
```

**No hardcoded data** - All data comes from the database.
