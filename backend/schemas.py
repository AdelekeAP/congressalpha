from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

class TradeBase(BaseModel):
    politician: str
    party: str
    avatar: Optional[str] = None
    stock: str
    company: str
    action: str
    amount: str
    date: str
    price: str
    current_price: Optional[str] = None
    return_: str
    status: Optional[str] = None

class TradeCreate(TradeBase):
    pass

class TradeOut(TradeBase):
    id: int

    class Config:
        from_attributes = True

class PoliticianBase(BaseModel):
    name: str
    title: Optional[str] = None
    party: str
    state: str
    district: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    trades: Optional[int] = 0
    followers_count: Optional[int] = 0
    win_rate: Optional[str] = None
    total_return: Optional[str] = None

class PoliticianCreate(PoliticianBase):
    pass

class PoliticianOut(PoliticianBase):
    id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    name: str
    email: EmailStr
    avatar: Optional[str] = None
    bio: Optional[str] = None
    join_date: Optional[str] = None
    plan: Optional[str] = "Free"

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str  # Only for registration
    avatar: Optional[str] = None
    bio: Optional[str] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    avatar: Optional[str] = None
    bio: Optional[str] = None
    # Do NOT include hashed_password!

    class Config:
        from_attributes = True  # for pydantic v2+



class AlertSettingBase(BaseModel):
    user_id: int
    politician: Optional[str] = None  # null for global
    email_frequency: str
    enable_email: bool
    notify_high_volume: bool
    push_notifications: bool
    notify_new_politician: bool

class AlertSettingCreate(AlertSettingBase):
    pass

class AlertSettingOut(AlertSettingBase):
    id: int

    class Config:
        from_attributes = True

class FollowingBase(BaseModel):
    user_id: int
    politician_id: int

class FollowingCreate(FollowingBase):
    pass

class FollowingOut(FollowingBase):
    id: int

    class Config:
        from_attributes = True
class SimulationRequest(BaseModel):
    politician_ids: List[int]
    start_date: date
    end_date: date
    investment_amount: float
    simulation_strategy: Optional[str] = "equal"

class TradeSimulationResult(BaseModel):
    trade_id: int
    ticker: str
    buy_date: date
    buy_price: float
    sell_date: date
    sell_price: float
    return_: float
    politician_id: int

class PoliticianSummary(BaseModel):
    politician_id: int
    return_: float

class SimulationResponse(BaseModel):
    total_return: float
    final_balance: float
    trade_results: List[TradeSimulationResult]
    summary_by_politician: List[PoliticianSummary]