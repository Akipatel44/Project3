# OsamVista API - Database Setup Guide

## Database Architecture

**ORM:** SQLAlchemy 2.0  
**Database:** MySQL  
**Migrations:** Alembic  
**Connection Pool:** Connection pooling with health checks

## Models

### Role
- `id` - Primary Key
- `name` - Unique role identifier (SUPER_ADMIN, SUB_ADMIN, USER)
- `description` - Role description
- `created_at`, `updated_at` - Timestamps

### User
- `id` - Primary Key
- `email` - Unique email address
- `username` - Unique username
- `hashed_password` - Encrypted password
- `full_name` - User's full name
- `is_active` - Account status flag
- `is_verified` - Email verification status
- `role_id` - Foreign key to Role table
- `role` - ORM relationship to Role
- `created_at`, `updated_at`, `last_login` - Timestamps

## Setup Instructions

### 1. Prerequisites
- MySQL Server running
- Python virtual environment activated

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Initialize Database
```bash
python init_db.py
```
This will:
- Create the database if it doesn't exist
- Verify database connectivity
- Test the connection

### 4. Seed Default Roles
```bash
python seed_db.py
```
This will populate:
- SUPER_ADMIN
- SUB_ADMIN
- USER

### 5. Run Migrations
```bash
python migrate.py upgrade
```

## Migration Commands

```bash
# Apply pending migrations
python migrate.py upgrade

# Downgrade to previous migration
python migrate.py downgrade

# Show current revision
python migrate.py current

# Show migration history
python migrate.py history

# Revert all migrations
python migrate.py downgrade base
```

## Database Credentials

From `.env`:
```
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=akshay
DATABASE_PASSWORD=AKS@2025elite
DATABASE_NAME=osamvista
```

## Access via Adminer

1. Open Adminer (if running)
2. Server: `localhost`
3. Username: `akshay`
4. Password: `AKS@2025elite`
5. Database: `osamvista`

## Troubleshooting

### "Can't connect to MySQL server"
- Ensure MySQL is running
- Verify credentials in `.env`
- Check database name exists

### "Access denied for user"
- Verify username and password
- Ensure user has privileges on database

### Migration conflicts
- Check `migrations/versions/` for conflicting files
- Run `python migrate.py history` to see state
- Rollback if needed: `python migrate.py downgrade`

## Creating New Migrations

### After modifying models:

1. Create empty migration:
```bash
alembic revision -m "Description of changes"
```

2. Edit the migration file in `migrations/versions/`

3. Apply:
```bash
python migrate.py upgrade
```

## Creating New Models

1. Create model file in `app/models/`
2. Import in `app/models/__init__.py`
3. Import in `migrations/env.py`
4. Create and apply migration

Example:
```python
# app/models/product.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from app.database.session import Base
from datetime import datetime

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

## Connection Pool Configuration

Configured in `app/database/session.py`:
- **Pool pre-ping:** Enabled (tests connections before use)
- **Pool recycle:** 3600 seconds (closes idle connections)
- **Echo:** Enabled in DEBUG mode (logs SQL queries)
