# Database Seeding Logic
"""
Automatic database seeding on application startup.
Creates default roles and SUPER_ADMIN user if they don't exist.
"""

from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models import Role, User
from app.services.auth import AuthService
from app.core.config import settings

# Default roles configuration
DEFAULT_ROLES = [
    {
        "name": "SUPER_ADMIN",
        "description": "Super administrator with full system access"
    },
    {
        "name": "SUB_ADMIN",
        "description": "Sub-administrator with limited management access"
    },
    {
        "name": "USER",
        "description": "Regular user with basic access"
    }
]

# Default SUPER_ADMIN user
DEFAULT_SUPER_ADMIN = {
    "email": "admin@osamvista.com",
    "username": "admin",
    "password": "Admin@123",
    "full_name": "System Administrator"
}


def seed_roles(db: Session) -> None:
    """Seed default roles if they don't exist"""
    print("\n🌱 Seeding roles...")
    
    for role_data in DEFAULT_ROLES:
        existing_role = db.query(Role).filter(
            Role.name == role_data["name"]
        ).first()
        
        if not existing_role:
            role = Role(
                name=role_data["name"],
                description=role_data["description"]
            )
            db.add(role)
            print(f"   ✓ Created role: {role_data['name']}")
        else:
            print(f"   ℹ️  {role_data['name']} already exists")
    
    db.commit()


def seed_super_admin(db: Session) -> None:
    """Seed default SUPER_ADMIN user if it doesn't exist"""
    print("\n👤 Seeding SUPER_ADMIN user...")
    
    # Check if admin already exists
    existing_admin = db.query(User).filter(
        User.email == DEFAULT_SUPER_ADMIN["email"]
    ).first()
    
    if existing_admin:
        print(f"   ℹ️  SUPER_ADMIN user already exists")
        return
    
    # Get SUPER_ADMIN role
    super_admin_role = db.query(Role).filter(
        Role.name == "SUPER_ADMIN"
    ).first()
    
    if not super_admin_role:
        print("   ❌ SUPER_ADMIN role not found. Run seed_roles first.")
        return
    
    # Hash password
    hashed_password = AuthService.hash_password(DEFAULT_SUPER_ADMIN["password"])
    
    # Create SUPER_ADMIN user
    admin_user = User(
        email=DEFAULT_SUPER_ADMIN["email"],
        username=DEFAULT_SUPER_ADMIN["username"],
        hashed_password=hashed_password,
        full_name=DEFAULT_SUPER_ADMIN["full_name"],
        is_active=True,
        is_verified=True,
        role_id=super_admin_role.id
    )
    
    db.add(admin_user)
    db.commit()
    
    print(f"   ✓ Created SUPER_ADMIN user: {DEFAULT_SUPER_ADMIN['email']}")
    print(f"   ✓ Password: {DEFAULT_SUPER_ADMIN['password']}")


def init_database() -> None:
    """
    Initialize database with default roles and SUPER_ADMIN user.
    Called on application startup.
    
    This function:
    1. Creates roles if they don't exist
    2. Creates SUPER_ADMIN user if it doesn't exist
    3. Handles connection errors gracefully
    """
    db = SessionLocal()
    try:
        print("=" * 60)
        print("🗄️  Database Initialization")
        print("=" * 60)
        
        # Seed roles
        seed_roles(db)
        
        # Seed SUPER_ADMIN user
        seed_super_admin(db)
        
        print("\n✅ Database seeding complete!")
        print("=" * 60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Seeding error: {str(e)}")
        print("\nNote: This is not critical during development.")
        print("The database may not be initialized yet.")
        print("=" * 60 + "\n")
    finally:
        db.close()
