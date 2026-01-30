# Pydantic schemas for request/response validation
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    VerifyOTPRequest,
    RegisterResponse,
    LoginResponse,
    VerifyOTPResponse,
    UserResponse,
    TokenResponse,
    ErrorResponse
)

__all__ = [
    "RegisterRequest",
    "LoginRequest",
    "VerifyOTPRequest",
    "RegisterResponse",
    "LoginResponse",
    "VerifyOTPResponse",
    "UserResponse",
    "TokenResponse",
    "ErrorResponse"
]
