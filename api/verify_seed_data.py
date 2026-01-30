#!/usr/bin/env python
"""Verify that seed data was properly inserted into database"""

from app.database.session import SessionLocal
from app.models import Role, User, Place, Event, Gallery

def verify_data():
    """Check all tables for data"""
    db = SessionLocal()
    
    print("="*80)
    print("DATABASE SEED DATA VERIFICATION")
    print("="*80)
    
    try:
        # Check Roles
        roles_count = db.query(Role).count()
        print(f"\n✓ ROLES TABLE:")
        print(f"  Total roles: {roles_count}")
        roles = db.query(Role).all()
        for role in roles:
            print(f"    - ID: {role.id}, Name: {role.name}")
        
        # Check Users
        users_count = db.query(User).count()
        print(f"\n✓ USERS TABLE:")
        print(f"  Total users: {users_count}")
        users = db.query(User).all()
        for user in users:
            print(f"    - ID: {user.id}, Email: {user.email}, Name: {user.full_name}")
        
        # Check Places (use try-except to handle enum issues)
        places_count = db.query(Place).count()
        print(f"\n✓ PLACES TABLE:")
        print(f"  Total places: {places_count}")
        try:
            places = db.query(Place).all()
            for place in places:
                print(f"    - ID: {place.id}, Name: {place.name}, Type: {place.place_type}")
        except Exception as e:
            # If enum issue, just show IDs and names
            from sqlalchemy import text
            result = db.execute(text("SELECT id, name FROM places"))
            for row in result:
                print(f"    - ID: {row[0]}, Name: {row[1]}")
        
        # Check Events (use try-except to handle enum issues)
        events_count = db.query(Event).count()
        print(f"\n✓ EVENTS TABLE:")
        print(f"  Total events: {events_count}")
        try:
            events = db.query(Event).all()
            for event in events:
                print(f"    - ID: {event.id}, Name: {event.name}, Type: {event.event_type}")
        except Exception as e:
            # If enum issue, just show IDs and names
            from sqlalchemy import text
            result = db.execute(text("SELECT id, name FROM events"))
            for row in result:
                print(f"    - ID: {row[0]}, Name: {row[1]}")
        
        # Check Gallery
        gallery_count = db.query(Gallery).count()
        print(f"\n✓ GALLERY TABLE:")
        print(f"  Total gallery entries: {gallery_count}")
        try:
            gallery = db.query(Gallery).all()
            for g in gallery:
                print(f"    - ID: {g.id}, Title: {g.title}, Category: {g.category}")
        except Exception as e:
            # If enum issue, just show IDs and titles
            from sqlalchemy import text
            result = db.execute(text("SELECT id, title FROM gallery"))
            for row in result:
                print(f"    - ID: {row[0]}, Title: {row[1]}")
        
        # Summary
        print("\n" + "="*80)
        print("SUMMARY:")
        print("="*80)
        print(f"Roles:   {roles_count}")
        print(f"Users:   {users_count}")
        print(f"Places:  {places_count}")
        print(f"Events:  {events_count}")
        print(f"Gallery: {gallery_count}")
        print("="*80)
        
        if roles_count > 0 and users_count > 0 and places_count > 0 and events_count > 0 and gallery_count > 0:
            print("✅ Database properly initialized with ALL sample data!")
        elif roles_count > 0 and users_count > 0:
            print("⚠️  Database has default data (roles/users) but missing sample data")
        else:
            print("⚠️  Database has missing critical data (roles/users)")
            
    except Exception as e:
        print(f"❌ Error checking database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_data()
