# backend/routes/following.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Following, User, Politician
from backend.schemas import FollowingCreate, FollowingOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Follow a politician
@router.post("/", response_model=FollowingOut)
def follow_politician(follow: FollowingCreate, db: Session = Depends(get_db)):
    # Ensure user and politician exist
    user = db.query(User).filter(User.id == follow.user_id).first()
    politician = db.query(Politician).filter(Politician.id == follow.politician_id).first()
    if not user or not politician:
        raise HTTPException(status_code=404, detail="User or politician not found")
    # Prevent duplicate follows
    existing = db.query(Following).filter_by(user_id=follow.user_id, politician_id=follow.politician_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already following this politician")
    following = Following(user_id=follow.user_id, politician_id=follow.politician_id)
    db.add(following)
    db.commit()
    db.refresh(following)
    return following

# Unfollow
@router.delete("/{follow_id}", response_model=dict)
def unfollow_politician(follow_id: int, db: Session = Depends(get_db)):
    following = db.query(Following).filter(Following.id == follow_id).first()
    if not following:
        raise HTTPException(status_code=404, detail="Following relationship not found")
    db.delete(following)
    db.commit()
    return {"detail": "Unfollowed"}

# Get all politicians a user follows
@router.get("/user/{user_id}", response_model=list[FollowingOut])
def get_user_following(user_id: int, db: Session = Depends(get_db)):
    follows = db.query(Following).filter(Following.user_id == user_id).all()
    return follows

# Get all followers for a politician
@router.get("/politician/{politician_id}", response_model=list[FollowingOut])
def get_politician_followers(politician_id: int, db: Session = Depends(get_db)):
    followers = db.query(Following).filter(Following.politician_id == politician_id).all()
    return followers
