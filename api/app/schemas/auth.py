# Authentication Pydantic Schemas
"""Request and response schemas for authentication endpoints"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# ==================== REQUEST SCHEMAS ====================

class RegisterRequest(BaseModel):
    """Schema for user registration"""
    email: EmailStr = Field(..., description="User email address")
    username: str = Field(..., min_length=3, max_length=100, description="Unique username")
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")
    full_name: str = Field(..., min_length=2, max_length=255, description="User full name")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "username": "johndoe",
                "password": "SecurePass123!",
                "full_name": "John Doe"
            }
        }


class LoginRequest(BaseModel):
    """Schema for user login"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123!"
            }
        }


class VerifyOTPRequest(BaseModel):
    """Schema for OTP verification"""
    email: EmailStr = Field(..., description="User email address")
    otp: str = Field(..., min_length=6, max_length=6, description="6-digit OTP")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "otp": "123456"
            }
        }


# ==================== RESPONSE SCHEMAS ====================

class UserResponse(BaseModel):
    """User response schema"""
    id: int
    email: str
    username: str
    full_name: str
    is_active: bool
    is_verified: bool
    role: str
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "expires_in": 1800
            }
        }


class LoginResponse(BaseModel):
    """Response for login endpoint (before OTP)"""
    message: str
    email: str
    requires_otp: bool
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "OTP sent to your email",
                "email": "user@example.com",
                "requires_otp": True
            }
        }


class VerifyOTPResponse(BaseModel):
    """Response for OTP verification"""
    message: str
    user: Optional[UserResponse] = None
    token: Optional[TokenResponse] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "OTP verified successfully",
                "user": {
                    "id": 1,
                    "email": "user@example.com",
                    "username": "johndoe",
                    "full_name": "John Doe",
                    "is_active": True,
                    "is_verified": True,
                    "role": "USER"
                },
                "token": {
                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "token_type": "bearer",
                    "expires_in": 1800
                }
            }
        }


class RegisterResponse(BaseModel):
    """Response for registration endpoint"""
    message: str
    user: Optional[UserResponse] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "User registered successfully",
                "user": {
                    "id": 1,
                    "email": "user@example.com",
                    "username": "johndoe",
                    "full_name": "John Doe",
                    "is_active": True,
                    "is_verified": False,
                    "role": "USER"
                }
            }
        }


class ErrorResponse(BaseModel):
    """Error response schema"""
    error: str
    message: str
    status_code: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "InvalidCredentials",
                "message": "Email or password is incorrect",
                "status_code": 401
            }
        }
