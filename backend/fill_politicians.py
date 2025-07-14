from backend.models import Politician
from backend.database import SessionLocal

# List from above
politicians_data = [
    {"name": "Nancy Pelosi", "party": "Democrat", "state": "CA", "title": "Rep.", "district": "CA-11", "avatar": None, "bio": None},
    {"name": "Dan Crenshaw", "party": "Republican", "state": "TX", "title": "Rep.", "district": "TX-2", "avatar": None, "bio": None},
    {"name": "Pat Fallon", "party": "Republican", "state": "TX", "title": "Rep.", "district": "TX-4", "avatar": None, "bio": None},
    {"name": "Susie Lee", "party": "Democrat", "state": "NV", "title": "Rep.", "district": "NV-3", "avatar": None, "bio": None},
    {"name": "Josh Gottheimer", "party": "Democrat", "state": "NJ", "title": "Rep.", "district": "NJ-5", "avatar": None, "bio": None},
]

db = SessionLocal()
for pdata in politicians_data:
    exists = db.query(Politician).filter_by(name=pdata["name"]).first()
    if not exists:
        pol = Politician(**pdata)
        db.add(pol)
db.commit()
db.close()
print("Inserted all politicians!")
