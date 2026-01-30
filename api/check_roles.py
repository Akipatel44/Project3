from app.database.session import SessionLocal
from app.models import Role

db = SessionLocal()
roles = db.query(Role).all()
print(f'Roles in database: {len(roles)}')
for role in roles:
    print(f'  ID: {role.id}, Name: {role.name}')
db.close()
