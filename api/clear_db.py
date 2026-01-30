from app.database.session import SessionLocal
from app.models import User, Role, Place, Event, Gallery

db = SessionLocal()
# Delete all data
db.query(Gallery).delete()
db.query(Event).delete()
db.query(Place).delete()
db.query(User).delete()
db.query(Role).delete()
db.commit()
print('Database cleared')
db.close()
