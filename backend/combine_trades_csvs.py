import os
import csv

folder = "/Users/useruser/Documents/congressalpha/backend/trade_data"
output_file = os.path.join(folder, "all_trades_clean.csv")
fieldnames = ['company', 'ticker', 'asset_type', 'owner_code', 'date', 'type', 'amount']

# Exclude all_trades_clean.csv from input files
files = [
    f for f in os.listdir(folder)
    if f.endswith("_trades_clean.csv") and f != "all_trades_clean.csv"
]
print(f"Processing {len(files)} CSVs in '{folder}'...")

total_rows = 0

with open(output_file, 'w', newline='', encoding='utf-8') as outfile:
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()
    for filename in files:
        path = os.path.join(folder, filename)
        # Skip empty files
        if os.stat(path).st_size == 0:
            print(f"Skipping empty file: {filename}")
            continue
        print(f"Reading {filename}...")
        with open(path, 'r', encoding='utf-8') as infile:
            reader = csv.DictReader(infile)
            row_count = 0
            for row in reader:
                # Only write rows that have at least a ticker or company (skip blanks)
                if row['company'] or row['ticker']:
                    writer.writerow(row)
                    total_rows += 1
                    row_count += 1
            print(f"Wrote {row_count} rows from {filename}")

print(f"\nCombined {len(files)} CSVs into: {output_file}")
print(f"Total rows written: {total_rows}")
