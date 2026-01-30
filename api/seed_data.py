#!/usr/bin/env python3
"""
Seed database with sample data for development and testing
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models import User, Place, Event, Gallery, Role
from app.services.auth import AuthService

def seed_database():
    """Insert sample data into database"""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).first() is not None:
            print("⚠️  Database already has data. Skipping seed...")
            return
        
        print("🌱 Seeding database with sample data...\n")
        
        # 0. Create Roles first (required for foreign key)
        print("🔐 Creating roles...")
        roles_data = [
            {"name": "user", "description": "Regular user"},
            {"name": "admin", "description": "Administrator"},
            {"name": "moderator", "description": "Content moderator"},
        ]
        
        roles = []
        for role_data in roles_data:
            role = Role(**role_data)
            db.add(role)
            roles.append(role)
        
        db.commit()  # Must commit to persist role IDs
        print(f"✓ Created {len(roles)} roles")
        
        # 1. Create Users (AUTH)
        print("👤 Creating sample users...")
        users_data = [
            {"email": "admin@osamvista.com", "password": "Admin@123", "full_name": "Admin User", "username": "admin"},
            {"email": "user1@osamvista.com", "password": "User@123", "full_name": "Ramesh Patel", "username": "ramesh"},
            {"email": "user2@osamvista.com", "password": "User@123", "full_name": "Priya Singh", "username": "priya"},
            {"email": "user3@osamvista.com", "password": "User@123", "full_name": "Vikram Kumar", "username": "vikram"},
        ]
        
        users = []
        for user_data in users_data:
            user = User(
                email=user_data["email"],
                username=user_data["username"],
                full_name=user_data["full_name"],
                hashed_password=AuthService.hash_password(user_data["password"]),
                is_active=True,
                role_id=1  # Default role (now exists)
            )
            db.add(user)
            users.append(user)
        
        db.commit()  # Commit users too
        print(f"✓ Created {len(users)} users")
        
        # 2. Create Places
        print("\n📍 Creating sample places...")
        places_data = [
            {
                "name": "Somnath Temple",
                "description": "One of the 12 Jyotirlingas, located in Gujarat. Known for its magnificent architecture and spiritual significance.",
                "address": "Veraval, Gujarat",
                "latitude": 20.8836,
                "longitude": 70.4088,
                "place_type": "temple",
            },
            {
                "name": "Dwarka",
                "description": "Ancient city mentioned in Hindu mythology as the capital of Lord Krishna's kingdom. Home to Dwarkadheesh Temple.",
                "address": "Dwarka, Gujarat",
                "latitude": 22.2391,
                "longitude": 68.9681,
                "place_type": "mythology_spot",
            },
            {
                "name": "Rann of Kutch",
                "description": "The world's largest salt marsh, spanning 30,000 sq km. Famous for its white landscape and cultural diversity.",
                "address": "Kutch, Gujarat",
                "latitude": 23.5240,
                "longitude": 69.9519,
                "place_type": "nature_spot",
            },
            {
                "name": "Gir Forest",
                "description": "Only habitat of the Asiatic lion in the world. A biodiversity hotspot with rich flora and fauna.",
                "address": "Junagadh, Gujarat",
                "latitude": 21.1458,
                "longitude": 70.6411,
                "place_type": "nature_spot",
            },
            {
                "name": "Modhera Sun Temple",
                "description": "Ancient Hindu temple dedicated to Surya (Sun God), known for its intricate stone carvings and architectural brilliance.",
                "address": "Modhera, Gujarat",
                "latitude": 23.5897,
                "longitude": 71.6603,
                "place_type": "temple",
            },
            {
                "name": "Sattrunjaya Mountain",
                "description": "Sacred pilgrimage site with 891 Jain temples. Hosts the annual Pal Takht fair with thousands of devotees.",
                "address": "Palitana, Gujarat",
                "latitude": 22.4306,
                "longitude": 71.7945,
                "place_type": "temple",
            },
        ]
        
        places = []
        for place_data in places_data:
            place = Place(**place_data)
            db.add(place)
            places.append(place)
        
        db.flush()  # Flush but don't commit yet
        print(f"✓ Created {len(places)} places")
        
        # 3. Create Events
        print("\n🎪 Creating sample events...")
        now = datetime.now()
        events_data = [
            {
                "title": "Somnath Marathon 2026",
                "description": "Annual marathon event celebrating the spiritual and athletic endurance. A 42km run along the coastal route of Somnath.",
                "start_date": now + timedelta(days=30),
                "end_date": now + timedelta(days=30, hours=6),
                "address": "Somnath Temple, Veraval",
                "event_type": "marathon",
                "created_by": 1
            },
            {
                "title": "Ashadhi Beej Mela 2026",
                "description": "Annual agricultural fair celebrating the monsoon season. Features traditional crafts, agricultural products, and cultural performances.",
                "start_date": now + timedelta(days=60),
                "end_date": now + timedelta(days=62),
                "address": "Modhera, Gujarat",
                "event_type": "ashadhi_beej_mela",
                "created_by": 2
            },
            {
                "title": "Kutch Marathon 2026",
                "description": "Desert marathon in the unique landscape of Rann of Kutch. A challenging run with views of the white salt marsh.",
                "start_date": now + timedelta(days=90),
                "end_date": now + timedelta(days=90, hours=8),
                "address": "Rann of Kutch",
                "event_type": "marathon",
                "created_by": 3
            },
            {
                "title": "Dwarka Cultural Festival",
                "description": "Celebration of Krishna's legacy with traditional music, dance, and spiritual discourses.",
                "start_date": now + timedelta(days=45),
                "end_date": now + timedelta(days=47),
                "address": "Dwarka, Gujarat",
                "event_type": "ashadhi_beej_mela",
                "created_by": 4
            },
        ]
        
        events = []
        for event_data in events_data:
            event = Event(**event_data)
            db.add(event)
            events.append(event)
        
        db.flush()  # Flush but don't commit yet
        print(f"✓ Created {len(events)} events")
        
        # 4. Create Gallery Images
        print("\n🖼️  Creating sample gallery images...")
        gallery_data = [
            {
                "title": "Somnath Temple Main Entrance",
                "description": "Grand entrance gate of Somnath Temple with architectural details",
                "category": "temple",
                "image_url": "https://via.placeholder.com/400?text=Somnath+Entrance",
            },
            {
                "title": "Somnath Temple at Sunset",
                "description": "Beautiful sunset view of the ancient Somnath Temple",
                "category": "temple",
                "image_url": "https://via.placeholder.com/400?text=Somnath+Sunset",
            },
            {
                "title": "Dwarka Krishna Idol",
                "description": "Sacred Krishna idol in Dwarka temple",
                "category": "mythology",
                "image_url": "https://via.placeholder.com/400?text=Dwarka+Krishna",
            },
            {
                "title": "Rann of Kutch - White Salt Landscape",
                "description": "Stunning white salt marsh landscape of Rann of Kutch",
                "category": "nature",
                "image_url": "https://via.placeholder.com/400?text=Rann+White+Landscape",
            },
            {
                "title": "Asiatic Lion in Gir Forest",
                "description": "Rare Asiatic lion in its natural habitat at Gir Forest",
                "category": "nature",
                "image_url": "https://via.placeholder.com/400?text=Gir+Lion",
            },
            {
                "title": "Gir Forest Wildlife",
                "description": "Diverse wildlife of Gir Forest sanctuary",
                "category": "nature",
                "image_url": "https://via.placeholder.com/400?text=Gir+Wildlife",
            },
            {
                "title": "Modhera Temple Architecture",
                "description": "Intricate stone carvings and architecture of Modhera Sun Temple",
                "category": "temple",
                "image_url": "https://via.placeholder.com/400?text=Modhera+Architecture",
            },
            {
                "title": "Palitana Temple Fair",
                "description": "Annual Pal Takht fair at Sattrunjaya mountain with thousands of pilgrims",
                "category": "festival",
                "image_url": "https://via.placeholder.com/400?text=Palitana+Fair",
            },
            {
                "title": "Marathon Runner at Somnath",
                "description": "Participants running in Somnath Marathon event",
                "category": "cultural",
                "image_url": "https://via.placeholder.com/400?text=Marathon+Runners",
            },
            {
                "title": "Kutch Traditional Crafts",
                "description": "Traditional handicrafts displayed at Kutch fair",
                "category": "cultural",
                "image_url": "https://via.placeholder.com/400?text=Kutch+Crafts",
            },
            {
                "title": "Historic Dwarka Gates",
                "description": "Ancient gates of Dwarka city with historical significance",
                "category": "monument",
                "image_url": "https://via.placeholder.com/400?text=Dwarka+Gates",
            },
            {
                "title": "Modhera Temple Courtyard",
                "description": "Beautiful courtyard of Modhera Sun Temple",
                "category": "monument",
                "image_url": "https://via.placeholder.com/400?text=Modhera+Courtyard",
            },
        ]
        
        galleries = []
        for g_data in gallery_data:
            gallery = Gallery(**g_data)
            db.add(gallery)
            galleries.append(gallery)
        
        # Now commit all changes
        db.commit()
        print(f"✓ Created {len(galleries)} gallery images")
        
        print("\n" + "="*60)
        print("✅ Database seeding complete!")
        print("="*60)
        print(f"📊 Summary:")
        print(f"   • Users: {len(users)}")
        print(f"   • Places: {len(places)}")
        print(f"   • Events: {len(events)}")
        print(f"   • Gallery Images: {len(galleries)}")
        print("="*60)
        print("\n🔐 Test Users (for authentication):")
        for i, user_data in enumerate(users_data, 1):
            print(f"   {i}. Email: {user_data['email']}")
            print(f"      Password: {user_data['password']}")
        
    except Exception as e:
        print(f"❌ Error seeding database: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
