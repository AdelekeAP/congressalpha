from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import engine
from backend.models import Base
 # Adjust if your routes file is elsewhere
from backend.routes import users, trades, politicians, alerts, trades, following
# Create tables on startup (safe to run every time, only creates if not exist)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CongressAlpha API")

# Allow CORS from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change this if frontend runs elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all your routers here
app.include_router(trades.router, prefix="/api/trades")
app.include_router(users.router, prefix="/api/users")
app.include_router(trades.router, prefix="/api/trades")
app.include_router(politicians.router, prefix="/api/politicians")

app.include_router(alerts.router, prefix="/api/alerts")
app.include_router(following.router, prefix="/api/following")