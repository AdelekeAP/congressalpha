from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Politician
from backend.schemas import PoliticianCreate, PoliticianOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PoliticianOut)
def create_politician(politician: PoliticianCreate, db: Session = Depends(get_db)):
    db_politician = Politician(**politician.model_dump())
    db.add(db_politician)
    db.commit()
    db.refresh(db_politician)
    return db_politician

@router.get("/", response_model=list[PoliticianOut])
def get_all_politicians(db: Session = Depends(get_db)):
    return db.query(Politician).all()

@router.get("/{politician_id}", response_model=PoliticianOut)
def get_politician(politician_id: int, db: Session = Depends(get_db)):
    politician = db.query(Politician).filter(Politician.id == politician_id).first()
    if not politician:
        raise HTTPException(status_code=404, detail="Politician not found")
    return politician
