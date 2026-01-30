# Database seeder for initial roles
"""
Usage:
    python seed_db.py
    
This script seeds the database with default roles:
- SUPER_ADMIN
- SUB_ADMIN
- USER
"""

from app.database.session import SessionLocal
from app.models import Role

# Default roles to seed
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

def seed_roles():
    """Seed database with default roles"""
    print("🌱 Seeding default roles...")
    
    db = SessionLocal()
    try:
        for role_data in DEFAULT_ROLES:
            # Check if role already exists
            existing_role = db.query(Role).filter(
                Role.name == role_data["name"]
            ).first()
            
            if existing_role:
                print(f"  ℹ️  {role_data['name']} already exists, skipping...")
            else:
                role = Role(
                    name=role_data["name"],
                    description=role_data["description"]
                )
                db.add(role)
                print(f"  ✓ Created role: {role_data['name']}")
        
        db.commit()
        print("\n✅ Role seeding complete!")
        
        # Display all roles
        all_roles = db.query(Role).all()
        print(f"\n📋 Available roles ({len(all_roles)}):")
        for role in all_roles:
            print(f"   - {role.name}: {role.description}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_roles()
