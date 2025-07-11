# backend/test_db.py
from backend.database import SessionLocal
from backend.models import User

db = SessionLocal()
test_user = User(name="Test User", email="test@example.com")
db.add(test_user)
db.commit()
db.refresh(test_user)
print("Inserted:", test_user.id, test_user.name)
db.close()
