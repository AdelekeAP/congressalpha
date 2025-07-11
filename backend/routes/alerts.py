from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import AlertSetting
from backend.schemas import AlertSettingCreate, AlertSettingOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Create a new alert setting ---
@router.post("/", response_model=AlertSettingOut)
def create_alert(alert: AlertSettingCreate, db: Session = Depends(get_db)):
    db_alert = AlertSetting(**alert.model_dump())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

# --- Get all alert settings for a user ---
@router.get("/user/{user_id}", response_model=list[AlertSettingOut])
def get_alerts_for_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(AlertSetting).filter(AlertSetting.user_id == user_id).all()

# --- Get a single alert setting by ID ---
@router.get("/{alert_id}", response_model=AlertSettingOut)
def get_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(AlertSetting).filter(AlertSetting.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert setting not found")
    return alert

# --- Update an alert setting by ID ---
@router.put("/{alert_id}", response_model=AlertSettingOut)
def update_alert(alert_id: int, alert_update: AlertSettingCreate, db: Session = Depends(get_db)):
    alert = db.query(AlertSetting).filter(AlertSetting.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert setting not found")
    for field, value in alert_update.model_dump().items():
        setattr(alert, field, value)
    db.commit()
    db.refresh(alert)
    return alert

# --- Delete an alert setting ---
@router.delete("/{alert_id}")
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(AlertSetting).filter(AlertSetting.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert setting not found")
    db.delete(alert)
    db.commit()
    return {"ok": True}
