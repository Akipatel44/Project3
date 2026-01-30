# Database Seeding Guide

## Automatic Seeding on Startup

The application automatically seeds the database on startup with:

1. **Default Roles:**
   - SUPER_ADMIN - Full system access
   - SUB_ADMIN - Limited management access  
   - USER - Basic user access

2. **Default SUPER_ADMIN User:**
   - Email: `admin@osamvista.com`
   - Password: `Admin@123`
   - Username: `admin`
   - Full Name: `System Administrator`

---

## How It Works

When the FastAPI application starts:

1. **Startup Event Triggered:** `@app.on_event("startup")` calls `init_database()`
2. **Roles Check:** Verifies if roles exist, creates them if missing
3. **SUPER_ADMIN Check:** Verifies if admin user exists, creates if missing
4. **Graceful Errors:** If database is not initialized, logs warning but doesn't crash

---

## Implementation

### File Structure

```
app/
├── core/
│   ├── seed.py          # Seeding logic
│   └── config.py        # Configuration
└── main.py              # FastAPI app (calls init_database on startup)
```

### Seed Logic (`app/core/seed.py`)

**Functions:**

1. **`seed_roles(db)`** - Creates default roles
2. **`seed_super_admin(db)`** - Creates SUPER_ADMIN user
3. **`init_database()`** - Main seeding function (called on startup)

### Startup Integration (`main.py`)

```python
@app.on_event("startup")
async def startup_event():
    """Initialize database on app startup"""
    init_database()
```

---

## Usage

### Starting the Application

```bash
python -m uvicorn main:app --reload
```

**Console Output:**

```
============================================================
🗄️  Database Initialization
============================================================

🌱 Seeding roles...
   ✓ Created role: SUPER_ADMIN
   ✓ Created role: SUB_ADMIN
   ✓ Created role: USER

👤 Seeding SUPER_ADMIN user...
   ✓ Created SUPER_ADMIN user: admin@osamvista.com
   ✓ Password: Admin@123

✅ Database seeding complete!
============================================================
```

### First Login as SUPER_ADMIN

```bash
# 1. Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@osamvista.com",
    "password": "Admin@123"
  }'

# Response: OTP sent to email (static: 123456)

# 2. Verify OTP
curl -X POST http://localhost:8000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@osamvista.com",
    "otp": "123456"
  }'

# Response: JWT token for authenticated requests
```

---

## Behavior

### Idempotent Seeding

- **Safe to run multiple times** - Only creates missing data
- **Duplicate Prevention** - Checks if roles/users exist before creating
- **No Overwrites** - Existing data is never modified

### Error Handling

If database is not initialized:
- ✓ Logs warning message
- ✓ Does NOT crash the application
- ✓ Application continues to run
- ✓ Seeding can be retried after database setup

### Development vs Production

**Development:**
- Static OTP: `123456` (hardcoded)
- SUPER_ADMIN password visible in code (for easy testing)
- Graceful error handling for missing database

**Production:**
- Update default admin password immediately after first deployment
- Use Redis/cache for OTP expiration
- Disable static OTP generation
- Use secure secret key in `.env`

---

## Customization

### Change SUPER_ADMIN Credentials

Edit `app/core/seed.py`:

```python
DEFAULT_SUPER_ADMIN = {
    "email": "your-admin@example.com",
    "username": "your-username",
    "password": "your-secure-password",
    "full_name": "Your Name"
}
```

### Add More Default Users

In `app/core/seed.py`, add to `seed_super_admin()`:

```python
# Create regular user
regular_user = User(
    email="user@example.com",
    username="regularuser",
    hashed_password=AuthService.hash_password("UserPassword123"),
    full_name="Regular User",
    is_active=True,
    is_verified=True,
    role_id=user_role.id
)
db.add(regular_user)
```

---

## Manual Seeding (Without Startup)

If you need to seed without starting the server:

```bash
python -c "from app.core.seed import init_database; init_database()"
```

---

## Troubleshooting

### Database Connection Failed

**Error:** "Can't connect to MySQL server"

**Solution:**
1. Ensure MySQL is running
2. Check credentials in `.env`
3. Verify database name exists

### Circular Import Error

**Error:** "cannot import name 'AuthService'"

**Solution:** 
- Seed is imported lazily in `main.py` to avoid circular imports
- Not imported in `app/core/__init__.py`

### SUPER_ADMIN Already Exists

**Message:** "ℹ️ SUPER_ADMIN user already exists"

**Explanation:** Seed ran successfully before, data persisted. This is normal and expected.

---

## Security Checklist

Before production deployment:

- [ ] Change default admin password
- [ ] Use strong `.env` SECRET_KEY
- [ ] Update database credentials
- [ ] Disable debug mode
- [ ] Implement email OTP sending (not static)
- [ ] Set up Redis for OTP expiration
- [ ] Review role permissions
- [ ] Enable HTTPS/TLS
