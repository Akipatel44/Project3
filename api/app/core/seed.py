# Database Seeding Logic
"""
Automatic database seeding on application startup.
Creates default roles and SUPER_ADMIN user if they don't exist.
"""

from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models import Role, User, Place, Event, Gallery
from app.models.place import PlaceType
from app.models.event import EventType
from app.models.gallery import GalleryCategory
from app.services.auth import AuthService
from app.core.config import settings
from datetime import datetime, timedelta

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


def seed_places(db: Session) -> None:
    """Seed default places if they don't exist"""
    print("\n🏛️  Seeding places...")
    
    try:
        default_places = [
            {
                "name": "Osam Hill Temple",
                "description": "Ancient temple perched on the hilltop with stunning architectural design.",
                "place_type": PlaceType.TEMPLE,
                "latitude": 21.2000,
                "longitude": 71.5000,
                "address": "Osam Hill, Gujarat",
                "image_url": "/images/osam-hill-temple.jpg"
            },
            {
                "name": "Dwarka Temple Gates",
                "description": "Magnificent temple gates dedicated to Lord Krishna.",
                "place_type": PlaceType.TEMPLE,
                "latitude": 22.2396,
                "longitude": 68.9678,
                "address": "Dwarka, Gujarat",
                "image_url": "/images/dwarka-temple-gates.jpg"
            },
            {
                "name": "Modhera Sun Temple",
                "description": "Historical sun temple with intricate architectural elements.",
                "place_type": PlaceType.TEMPLE,
                "latitude": 23.1816,
                "longitude": 72.5016,
                "address": "Modhera, Gujarat",
                "image_url": "/images/modhera-temple.jpg"
            },
            {
                "name": "Osam Hill Stairs",
                "description": "Historic stone stairs climbing the sacred hill.",
                "place_type": PlaceType.NATURE_SPOT,
                "latitude": 21.2100,
                "longitude": 71.5100,
                "address": "Osam Hill, Gujarat",
                "image_url": "/images/osam-stairs.jpg"
            },
            {
                "name": "Kutch Heritage & Crafts",
                "description": "Modern facility showcasing traditional arts and crafts.",
                "place_type": PlaceType.MYTHOLOGY_SPOT,
                "latitude": 23.8103,
                "longitude": 69.5644,
                "address": "Kutch, Gujarat",
                "image_url": "/images/kutch-kraft.jpg"
            },
            {
                "name": "Somnath Temple",
                "description": "Ancient temple perfect for spiritual practices and pilgrimage.",
                "place_type": PlaceType.TEMPLE,
                "latitude": 20.8832,
                "longitude": 70.4029,
                "address": "Somnath, Gujarat",
                "image_url": "/images/somnath-temple.png"
            },
        ]
        
        for place_data in default_places:
            existing = db.query(Place).filter(Place.name == place_data["name"]).first()
            if not existing:
                place = Place(**place_data)
                db.add(place)
                print(f"   ✓ Created place: {place_data['name']}")
            else:
                print(f"   ℹ️  {place_data['name']} already exists")
        
        db.commit()
    except Exception as e:
        db.rollback()
        if "image_url" in str(e):
            print(f"   ⚠️  image_url column not yet in database. Will retry after migration.")
        else:
            raise


def seed_events(db: Session) -> None:
    """Seed default events if they don't exist"""
    print("\n🎉 Seeding events...")
    
    try:
        now = datetime.utcnow()
        
        default_events = [
            {
                "name": "Maha Shivaratri Festival",
                "description": "Grand celebration of Lord Shiva with rituals, music, and traditional performances.",
                "event_type": EventType.ASHADHI_BEEJ_MELA,
                "start_date": now + timedelta(days=30),
                "end_date": now + timedelta(days=31),
                "location": "Osam Hill Temple Complex",
                "image_url": "/images/osam-hill-temple.jpg",
                "is_active": True
            },
            {
                "name": "Somnath Marathon",
                "description": "Marathon event along the coastal pilgrimage route.",
                "event_type": EventType.MARATHON,
                "start_date": now + timedelta(days=45),
                "end_date": now + timedelta(days=45),
                "location": "Somnath, Gujarat",
                "image_url": "/images/somnath-marathon.jpg",
                "is_active": True
            },
            {
                "name": "Dwarka Temple Festival",
                "description": "Colorful celebration with music, food, and community gathering.",
                "event_type": EventType.ASHADHI_BEEJ_MELA,
                "start_date": now + timedelta(days=60),
                "end_date": now + timedelta(days=62),
                "location": "Dwarka, Gujarat",
                "image_url": "/images/dwarka.jpg",
                "is_active": True
            },
        ]
        
        for event_data in default_events:
            existing = db.query(Event).filter(Event.name == event_data["name"]).first()
            if not existing:
                event = Event(**event_data)
                db.add(event)
                print(f"   ✓ Created event: {event_data['name']}")
            else:
                print(f"   ℹ️  {event_data['name']} already exists")
        
        db.commit()
    except Exception as e:
        db.rollback()
        if "image_url" in str(e):
            print(f"   ⚠️  image_url column not yet in database. Will retry after migration.")
        else:
            raise


def seed_gallery(db: Session) -> None:
    """Seed default gallery items if they don't exist"""
    print("\n🖼️  Seeding gallery...")
    
    try:
        default_gallery = [
            {
                "title": "Osam Hill Temple",
                "description": "Ancient temple architecture with spiritual significance.",
                "category": GalleryCategory.TEMPLE,
                "image_url": "/images/osam-hill-temple.jpg",
                "alt_text": "Osam Hill Temple",
                "is_active": True
            },
            {
                "title": "Hill Flowers in Bloom",
                "description": "Vibrant flora blooming across the hill grounds.",
                "category": GalleryCategory.NATURE,
                "image_url": "/images/osam-hill-flowers.jpg",
                "alt_text": "Flowers on Osam Hill",
                "is_active": True
            },
            {
                "title": "Ancient Temple Stairs",
                "description": "Historic stone stairs climbing the sacred hill.",
                "category": GalleryCategory.TEMPLE,
                "image_url": "/images/osam-stairs.jpg",
                "alt_text": "Temple stairs",
                "is_active": True
            },
            {
                "title": "Dwarka Temple Gates",
                "description": "Intricate details of temple architectural elements.",
                "category": GalleryCategory.TEMPLE,
                "image_url": "/images/dwarka-temple-gates.jpg",
                "alt_text": "Dwarka temple gates",
                "is_active": True
            },
            {
                "title": "Modhera Sun Temple",
                "description": "Grand sun temple with intricate carvings.",
                "category": GalleryCategory.TEMPLE,
                "image_url": "/images/modhera-temple.jpg",
                "alt_text": "Modhera Sun Temple",
                "is_active": True
            },
            {
                "title": "Somnath Temple",
                "description": "Panoramic view of the coastal temple complex.",
                "category": GalleryCategory.TEMPLE,
                "image_url": "/images/somnath-temple.png",
                "alt_text": "Somnath Temple",
                "is_active": True
            },
            {
                "title": "Somnath Marathon Event",
                "description": "Community gathering and sporting event.",
                "category": GalleryCategory.CULTURAL,
                "image_url": "/images/somnath-marathon.jpg",
                "alt_text": "Marathon event",
                "is_active": True
            },
            {
                "title": "Palitana Temples",
                "description": "Ancient temple complex on sacred hilltop.",
                "category": GalleryCategory.TEMPLE,
                "image_url": "/images/palitana-temples.jpg",
                "alt_text": "Palitana temples",
                "is_active": True
            },
            {
                "title": "Dwarka Heritage",
                "description": "Historic pilgrimage destination with cultural significance.",
                "category": GalleryCategory.CULTURAL,
                "image_url": "/images/dwarka.jpg",
                "alt_text": "Dwarka heritage site",
                "is_active": True
            },
            {
                "title": "Kutch Crafts",
                "description": "Traditional craftsmanship and cultural heritage.",
                "category": GalleryCategory.CULTURAL,
                "image_url": "/images/kutch-kraft.jpg",
                "alt_text": "Kutch crafts",
                "is_active": True
            },
            {
                "title": "Gir Forest Wildlife",
                "description": "Exotic wildlife in natural habitat.",
                "category": GalleryCategory.NATURE,
                "image_url": "/images/gir-forest-wildlife.jpg",
                "alt_text": "Gir forest wildlife",
                "is_active": True
            },
        ]
        
        for item_data in default_gallery:
            existing = db.query(Gallery).filter(Gallery.image_url == item_data["image_url"]).first()
            if not existing:
                gallery = Gallery(**item_data)
                db.add(gallery)
                print(f"   ✓ Created gallery item: {item_data['title']}")
            else:
                print(f"   ℹ️  {item_data['title']} already exists")
        
        db.commit()
    except Exception as e:
        db.rollback()
        if "image_url" in str(e):
            print(f"   ⚠️  image_url column not yet in database. Will retry after migration.")
        else:
            raise


def init_database() -> None:
    """
    Initialize database with default roles and SUPER_ADMIN user.
    Called on application startup.
    
    This function:
    1. Creates all tables from models
    2. Creates roles if they don't exist
    3. Creates SUPER_ADMIN user if it doesn't exist
    4. Handles connection errors gracefully
    """
    from app.database.session import init_tables
    
    db = SessionLocal()
    try:
        print("=" * 60)
        print("🗄️  Database Initialization")
        print("=" * 60)
        
        # Create all tables first
        print("\n📊 Creating/updating database schema...")
        init_tables()
        print("   ✓ Database schema ready")
        
        # Seed roles
        seed_roles(db)
        
        # Seed SUPER_ADMIN user
        seed_super_admin(db)
        
        # Seed places
        seed_places(db)
        
        # Seed events
        seed_events(db)
        
        # Seed gallery
        seed_gallery(db)
        
        print("\n✅ Database seeding complete!")
        print("=" * 60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Seeding error: {str(e)}")
        print("\nNote: This is not critical during development.")
        print("The database may not be initialized yet.")
        print("=" * 60 + "\n")
    finally:
        db.close()
