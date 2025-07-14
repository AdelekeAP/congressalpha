from fastapi import APIRouter, Depends
from backend.schemas import SimulationRequest, SimulationResponse

router = APIRouter()

@router.post("/simulate-trades", response_model=SimulationResponse)
def simulate_trades(request: SimulationRequest):
    # TODO: Implement simulation logic
    # For now, return dummy data for frontend testing
    return SimulationResponse(
        total_return=0.19,
        final_balance=11900,
        trade_results=[],
        summary_by_politician=[]
    )
