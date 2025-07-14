import pandas as pd
from sqlalchemy import create_engine

# Path to the combined CSV
csv_file = "/Users/useruser/Documents/congressalpha/backend/trade_data/all_trades_clean.csv"
# Path to your existing test.db (update path as needed)
db_path = "/Users/useruser/Documents/congressalpha/test.db"

# Create the SQLite engine
engine = create_engine(f"sqlite:///{db_path}")

# Read the CSV into a DataFrame
df = pd.read_csv(csv_file)

# Write DataFrame to a new table called 'trades'
df.to_sql('trades', engine, if_exists='replace', index=False)

print("Imported all trades into 'test.db' (table: trades).")
