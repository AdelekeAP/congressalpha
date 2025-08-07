# migrate_trade_dates.py
import sqlite3
from datetime import datetime

DB_PATH = "/Users/useruser/Documents/congressalpha/test.db"  # <- UPDATE THIS

def convert_date(datestr):
    if not datestr:
        return datestr
    # Already correct?
    if "-" in datestr:
        try:
            datetime.strptime(datestr, "%Y-%m-%d")
            return datestr
        except Exception:
            pass
    # Convert from MM/DD/YYYY
    try:
        dt = datetime.strptime(datestr, "%m/%d/%Y")
        return dt.strftime("%Y-%m-%d")
    except Exception:
        return datestr

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.execute("SELECT id, date FROM trade")  # changed 'trades' -> 'trade'
rows = cur.fetchall()
for trade_id, dateval in rows:
    new_date = convert_date(dateval.strip()) if dateval else dateval
    if new_date != dateval:
        cur.execute("UPDATE trade SET date = ? WHERE id = ?", (new_date, trade_id))
        print(f"Updated id={trade_id}: {dateval} ➔ {new_date}")

conn.commit()
conn.close()
print("Date migration complete for 'trade' table!")
