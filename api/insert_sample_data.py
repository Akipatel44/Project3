#!/usr/bin/env python
"""Properly seed database with sample Places, Events, and Gallery data"""

from app.database.session import SessionLocal
from app.models import Place, Event, Gallery
from datetime import datetime, timedelta

def seed_sample_data():
    """Insert sample data into database"""
    db = SessionLocal()
    
    print("\n" + "="*80)
    print("SEEDING SAMPLE DATA INTO DATABASE")
    print("="*80)
    
    try:
        # Check if data already exists
        existing_places = db.query(Place).count()
        if existing_places > 0:
            print("\n⚠️  Places already exist. Skipping seed.")
            return
        
        # 1. INSERT PLACES
        print("\n1️⃣ Inserting PLACES...")
        places_data = [
            Place(
                name="Somnath Temple",
                description="One of the 12 Jyotirlingas, located in Gujarat. Known for its magnificent architecture and spiritual significance.",
                address="Veraval, Gujarat",
                latitude=20.8836,
                longitude=70.4088,
                place_type="temple",
            ),
            Place(
                name="Dwarka",
                description="Ancient city mentioned in Hindu mythology as the capital of Lord Krishna's kingdom. Home to Dwarkadheesh Temple.",
                address="Dwarka, Gujarat",
                latitude=22.2391,
                longitude=68.9681,
                place_type="mythology_spot",
            ),
            Place(
                name="Rann of Kutch",
                description="The world's largest salt marsh, spanning 30,000 sq km. Famous for its white landscape and cultural diversity.",
                address="Kutch, Gujarat",
                latitude=23.5240,
                longitude=69.9519,
                place_type="nature_spot",
            ),
            Place(
                name="Gir Forest",
                description="Only habitat of the Asiatic lion in the world. A biodiversity hotspot with rich flora and fauna.",
                address="Junagadh, Gujarat",
                latitude=21.1458,
                longitude=70.6411,
                place_type="nature_spot",
            ),
            Place(
                name="Modhera Sun Temple",
                description="Ancient Hindu temple dedicated to Surya (Sun God), known for its intricate stone carvings and architectural brilliance.",
                address="Modhera, Gujarat",
                latitude=23.5897,
                longitude=71.6603,
                place_type="temple",
            ),
            Place(
                name="Sattrunjaya Mountain",
                description="Sacred pilgrimage site with 891 Jain temples. Hosts the annual Pal Takht fair with thousands of devotees.",
                address="Palitana, Gujarat",
                latitude=22.4306,
                longitude=71.7945,
                place_type="temple",
            ),
        ]
        
        for place in places_data:
            db.add(place)
        
        db.commit()
        print(f"   ✓ Created {len(places_data)} places")
        
        # 2. INSERT EVENTS
        print("\n2️⃣ Inserting EVENTS...")
        now = datetime.now()
        events_data = [
            Event(
                name="Somnath Marathon 2026",
                description="Annual marathon event celebrating the spiritual and athletic endurance. A 42km run along the coastal route of Somnath.",
                start_date=now + timedelta(days=30),
                end_date=now + timedelta(days=30, hours=6),
                location="Somnath Temple, Veraval",
                event_type="marathon",
                is_active=True,
            ),
            Event(
                name="Ashadhi Beej Mela 2026",
                description="Annual agricultural fair celebrating the monsoon season. Features traditional crafts, agricultural products, and cultural performances.",
                start_date=now + timedelta(days=60),
                end_date=now + timedelta(days=62),
                location="Modhera, Gujarat",
                event_type="ashadhi_beej_mela",
                is_active=True,
            ),
            Event(
                name="Kutch Marathon 2026",
                description="Desert marathon in the unique landscape of Rann of Kutch. A challenging run with views of the white salt marsh.",
                start_date=now + timedelta(days=90),
                end_date=now + timedelta(days=90, hours=8),
                location="Rann of Kutch",
                event_type="marathon",
                is_active=True,
            ),
            Event(
                name="Dwarka Cultural Festival",
                description="Celebration of Krishna's legacy with traditional music, dance, and spiritual discourses.",
                start_date=now + timedelta(days=45),
                end_date=now + timedelta(days=47),
                location="Dwarka, Gujarat",
                event_type="ashadhi_beej_mela",
                is_active=True,
            ),
        ]
        
        for event in events_data:
            db.add(event)
        
        db.commit()
        print(f"   ✓ Created {len(events_data)} events")
        
        # 3. INSERT GALLERY
        print("\n3️⃣ Inserting GALLERY ENTRIES...")
        gallery_data = [
            Gallery(
                title="Somnath Temple Main Entrance",
                description="Grand entrance gate of Somnath Temple with architectural details",
                category="temple",
                image_url="https://via.placeholder.com/400?text=Somnath+Entrance",
                is_active=True,
            ),
            Gallery(
                title="Somnath Temple at Sunset",
                description="Beautiful sunset view of the ancient Somnath Temple",
                category="temple",
                image_url="https://via.placeholder.com/400?text=Somnath+Sunset",
                is_active=True,
            ),
            Gallery(
                title="Dwarka Krishna Idol",
                description="Sacred Krishna idol in Dwarka temple",
                category="mythology",
                image_url="https://via.placeholder.com/400?text=Dwarka+Krishna",
                is_active=True,
            ),
            Gallery(
                title="Rann of Kutch - White Salt Landscape",
                description="Stunning white salt marsh landscape of Rann of Kutch",
                category="nature",
                image_url="https://via.placeholder.com/400?text=Rann+White+Landscape",
                is_active=True,
            ),
            Gallery(
                title="Asiatic Lion in Gir Forest",
                description="Rare Asiatic lion in its natural habitat at Gir Forest",
                category="nature",
                image_url="https://via.placeholder.com/400?text=Gir+Lion",
                is_active=True,
            ),
            Gallery(
                title="Gir Forest Wildlife",
                description="Diverse wildlife of Gir Forest sanctuary",
                category="nature",
                image_url="https://via.placeholder.com/400?text=Gir+Wildlife",
                is_active=True,
            ),
            Gallery(
                title="Modhera Temple Architecture",
                description="Intricate stone carvings and architecture of Modhera Sun Temple",
                category="temple",
                image_url="https://via.placeholder.com/400?text=Modhera+Architecture",
                is_active=True,
            ),
            Gallery(
                title="Palitana Temple Fair",
                description="Annual Pal Takht fair at Sattrunjaya mountain with thousands of pilgrims",
                category="festival",
                image_url="https://via.placeholder.com/400?text=Palitana+Fair",
                is_active=True,
            ),
            Gallery(
                title="Marathon Runner at Somnath",
                description="Participants running in Somnath Marathon event",
                category="cultural",
                image_url="https://via.placeholder.com/400?text=Marathon+Runners",
                is_active=True,
            ),
            Gallery(
                title="Kutch Traditional Crafts",
                description="Traditional handicrafts displayed at Kutch fair",
                category="cultural",
                image_url="https://via.placeholder.com/400?text=Kutch+Crafts",
                is_active=True,
            ),
            Gallery(
                title="Historic Dwarka Gates",
                description="Ancient gates of Dwarka city with historical significance",
                category="monument",
                image_url="https://via.placeholder.com/400?text=Dwarka+Gates",
                is_active=True,
            ),
            Gallery(
                title="Modhera Temple Courtyard",
                description="Beautiful courtyard of Modhera Sun Temple",
                category="monument",
                image_url="https://via.placeholder.com/400?text=Modhera+Courtyard",
                is_active=True,
            ),
        ]
        
        for gallery in gallery_data:
            db.add(gallery)
        
        db.commit()
        print(f"   ✓ Created {len(gallery_data)} gallery entries")
        
        # Print summary
        print("\n" + "="*80)
        print("✅ SEED DATA INSERTION COMPLETE!")
        print("="*80)
        print(f"Places:  {len(places_data)}")
        print(f"Events:  {len(events_data)}")
        print(f"Gallery: {len(gallery_data)}")
        print("="*80 + "\n")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_sample_data()
