#!/usr/bin/env python3
"""
Insert remaining sample data (Events and Gallery) into the database.
This script skips Places since they are already inserted.
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import sessionmaker
from app.database.session import engine, Base
from app.models.event import Event, EventType
from app.models.gallery import Gallery, GalleryCategory

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def insert_remaining_data():
    """Insert events and gallery data to database"""
    db = SessionLocal()
    
    try:
        print("\n" + "="*80)
        print("INSERTING REMAINING SAMPLE DATA")
        print("="*80 + "\n")
        
        # 1. INSERT EVENTS
        print("1️⃣ Inserting EVENTS...")
        
        # Check if events already exist
        existing_events = db.query(Event).count()
        if existing_events > 0:
            print(f"   ⚠️  Events already exist ({existing_events} found). Skipping.")
        else:
            now = datetime.now()
            events_data = [
                Event(
                    name="Somnath Marathon 2026",
                    description="Annual marathon event celebrating the spiritual and athletic endurance. A 42km run along the coastal route of Somnath.",
                    start_date=now + timedelta(days=30),
                    end_date=now + timedelta(days=30, hours=6),
                    location="Somnath Temple, Veraval",
                    event_type=EventType.MARATHON,
                    is_active=True,
                ),
                Event(
                    name="Ashadhi Beej Mela 2026",
                    description="Annual agricultural fair celebrating the monsoon season. Features traditional crafts, agricultural products, and cultural performances.",
                    start_date=now + timedelta(days=60),
                    end_date=now + timedelta(days=62),
                    location="Modhera, Gujarat",
                    event_type=EventType.ASHADHI_BEEJ_MELA,
                    is_active=True,
                ),
                Event(
                    name="Kutch Marathon 2026",
                    description="Desert marathon in the unique landscape of Rann of Kutch. A challenging run with views of the white salt marsh.",
                    start_date=now + timedelta(days=90),
                    end_date=now + timedelta(days=90, hours=8),
                    location="Rann of Kutch",
                    event_type=EventType.MARATHON,
                    is_active=True,
                ),
                Event(
                    name="Dwarka Cultural Festival",
                    description="Celebration of Krishna's legacy with traditional music, dance, and spiritual discourses.",
                    start_date=now + timedelta(days=45),
                    end_date=now + timedelta(days=47),
                    location="Dwarka, Gujarat",
                    event_type=EventType.ASHADHI_BEEJ_MELA,
                    is_active=True,
                ),
            ]
            
            for event in events_data:
                db.add(event)
            
            db.commit()
            print(f"   ✓ Created {len(events_data)} events")
        
        # 2. INSERT GALLERY
        print("\n2️⃣ Inserting GALLERY ENTRIES...")
        
        # Check if gallery entries already exist
        existing_gallery = db.query(Gallery).count()
        if existing_gallery > 0:
            print(f"   ⚠️  Gallery entries already exist ({existing_gallery} found). Skipping.")
        else:
            gallery_data = [
                Gallery(
                    title="Somnath Temple Main Entrance",
                    description="Grand entrance gate of Somnath Temple with architectural details",
                    category=GalleryCategory.TEMPLE,
                    image_url="https://via.placeholder.com/400?text=Somnath+Entrance",
                ),
                Gallery(
                    title="Somnath Temple at Sunset",
                    description="Beautiful sunset view of the ancient Somnath Temple",
                    category=GalleryCategory.TEMPLE,
                    image_url="https://via.placeholder.com/400?text=Somnath+Sunset",
                ),
                Gallery(
                    title="Dwarka Krishna Idol",
                    description="Sacred Krishna idol in Dwarka temple",
                    category=GalleryCategory.MYTHOLOGY,
                    image_url="https://via.placeholder.com/400?text=Dwarka+Krishna",
                ),
                Gallery(
                    title="Rann of Kutch - White Salt Landscape",
                    description="Stunning white salt marsh landscape of Rann of Kutch",
                    category=GalleryCategory.NATURE,
                    image_url="https://via.placeholder.com/400?text=Rann+White+Landscape",
                ),
                Gallery(
                    title="Asiatic Lion in Gir Forest",
                    description="Rare Asiatic lion in its natural habitat at Gir Forest",
                    category=GalleryCategory.NATURE,
                    image_url="https://via.placeholder.com/400?text=Gir+Lion",
                ),
                Gallery(
                    title="Gir Forest Wildlife",
                    description="Diverse wildlife of Gir Forest sanctuary",
                    category=GalleryCategory.NATURE,
                    image_url="https://via.placeholder.com/400?text=Gir+Wildlife",
                ),
                Gallery(
                    title="Modhera Temple Architecture",
                    description="Intricate stone carvings and architecture of Modhera Sun Temple",
                    category=GalleryCategory.TEMPLE,
                    image_url="https://via.placeholder.com/400?text=Modhera+Architecture",
                ),
                Gallery(
                    title="Palitana Temple Fair",
                    description="Annual Pal Takht fair at Sattrunjaya mountain with thousands of pilgrims",
                    category=GalleryCategory.FESTIVAL,
                    image_url="https://via.placeholder.com/400?text=Palitana+Fair",
                ),
                Gallery(
                    title="Marathon Runner at Somnath",
                    description="Participants running in Somnath Marathon event",
                    category=GalleryCategory.CULTURAL,
                    image_url="https://via.placeholder.com/400?text=Marathon+Runners",
                ),
                Gallery(
                    title="Kutch Traditional Crafts",
                    description="Traditional handicrafts displayed at Kutch fair",
                    category=GalleryCategory.CULTURAL,
                    image_url="https://via.placeholder.com/400?text=Kutch+Crafts",
                ),
                Gallery(
                    title="Historic Dwarka Gates",
                    description="Ancient gates of Dwarka city with historical significance",
                    category=GalleryCategory.MONUMENT,
                    image_url="https://via.placeholder.com/400?text=Dwarka+Gates",
                ),
                Gallery(
                    title="Modhera Temple Courtyard",
                    description="Beautiful courtyard of Modhera Sun Temple",
                    category=GalleryCategory.MONUMENT,
                    image_url="https://via.placeholder.com/400?text=Modhera+Courtyard",
                ),
            ]
            
            for gallery in gallery_data:
                db.add(gallery)
            
            db.commit()
            print(f"   ✓ Created {len(gallery_data)} gallery entries")
        
        # Print summary
        print("\n" + "="*80)
        print("✅ DATA INSERTION COMPLETE!")
        print("="*80 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    insert_remaining_data()
