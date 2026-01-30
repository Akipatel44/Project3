# Authentication Service
"""
AuthService handles all authentication-related business logic:
- Password hashing and verification
- JWT token creation and validation
- OTP generation and validation
- Role-based access control
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import secrets
from passlib.context import CryptContext
from jose import JWTError, jwt
from app.core.config import settings

# Password hashing context
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)


class AuthService:
    """Service for authentication operations"""
    
    # ==================== PASSWORD MANAGEMENT ====================
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a plain text password using bcrypt
        
        Args:
            password: Plain text password
            
        Returns:
            Hashed password
        """
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify plain text password against hashed password
        
        Args:
            plain_password: Plain text password to verify
            hashed_password: Hashed password from database
            
        Returns:
            True if passwords match, False otherwise
        """
        return pwd_context.verify(plain_password, hashed_password)
    
    # ==================== JWT TOKEN MANAGEMENT ====================
    
    @staticmethod
    def create_access_token(
        data: Dict[str, Any],
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create a JWT access token
        
        Args:
            data: Payload data to encode in token
            expires_delta: Custom expiration time (defaults to 30 minutes)
            
        Returns:
            Encoded JWT token
            
        Example:
            token = AuthService.create_access_token({
                "sub": user_id,
                "email": "user@example.com",
                "role": "USER"
            })
        """
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(
            to_encode,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )
        
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Verify and decode a JWT token
        
        Args:
            token: JWT token to verify
            
        Returns:
            Decoded payload if valid, None if invalid
            
        Raises:
            JWTError: If token is invalid or expired
        """
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            return payload
        except JWTError:
            return None
    
    @staticmethod
    def extract_token_data(token: str) -> Optional[Dict[str, Any]]:
        """
        Extract data from a JWT token without raising exceptions
        
        Args:
            token: JWT token
            
        Returns:
            Token payload or None if invalid
        """
        return AuthService.verify_token(token)
    
    # ==================== OTP MANAGEMENT ====================
    
    @staticmethod
    def generate_otp(length: int = 6) -> str:
        """
        Generate a random OTP (One-Time Password)
        
        Args:
            length: Length of OTP (default: 6 digits)
            
        Returns:
            Random numeric OTP as string
            
        Example:
            otp = AuthService.generate_otp()  # Returns e.g., "123456"
        """
        return ''.join(secrets.choice('0123456789') for _ in range(length))
    
    @staticmethod
    def generate_static_otp() -> str:
        """
        Generate a static OTP for testing/development
        
        Returns:
            Static 6-digit OTP: "123456"
        """
        return "123456"
    
    @staticmethod
    def verify_otp(provided_otp: str, stored_otp: str) -> bool:
        """
        Verify provided OTP against stored OTP
        
        Args:
            provided_otp: OTP provided by user
            stored_otp: OTP stored in database/cache
            
        Returns:
            True if OTPs match, False otherwise
        """
        return provided_otp == stored_otp
    
    # ==================== ROLE VALIDATION ====================
    
    VALID_ROLES = ["SUPER_ADMIN", "SUB_ADMIN", "USER"]
    
    @staticmethod
    def is_valid_role(role_name: str) -> bool:
        """
        Check if role name is valid
        
        Args:
            role_name: Role name to validate
            
        Returns:
            True if role is valid, False otherwise
        """
        return role_name in AuthService.VALID_ROLES
    
    @staticmethod
    def validate_role(role_name: str) -> None:
        """
        Validate role name, raise exception if invalid
        
        Args:
            role_name: Role name to validate
            
        Raises:
            ValueError: If role is not valid
        """
        if not AuthService.is_valid_role(role_name):
            raise ValueError(
                f"Invalid role '{role_name}'. "
                f"Must be one of: {', '.join(AuthService.VALID_ROLES)}"
            )
    
    @staticmethod
    def has_role_permission(user_role: str, required_role: str) -> bool:
        """
        Check if user role has permission for required role
        
        Role hierarchy:
            SUPER_ADMIN > SUB_ADMIN > USER
        
        Args:
            user_role: User's current role
            required_role: Required role to access resource
            
        Returns:
            True if user has required role or higher
            
        Example:
            # SUPER_ADMIN can access SUB_ADMIN resources
            has_access = AuthService.has_role_permission("SUPER_ADMIN", "SUB_ADMIN")
        """
        role_hierarchy = {
            "SUPER_ADMIN": 3,
            "SUB_ADMIN": 2,
            "USER": 1
        }
        
        user_level = role_hierarchy.get(user_role, 0)
        required_level = role_hierarchy.get(required_role, 0)
        
        return user_level >= required_level
    
    # ==================== UTILITY METHODS ====================
    
    @staticmethod
    def get_valid_roles() -> list:
        """
        Get list of all valid roles
        
        Returns:
            List of valid role names
        """
        return AuthService.VALID_ROLES.copy()
    
    @staticmethod
    def create_token_payload(
        user_id: int,
        email: str,
        role: str,
        additional_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Create a standard JWT token payload
        
        Args:
            user_id: User ID
            email: User email
            role: User role
            additional_data: Additional data to include in payload
            
        Returns:
            Token payload dictionary
        """
        payload = {
            "sub": str(user_id),
            "email": email,
            "role": role,
            "iat": datetime.utcnow()
        }
        
        if additional_data:
            payload.update(additional_data)
        
        return payload
