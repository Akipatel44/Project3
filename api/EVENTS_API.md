# Events API Documentation

## Overview
The Events API provides complete CRUD operations for managing events like Marathons and Ashadhi Beej Melas. All data is persisted to the MySQL database.

## Event Types
- `marathon` - Marathon events
- `ashadhi_beej_mela` - Ashadhi Beej Mela events

## Database Schema

```sql
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  event_type ENUM('marathon', 'ashadhi_beej_mela') NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME,
  location VARCHAR(500),
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX (name),
  INDEX (event_type),
  INDEX (start_date)
);
```

## API Endpoints

### 1. Create Event
**POST** `/api/events`

Create a new event in the database.

**Request Body:**
```json
{
  "name": "Mumbai Marathon 2026",
  "description": "Annual city marathon event",
  "event_type": "marathon",
  "start_date": "2026-02-15T06:00:00",
  "end_date": "2026-02-15T10:00:00",
  "location": "Marine Drive, Mumbai"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Mumbai Marathon 2026",
  "description": "Annual city marathon event",
  "event_type": "marathon",
  "start_date": "2026-02-15T06:00:00",
  "end_date": "2026-02-15T10:00:00",
  "location": "Marine Drive, Mumbai",
  "is_active": true,
  "created_at": "2026-01-30T12:18:28.123456",
  "updated_at": "2026-01-30T12:18:28.123456"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mumbai Marathon 2026",
    "description": "Annual city marathon event",
    "event_type": "marathon",
    "start_date": "2026-02-15T06:00:00",
    "end_date": "2026-02-15T10:00:00",
    "location": "Marine Drive, Mumbai"
  }'
```

---

### 2. Get All Events
**GET** `/api/events`

Retrieve all events with optional pagination, filtering, and search.

**Query Parameters:**
- `skip` (default: 0) - Skip records
- `limit` (default: 100) - Limit records (max: 1000)
- `active_only` (default: false) - Show only active events
- `search` (optional) - Search by name or description

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Mumbai Marathon 2026",
    "description": "Annual city marathon event",
    "event_type": "marathon",
    "start_date": "2026-02-15T06:00:00",
    "end_date": "2026-02-15T10:00:00",
    "location": "Marine Drive, Mumbai",
    "is_active": true,
    "created_at": "2026-01-30T12:18:28.123456",
    "updated_at": "2026-01-30T12:18:28.123456"
  },
  {
    "id": 2,
    "name": "Ashadhi Beej Mela 2026",
    "description": "Traditional mela celebration",
    "event_type": "ashadhi_beej_mela",
    "start_date": "2026-06-15T00:00:00",
    "end_date": "2026-06-30T23:59:59",
    "location": "Nashik",
    "is_active": true,
    "created_at": "2026-01-30T12:20:00.000000",
    "updated_at": "2026-01-30T12:20:00.000000"
  }
]
```

**cURL:**
```bash
# Get all events
curl http://localhost:8000/api/events

# Get active events with pagination
curl "http://localhost:8000/api/events?skip=0&limit=10&active_only=true"

# Search events
curl "http://localhost:8000/api/events?search=Marathon"
```

---

### 3. Get Upcoming Events
**GET** `/api/events/upcoming`

Retrieve events with start_date >= now and is_active = true.

**Query Parameters:**
- `skip` (default: 0)
- `limit` (default: 100)

**Response (200 OK):**
```json
{
  "events": [
    {
      "id": 1,
      "name": "Mumbai Marathon 2026",
      "description": "Annual city marathon event",
      "event_type": "marathon",
      "start_date": "2026-02-15T06:00:00",
      "end_date": "2026-02-15T10:00:00",
      "location": "Marine Drive, Mumbai",
      "is_active": true,
      "created_at": "2026-01-30T12:18:28.123456",
      "updated_at": "2026-01-30T12:18:28.123456"
    }
  ],
  "total_count": 1
}
```

**cURL:**
```bash
curl http://localhost:8000/api/events/upcoming
```

---

### 4. Get Past Events
**GET** `/api/events/past`

Retrieve events with start_date < now.

**Query Parameters:**
- `skip` (default: 0)
- `limit` (default: 100)

**Response (200 OK):**
```json
{
  "events": [],
  "total_count": 0
}
```

**cURL:**
```bash
curl http://localhost:8000/api/events/past
```

---

### 5. Get Events by Type
**GET** `/api/events/type/{event_type}`

Retrieve events filtered by type (marathon or ashadhi_beej_mela).

**Path Parameters:**
- `event_type` - marathon or ashadhi_beej_mela

**Query Parameters:**
- `skip` (default: 0)
- `limit` (default: 100)

**Response (200 OK):**
```json
{
  "event_type": "marathon",
  "events": [
    {
      "id": 1,
      "name": "Mumbai Marathon 2026",
      "description": "Annual city marathon event",
      "event_type": "marathon",
      "start_date": "2026-02-15T06:00:00",
      "end_date": "2026-02-15T10:00:00",
      "location": "Marine Drive, Mumbai",
      "is_active": true,
      "created_at": "2026-01-30T12:18:28.123456",
      "updated_at": "2026-01-30T12:18:28.123456"
    }
  ],
  "total_count": 1
}
```

**cURL:**
```bash
curl http://localhost:8000/api/events/type/marathon
curl http://localhost:8000/api/events/type/ashadhi_beej_mela
```

---

### 6. Get Event Statistics
**GET** `/api/events/stats/types`

Get count of events by type.

**Response (200 OK):**
```json
{
  "marathon": 5,
  "ashadhi_beej_mela": 3
}
```

**cURL:**
```bash
curl http://localhost:8000/api/events/stats/types
```

---

### 7. Get Single Event
**GET** `/api/events/{event_id}`

Retrieve a specific event by ID.

**Path Parameters:**
- `event_id` (int) - Event ID

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Mumbai Marathon 2026",
  "description": "Annual city marathon event",
  "event_type": "marathon",
  "start_date": "2026-02-15T06:00:00",
  "end_date": "2026-02-15T10:00:00",
  "location": "Marine Drive, Mumbai",
  "is_active": true,
  "created_at": "2026-01-30T12:18:28.123456",
  "updated_at": "2026-01-30T12:18:28.123456"
}
```

**Error (404 Not Found):**
```json
{
  "detail": "Event not found"
}
```

**cURL:**
```bash
curl http://localhost:8000/api/events/1
```

---

### 8. Update Event
**PUT** `/api/events/{event_id}`

Update an event with partial fields.

**Path Parameters:**
- `event_id` (int) - Event ID

**Request Body (all fields optional):**
```json
{
  "name": "Mumbai Marathon 2026 - Updated",
  "location": "Marine Drive to Worli, Mumbai",
  "is_active": true
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Mumbai Marathon 2026 - Updated",
  "description": "Annual city marathon event",
  "event_type": "marathon",
  "start_date": "2026-02-15T06:00:00",
  "end_date": "2026-02-15T10:00:00",
  "location": "Marine Drive to Worli, Mumbai",
  "is_active": true,
  "created_at": "2026-01-30T12:18:28.123456",
  "updated_at": "2026-01-30T12:21:45.654321"
}
```

**cURL:**
```bash
curl -X PUT http://localhost:8000/api/events/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mumbai Marathon 2026 - Updated",
    "location": "Marine Drive to Worli, Mumbai"
  }'
```

---

### 9. Delete Event
**DELETE** `/api/events/{event_id}`

Delete an event permanently.

**Path Parameters:**
- `event_id` (int) - Event ID

**Response (204 No Content)**

**cURL:**
```bash
curl -X DELETE http://localhost:8000/api/events/1
```

---

### 10. Toggle Event Status
**PATCH** `/api/events/{event_id}/toggle-status`

Toggle event active/inactive status.

**Path Parameters:**
- `event_id` (int) - Event ID

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Mumbai Marathon 2026",
  "description": "Annual city marathon event",
  "event_type": "marathon",
  "start_date": "2026-02-15T06:00:00",
  "end_date": "2026-02-15T10:00:00",
  "location": "Marine Drive, Mumbai",
  "is_active": false,
  "created_at": "2026-01-30T12:18:28.123456",
  "updated_at": "2026-01-30T12:22:15.987654"
}
```

**cURL:**
```bash
curl -X PATCH http://localhost:8000/api/events/1/toggle-status
```

---

## HTTP Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| 201 | Created | Event successfully created |
| 200 | OK | Request successful, data returned |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid event type or request format |
| 404 | Not Found | Event ID doesn't exist |
| 500 | Internal Server Error | Database or server error |

## Interactive Testing

Access the Swagger UI at: **http://localhost:8000/docs**

Or ReDoc at: **http://localhost:8000/redoc**

Both provide interactive documentation and testing capabilities.

## Architecture

```
EventController (HTTP Layer)
    ↓
EventService (Business Logic Layer)
    ↓
Event Model (Database Layer - SQLAlchemy)
    ↓
MySQL Database (events table)
```

**Separation of Concerns:**
- **Controller**: HTTP request/response handling
- **Service**: Business logic (CRUD, filtering, search)
- **Model**: Database schema and relationships
- **Schema**: Pydantic validation and serialization

## Database Persistence

✓ All events are persisted to MySQL database
✓ Automatic timestamps (created_at, updated_at)
✓ Status tracking (is_active flag)
✓ Indexed fields for efficient querying (name, event_type, start_date)
✓ Type safety with ENUM for event_type

## Search & Filtering

**Search by name or description:**
```bash
curl "http://localhost:8000/api/events?search=marathon"
```

**Filter by type:**
```bash
curl http://localhost:8000/api/events/type/marathon
```

**Show only active events:**
```bash
curl "http://localhost:8000/api/events?active_only=true"
```

**Get upcoming events:**
```bash
curl http://localhost:8000/api/events/upcoming
```

## Pagination

All list endpoints support pagination:

```bash
# Skip 10, get 5
curl "http://localhost:8000/api/events?skip=10&limit=5"
```

**Default:** skip=0, limit=100
**Max limit:** 1000
