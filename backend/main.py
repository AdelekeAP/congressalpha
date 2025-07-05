from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import trades

app = FastAPI(title="CongressAlpha API")

# Add this 👇
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routes
app.include_router(trades.router, prefix="/api/trades")
