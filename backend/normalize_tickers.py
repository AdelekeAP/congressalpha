from backend.database import SessionLocal
from backend.models import Trade

def extract_unmapped_companies(ticker_map):
    db = SessionLocal()
    trades = db.query(Trade).all()
    unmapped = set()
    for trade in trades:
        # Only process trades where stock is blank and company exists
        if (not trade.stock or trade.stock.strip() == "") and trade.company and trade.company.strip():
            company_clean = trade.company.strip()
            # If not in map and doesn't look like a stock ticker (e.g., "Apple Inc. (AAPL)")
            has_paren = "(" in company_clean and ")" in company_clean
            if (company_clean not in ticker_map) and not has_paren:
                unmapped.add(company_clean)
    db.close()
    print("\nUnmapped company names ({}):".format(len(unmapped)))
    for c in sorted(unmapped):
        print("-", c)

if __name__ == "__main__":
    # Copy your current TICKER_MAP here:
    TICKER_MAP = {
        "Apple Inc.": "AAPL", "Apple Inc. - Common Stock": "AAPL",
        "Alphabet Inc. - Class A": "GOOGL", "Alphabet Inc. - Class C Capital Stock": "GOOG",
        "Meta Platforms, Inc. - Class A": "META",
        "Microsoft Corporation": "MSFT", "Microsoft Corporation - Common Stock": "MSFT",
        "Amazon.com, Inc.": "AMZN", "NVIDIA Corporation": "NVDA",
        "Netflix, Inc.": "NFLX", "PayPal Holdings, Inc.": "PYPL",
        "Tesla, Inc.": "TSLA", "Tesla, Inc. - Common Stock": "TSLA",
        "Salesforce, Inc.": "CRM", "Broadcom Inc. - Common Stock": "AVGO",
        "Micron Technology, Inc.": "MU", "Palo Alto Networks, Inc.": "PANW",
        "Roblox Corporation Class A": "RBLX", "Rivian Automotive, Inc. - Class A": "RIVN",
        "American Express Company": "AXP", "Visa Inc.": "V",
        "Southwest Airlines Company": "LUV", "Boeing Company": "BA",
        "Walt Disney Company": "DIS", "Warner Bros. Discovery, Inc. - Series A": "WBD",
        "Wynn Resorts, Limited": "WYNN", "Hertz Global Holdings, Inc - Warrant": "HTZWW",
        "SPDR S&P 500": "SPY", "iShares Core S&P Total U.S. Stock Market ETF": "ITOT",
        "United States Oil Fund": "USO", "Direxion Financial Bull 3X Shares": "FAS",
        # Add more mappings as needed!
    }
    extract_unmapped_companies(TICKER_MAP)
