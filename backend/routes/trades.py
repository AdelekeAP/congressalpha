from fastapi import APIRouter
from scrapers.trade_scraper import get_mock_trades

router = APIRouter()

@router.get("/")
def get_trades():
    return get_mock_trades()
