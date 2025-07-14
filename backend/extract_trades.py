import os
import pdfplumber
import re
import csv

folder = "/Users/useruser/Documents/congressalpha/backend/trade_data"

def parse_asset(asset_str):
    pattern = r'^(.*?)\s+\(([A-Z.]+)\)\s+\[([A-Z]+)\]\s+([A-Z]+)'
    match = re.match(pattern, asset_str)
    if match:
        company = match.group(1).strip()
        ticker = match.group(2).strip()
        asset_type = match.group(3).strip()
        owner_code = match.group(4).strip()
        return company, ticker, asset_type, owner_code
    else:
        # Handle assets with no ticker or different formatting
        alt_pattern = r'^(.*?)\s+\[([A-Z]+)\]\s+([A-Z]+)'
        alt_match = re.match(alt_pattern, asset_str)
        if alt_match:
            company = alt_match.group(1).strip()
            ticker = ""
            asset_type = alt_match.group(2).strip()
            owner_code = alt_match.group(3).strip()
            return company, ticker, asset_type, owner_code
        else:
            return asset_str, "", "", ""

def extract_schedule_b(pdf_path):
    trades = []
    schedule_b_found = False
    schedule_c_found = False
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if not text:
                continue
            if "B:" in text:
                schedule_b_found = True
            if schedule_b_found and ("Schedule C" in text or "Schedule C:" in text):
                schedule_c_found = True
                break
            if schedule_b_found and not schedule_c_found:
                lines = text.split("\n")
                for line in lines:
                    match = re.search(
                        r'(.+?)\s+(\d{2}/\d{2}/\d{4})\s+([PSE])(?:\s*\(partial\))?\s+\$?([\d,]+(?:\s*-\s*\$?[\d,]+)?)',
                        line
                    )
                    if match:
                        asset = match.group(1).strip()
                        date = match.group(2).strip()
                        tx_type = match.group(3)
                        amount = match.group(4).replace(",", "")
                        company, ticker, asset_type, owner_code = parse_asset(asset)
                        trades.append({
                            "company": company,
                            "ticker": ticker,
                            "asset_type": asset_type,
                            "owner_code": owner_code,
                            "date": date,
                            "type": tx_type,
                            "amount": amount
                        })
    return trades

# Batch processing loop
for filename in os.listdir(folder):
    if filename.lower().endswith(".pdf"):
        pdf_path = os.path.join(folder, filename)
        trades = extract_schedule_b(pdf_path)
        # Save output with same base name
        csv_out = os.path.splitext(filename)[0] + "_trades_clean.csv"
        csv_out_path = os.path.join(folder, csv_out)
        with open(csv_out_path, 'w', newline='') as csvfile:
            fieldnames = ['company', 'ticker', 'asset_type', 'owner_code', 'date', 'type', 'amount']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for trade in trades:
                writer.writerow(trade)
        print(f"Saved: {csv_out_path}")
