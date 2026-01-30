# Gallery API Documentation

## Overview
The Gallery API provides complete CRUD operations for managing image metadata organized by categories. Image files are stored externally; this API manages only the metadata (URLs, titles, descriptions, and image attributes).

## Gallery Categories
- `temple` - Temple images
- `mythology` - Mythology-related images
- `nature` - Nature and landscape images
- `cultural` - Cultural heritage images
- `festival` - Festival and celebration images
- `monument` - Monument and historical images
- `other` - Miscellaneous images

## Image Metadata Fields
- **image_url** - URL to the image (unique, required)
- **title** - Image title for display
- **description** - Detailed description
- **alt_text** - Accessibility text
- **width** - Image width in pixels
- **height** - Image height in pixels
- **file_size** - File size in bytes
- **mime_type** - MIME type (e.g., image/jpeg)

## Database Schema

```sql
CREATE TABLE gallery (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category ENUM('temple', 'mythology', 'nature', 'cultural', 'festival', 'monument', 'other') NOT NULL,
  image_url VARCHAR(1024) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  alt_text VARCHAR(500),
  width INT,
  height INT,
  file_size INT,
  mime_type VARCHAR(50),
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX (category),
  INDEX (title),
  UNIQUE KEY (image_url)
);
```

## API Endpoints

### 1. Add Image to Gallery
**POST** `/api/gallery`

Add a new image metadata entry to the gallery.

**Request Body:**
```json
{
  "category": "temple",
  "image_url": "https://cdn.example.com/temple-01.jpg",
  "title": "Shiva Temple",
  "description": "Ancient temple dedicated to Lord Shiva",
  "alt_text": "Ancient stone temple with intricate carvings",
  "width": 1920,
  "height": 1080,
  "file_size": 1024000,
  "mime_type": "image/jpeg"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "category": "temple",
  "image_url": "https://cdn.example.com/temple-01.jpg",
  "title": "Shiva Temple",
  "description": "Ancient temple dedicated to Lord Shiva",
  "alt_text": "Ancient stone temple with intricate carvings",
  "width": 1920,
  "height": 1080,
  "file_size": 1024000,
  "mime_type": "image/jpeg",
  "is_active": true,
  "created_at": "2026-01-30T12:25:00.000000",
  "updated_at": "2026-01-30T12:25:00.000000"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8000/api/gallery \
  -H "Content-Type: application/json" \
  -d '{
    "category": "temple",
    "image_url": "https://cdn.example.com/temple-01.jpg",
    "title": "Shiva Temple",
    "description": "Ancient temple dedicated to Lord Shiva",
    "alt_text": "Ancient stone temple with intricate carvings",
    "width": 1920,
    "height": 1080,
    "file_size": 1024000,
    "mime_type": "image/jpeg"
  }'
```

---

### 2. Get All Gallery Entries
**GET** `/api/gallery`

Retrieve all gallery entries with optional search, filtering, and pagination.

**Query Parameters:**
- `skip` (default: 0) - Skip records
- `limit` (default: 100) - Limit records (max: 1000)
- `active_only` (default: true) - Show only active entries
- `search` (optional) - Search by title, description, or alt text

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "category": "temple",
    "image_url": "https://cdn.example.com/temple-01.jpg",
    "title": "Shiva Temple",
    "description": "Ancient temple dedicated to Lord Shiva",
    "alt_text": "Ancient stone temple with intricate carvings",
    "width": 1920,
    "height": 1080,
    "file_size": 1024000,
    "mime_type": "image/jpeg",
    "is_active": true,
    "created_at": "2026-01-30T12:25:00.000000",
    "updated_at": "2026-01-30T12:25:00.000000"
  },
  {
    "id": 2,
    "category": "mythology",
    "image_url": "https://cdn.example.com/mythology-01.jpg",
    "title": "Krishna and Radha",
    "description": "Divine love story illustration",
    "alt_text": "Krishna playing flute with Radha",
    "width": 1600,
    "height": 1200,
    "file_size": 856000,
    "mime_type": "image/jpeg",
    "is_active": true,
    "created_at": "2026-01-30T12:26:00.000000",
    "updated_at": "2026-01-30T12:26:00.000000"
  }
]
```

**cURL:**
```bash
# Get all active gallery entries
curl http://localhost:8000/api/gallery

# Get with pagination
curl "http://localhost:8000/api/gallery?skip=0&limit=20"

# Search gallery
curl "http://localhost:8000/api/gallery?search=temple"

# Include inactive entries
curl "http://localhost:8000/api/gallery?active_only=false"
```

---

### 3. Get Recent Gallery Entries
**GET** `/api/gallery/recent`

Retrieve most recent active gallery entries.

**Query Parameters:**
- `limit` (default: 20, max: 100) - Number of entries to return

**Response (200 OK):**
```json
{
  "entries": [
    {
      "id": 2,
      "category": "mythology",
      "image_url": "https://cdn.example.com/mythology-01.jpg",
      "title": "Krishna and Radha",
      "description": "Divine love story illustration",
      "alt_text": "Krishna playing flute with Radha",
      "width": 1600,
      "height": 1200,
      "file_size": 856000,
      "mime_type": "image/jpeg",
      "is_active": true,
      "created_at": "2026-01-30T12:26:00.000000",
      "updated_at": "2026-01-30T12:26:00.000000"
    }
  ],
  "total_count": 1
}
```

**cURL:**
```bash
curl http://localhost:8000/api/gallery/recent
curl "http://localhost:8000/api/gallery/recent?limit=10"
```

---

### 4. Get Gallery by Category
**GET** `/api/gallery/category/{category}`

Retrieve gallery entries filtered by category.

**Path Parameters:**
- `category` - One of: temple, mythology, nature, cultural, festival, monument, other

**Query Parameters:**
- `skip` (default: 0)
- `limit` (default: 100)

**Response (200 OK):**
```json
{
  "category": "temple",
  "entries": [
    {
      "id": 1,
      "category": "temple",
      "image_url": "https://cdn.example.com/temple-01.jpg",
      "title": "Shiva Temple",
      "description": "Ancient temple dedicated to Lord Shiva",
      "alt_text": "Ancient stone temple with intricate carvings",
      "width": 1920,
      "height": 1080,
      "file_size": 1024000,
      "mime_type": "image/jpeg",
      "is_active": true,
      "created_at": "2026-01-30T12:25:00.000000",
      "updated_at": "2026-01-30T12:25:00.000000"
    }
  ],
  "total_count": 1
}
```

**cURL:**
```bash
curl http://localhost:8000/api/gallery/category/temple
curl http://localhost:8000/api/gallery/category/mythology
curl "http://localhost:8000/api/gallery/category/nature?skip=0&limit=10"
```

---

### 5. Get Gallery Statistics
**GET** `/api/gallery/stats/categories`

Get count of gallery entries by category.

**Response (200 OK):**
```json
{
  "temple": 5,
  "mythology": 8,
  "nature": 12,
  "cultural": 6,
  "festival": 4,
  "monument": 3,
  "other": 2
}
```

**cURL:**
```bash
curl http://localhost:8000/api/gallery/stats/categories
```

---

### 6. Get Single Gallery Entry
**GET** `/api/gallery/{gallery_id}`

Retrieve a specific gallery entry by ID.

**Path Parameters:**
- `gallery_id` (int) - Gallery entry ID

**Response (200 OK):**
```json
{
  "id": 1,
  "category": "temple",
  "image_url": "https://cdn.example.com/temple-01.jpg",
  "title": "Shiva Temple",
  "description": "Ancient temple dedicated to Lord Shiva",
  "alt_text": "Ancient stone temple with intricate carvings",
  "width": 1920,
  "height": 1080,
  "file_size": 1024000,
  "mime_type": "image/jpeg",
  "is_active": true,
  "created_at": "2026-01-30T12:25:00.000000",
  "updated_at": "2026-01-30T12:25:00.000000"
}
```

**Error (404 Not Found):**
```json
{
  "detail": "Gallery entry not found"
}
```

**cURL:**
```bash
curl http://localhost:8000/api/gallery/1
```

---

### 7. Update Gallery Entry
**PUT** `/api/gallery/{gallery_id}`

Update a gallery entry with partial fields.

**Path Parameters:**
- `gallery_id` (int) - Gallery entry ID

**Request Body (all fields optional):**
```json
{
  "title": "Shiva Temple - Updated",
  "description": "Ancient temple with beautiful architecture",
  "is_active": true
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "category": "temple",
  "image_url": "https://cdn.example.com/temple-01.jpg",
  "title": "Shiva Temple - Updated",
  "description": "Ancient temple with beautiful architecture",
  "alt_text": "Ancient stone temple with intricate carvings",
  "width": 1920,
  "height": 1080,
  "file_size": 1024000,
  "mime_type": "image/jpeg",
  "is_active": true,
  "created_at": "2026-01-30T12:25:00.000000",
  "updated_at": "2026-01-30T12:27:30.000000"
}
```

**cURL:**
```bash
curl -X PUT http://localhost:8000/api/gallery/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Shiva Temple - Updated",
    "description": "Ancient temple with beautiful architecture"
  }'
```

---

### 8. Delete Gallery Entry
**DELETE** `/api/gallery/{gallery_id}`

Delete a gallery entry permanently.

**Path Parameters:**
- `gallery_id` (int) - Gallery entry ID

**Response (204 No Content)**

**cURL:**
```bash
curl -X DELETE http://localhost:8000/api/gallery/1
```

---

### 9. Toggle Gallery Entry Status
**PATCH** `/api/gallery/{gallery_id}/toggle-status`

Toggle gallery entry active/inactive status.

**Path Parameters:**
- `gallery_id` (int) - Gallery entry ID

**Response (200 OK):**
```json
{
  "id": 1,
  "category": "temple",
  "image_url": "https://cdn.example.com/temple-01.jpg",
  "title": "Shiva Temple",
  "description": "Ancient temple dedicated to Lord Shiva",
  "alt_text": "Ancient stone temple with intricate carvings",
  "width": 1920,
  "height": 1080,
  "file_size": 1024000,
  "mime_type": "image/jpeg",
  "is_active": false,
  "created_at": "2026-01-30T12:25:00.000000",
  "updated_at": "2026-01-30T12:28:00.000000"
}
```

**cURL:**
```bash
curl -X PATCH http://localhost:8000/api/gallery/1/toggle-status
```

---

## HTTP Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| 201 | Created | Gallery entry successfully created |
| 200 | OK | Request successful, data returned |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid category or request format |
| 404 | Not Found | Gallery entry ID doesn't exist |
| 500 | Internal Server Error | Database or server error |

## Interactive Testing

Access the Swagger UI at: **http://localhost:8000/docs**

Or ReDoc at: **http://localhost:8000/redoc**

Both provide interactive documentation and testing capabilities.

## Architecture

```
GalleryController (HTTP Layer)
    ↓
GalleryService (Business Logic Layer)
    ↓
Gallery Model (Database Layer - SQLAlchemy)
    ↓
MySQL Database (gallery table)
```

**Separation of Concerns:**
- **Controller**: HTTP request/response handling
- **Service**: Business logic (CRUD, filtering, search, statistics)
- **Model**: Database schema and relationships
- **Schema**: Pydantic validation and serialization

## Database Persistence

✓ All gallery metadata persists to MySQL database
✓ Unique image_url constraint ensures no duplicates
✓ Automatic timestamps (created_at, updated_at)
✓ Status tracking (is_active flag)
✓ Indexed fields for efficient querying (category, title, image_url)
✓ Type safety with ENUM for categories

## Search & Filtering

**Search by title, description, or alt text:**
```bash
curl "http://localhost:8000/api/gallery?search=temple"
```

**Filter by category:**
```bash
curl http://localhost:8000/api/gallery/category/temple
```

**Show only active entries:**
```bash
curl "http://localhost:8000/api/gallery?active_only=true"
```

**Get recent entries:**
```bash
curl http://localhost:8000/api/gallery/recent
```

## Pagination

All list endpoints support pagination:

```bash
# Skip 10, get 5
curl "http://localhost:8000/api/gallery?skip=10&limit=5"

# Get category entries with pagination
curl "http://localhost:8000/api/gallery/category/temple?skip=0&limit=20"
```

**Default:** skip=0, limit=100
**Max limit:** 1000

## Image Metadata Format Example

```json
{
  "category": "temple",
  "image_url": "https://storage.example.com/images/temple-001.jpg",
  "title": "Ancient Shiva Temple",
  "description": "A 500-year-old temple with intricate stone carvings",
  "alt_text": "Large stone temple with multiple spires and decorative elements",
  "width": 2048,
  "height": 1536,
  "file_size": 2097152,
  "mime_type": "image/jpeg"
}
```

## Notes

- **No file upload**: This API only manages image metadata. Images must be uploaded to external storage (CDN, S3, etc.) and the URL provided.
- **URL uniqueness**: Each image_url must be unique. Attempting to add a duplicate URL will fail.
- **Metadata optional**: Only `category`, `image_url`, and `title` are required. Other fields are optional.
- **Accessibility**: Always provide `alt_text` for better accessibility and SEO.
- **Image dimensions**: Store width/height for responsive image handling and layout calculations.
