import os
import csv
from backend.models import Trade, Politician
from backend.database import SessionLocal

folder = "/Users/useruser/Documents/congressalpha/backend/trade_data"
db = SessionLocal()
added = 0
skipped = 0

for filename in os.listdir(folder):
    if filename.endswith("_trades_clean.csv") and filename != "all_trades_clean.csv":
        # Infer politician name from file name
        base = filename.replace("_trades_clean.csv", "").strip().lower()
        # Manually map filename to official name as in your Politician table
        if "pelosi" in base:
            pol_name = "Nancy Pelosi"
        elif "crenshaw" in base:
            pol_name = "Dan Crenshaw"
        elif "pat fallon" in base:
            pol_name = "Pat Fallon"
        elif "susie lee" in base:
            pol_name = "Susie Lee"
        elif "gottheimer" in base:
            pol_name = "Josh Gottheimer"
        else:
            print(f"Could not map {filename} to a politician, skipping.")
            continue

        pol = db.query(Politician).filter_by(name=pol_name).first()
        if not pol:
            print(f"Politician {pol_name} not found, skipping {filename}.")
            continue

        with open(os.path.join(folder, filename), "r", encoding="utf-8") as infile:
            reader = csv.DictReader(infile)
            for row in reader:
                trade = Trade(
                    politician_id=pol.id,
                    politician=pol.name,
                    party=pol.party,
                    avatar=pol.avatar,
                    stock=row['ticker'],
                    company=row['company'],
                    action=row['type'],
                    amount=row['amount'],
                    date=row['date'],
                    price="0",
                    current_price=None,
                    return_="0",
                    status=None
                )
                db.add(trade)
                added += 1

db.commit()
db.close()

print(f"Imported {added} trades. Skipped {skipped}.")
