# Authentication API Endpoints

## Overview

Authentication flow with OTP verification:
1. **Register** → Create user account
2. **Login** → Send OTP to email
3. **Verify OTP** → Authenticate and receive JWT token

Base URL: `/api/auth`

---

## Endpoints

### 1. Register User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
```

**Field Requirements:**
- `email`: Valid email address (unique)
- `username`: 3-100 characters (unique)
- `password`: Minimum 8 characters
- `full_name`: 2-255 characters

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "is_active": true,
    "is_verified": false,
    "role": "USER"
  }
}
```

**Possible Errors:**
- `400 Bad Request` - Email/username already exists or validation error
- `422 Unprocessable Entity` - Invalid input format

---

### 2. Login & Send OTP
**POST** `/api/auth/login`

Initiate login and send OTP to user's email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "OTP sent to user@example.com",
  "email": "user@example.com",
  "requires_otp": true
}
```

**Possible Errors:**
- `401 Unauthorized` - Invalid credentials
- `404 Not Found` - User not found

---

### 3. Verify OTP & Get Token
**POST** `/api/auth/verify-otp`

Verify OTP and receive JWT access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "message": "OTP verified successfully. Login successful!",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "is_active": true,
    "is_verified": true,
    "role": "USER"
  },
  "token": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 1800
  }
}
```

**Possible Errors:**
- `400 Bad Request` - Invalid or incorrect OTP
- `404 Not Found` - No OTP found for this email

---

## Authentication Flow

### Step 1: Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "SecurePass123!",
    "full_name": "John Doe"
  }'
```

### Step 2: Login (Request OTP)
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Output:**
```
OTP sent to user@example.com
For development: OTP = 123456
```

### Step 3: Verify OTP
```bash
curl -X POST http://localhost:8000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

**Response contains:**
- User profile
- JWT access token (valid for 30 minutes)
- Token type: `bearer`

---

## Using JWT Token

All authenticated endpoints require the `Authorization` header:

```bash
curl -X GET http://localhost:8000/api/protected-endpoint \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## OTP Details

**Current Implementation:**
- Static OTP: `123456` (for development)
- Will be randomized in production
- Expires after 10 minutes (configurable)
- Single use only

**Development Testing:**
- Use static OTP `123456` for all logins
- No email required for OTP delivery

---

## Error Responses

All errors return the following format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid credentials)
- `404` - Not Found (user/OTP not found)
- `422` - Unprocessable Entity (invalid format)
- `500` - Internal Server Error

---

## Security Features

✓ **Password Hashing** - Argon2 with bcrypt fallback  
✓ **JWT Tokens** - HS256 algorithm, 30-minute expiration  
✓ **OTP Verification** - 6-digit verification  
✓ **Role-Based Access** - SUPER_ADMIN, SUB_ADMIN, USER  
✓ **Email Validation** - Valid email format required  
✓ **Password Requirements** - Minimum 8 characters  

---

## Interactive Testing

Visit the Swagger UI:
```
http://localhost:8000/docs
```

Or ReDoc:
```
http://localhost:8000/redoc
```

Both provide interactive API documentation with try-it-out functionality.
