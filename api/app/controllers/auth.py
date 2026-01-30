# Authentication Controller
"""
AuthController handles HTTP requests for authentication endpoints.
No business logic here - all logic delegated to AuthService.

Flow:
    1. POST /register → Create user account
    2. POST /login → Send OTP to email
    3. POST /verify-otp → Verify OTP and return JWT token
"""

from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta
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
from app.services.auth import AuthService
from app.core.config import settings

# Create router for auth endpoints
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In-memory storage for OTPs (TODO: Replace with Redis/Database)
# Format: {email: {"otp": "123456", "password_hash": "...", "user_data": {...}}}
otp_store = {}


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "User registered successfully"},
        400: {"model": ErrorResponse, "description": "Invalid input or user already exists"},
        422: {"description": "Validation error"}
    }
)
async def register(request: RegisterRequest) -> RegisterResponse:
    """
    Register a new user account
    
    - **email**: User's email address (must be unique)
    - **username**: Unique username (3-100 characters)
    - **password**: Password (minimum 8 characters)
    - **full_name**: User's full name
    
    Returns user data after successful registration
    """
    try:
        # Validate role (default to USER)
        AuthService.validate_role("USER")
        
        # Hash password
        hashed_password = AuthService.hash_password(request.password)
        
        # TODO: Check if email/username already exists in database
        # TODO: Create user in database with role_id for USER
        # TODO: Return created user
        
        # Mock response (without database)
        user_data = UserResponse(
            id=1,
            email=request.email,
            username=request.username,
            full_name=request.full_name,
            is_active=True,
            is_verified=False,
            role="USER"
        )
        
        return RegisterResponse(
            message="User registered successfully",
            user=user_data
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "OTP sent to email"},
        401: {"model": ErrorResponse, "description": "Invalid credentials"},
        404: {"model": ErrorResponse, "description": "User not found"}
    }
)
async def login(request: LoginRequest) -> LoginResponse:
    """
    Initiate login - send OTP to user's email
    
    - **email**: User's registered email
    - **password**: User's password
    
    Returns message that OTP was sent
    """
    try:
        # TODO: Fetch user from database by email
        # TODO: Verify password against stored hash
        # if not AuthService.verify_password(request.password, stored_hash):
        #     raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Generate OTP (using static OTP for development)
        otp = AuthService.generate_static_otp()
        
        # Store OTP temporarily (TODO: Use Redis with expiration)
        otp_store[request.email] = {
            "otp": otp,
            "password_hash": AuthService.hash_password(request.password)  # Mock
        }
        
        # TODO: Send OTP via email using email service
        print(f"📧 OTP for {request.email}: {otp}")  # Debug only
        
        return LoginResponse(
            message=f"OTP sent to {request.email}",
            email=request.email,
            requires_otp=True
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {str(e)}"
        )


@router.post(
    "/verify-otp",
    response_model=VerifyOTPResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "OTP verified, JWT token returned"},
        400: {"model": ErrorResponse, "description": "Invalid or expired OTP"},
        404: {"model": ErrorResponse, "description": "User or OTP not found"}
    }
)
async def verify_otp(request: VerifyOTPRequest) -> VerifyOTPResponse:
    """
    Verify OTP and return JWT access token
    
    - **email**: User's email
    - **otp**: 6-digit OTP received via email
    
    Returns user data and JWT token on success
    """
    try:
        # Check if OTP exists for email
        if request.email not in otp_store:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No OTP found for this email. Please login first."
            )
        
        # Verify OTP
        stored_otp = otp_store[request.email]["otp"]
        if not AuthService.verify_otp(request.otp, stored_otp):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid OTP. Please try again."
            )
        
        # TODO: Fetch user from database
        # For now, create mock user data
        user_data = UserResponse(
            id=1,
            email=request.email,
            username="johndoe",
            full_name="John Doe",
            is_active=True,
            is_verified=True,
            role="USER"
        )
        
        # Create JWT token
        token_payload = AuthService.create_token_payload(
            user_id=user_data.id,
            email=user_data.email,
            role=user_data.role
        )
        token = AuthService.create_access_token(token_payload)
        
        # Calculate token expiration
        expires_in = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        
        # Clean up OTP from store
        del otp_store[request.email]
        
        return VerifyOTPResponse(
            message="OTP verified successfully. Login successful!",
            user=user_data,
            token=TokenResponse(
                access_token=token,
                token_type="bearer",
                expires_in=expires_in
            )
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OTP verification failed: {str(e)}"
        )


# Health check endpoint for auth service
@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    responses={200: {"description": "Auth service is healthy"}}
)
async def auth_health_check():
    """Check if authentication service is running"""
    return {
        "status": "healthy",
        "service": "Authentication Service",
        "version": "0.1.0"
    }
