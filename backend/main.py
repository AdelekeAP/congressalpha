from fastapi import FastAPI
from routes import trades

app = FastAPI(title="CongressAlpha API")

app.include_router(trades.router, prefix="/api/trades")
