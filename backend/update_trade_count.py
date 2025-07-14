from backend.models import Politician, Trade
from backend.database import SessionLocal

db = SessionLocal()
all_politicians = db.query(Politician).all()

for pol in all_politicians:
    count = db.query(Trade).filter(Trade.politician_id == pol.id).count()
    pol.trades = count

db.commit()
db.close()

print("Updated trades count for all politicians.")
