from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    avatar = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    join_date = Column(DateTime, default=datetime.utcnow)
    plan = Column(String, default="Free")
    alerts = relationship("AlertSetting", back_populates="user")
    following_assoc = relationship("Following", back_populates="user", cascade="all, delete-orphan")
    hashed_password = Column(String, nullable=False)


class Politician(Base):
    __tablename__ = "politician"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=True)
    party = Column(String, nullable=False)
    state = Column(String, nullable=False)
    district = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    trades = Column(Integer, default=0)
    followers_count = Column(Integer, default=0)
    win_rate = Column(String, nullable=True)
    total_return = Column(String, nullable=True)
    trades_list = relationship("Trade", back_populates="politician_rel")
    follower_assoc = relationship("Following", back_populates="politician", cascade="all, delete-orphan")

class Trade(Base):
    __tablename__ = "trade"
    id = Column(Integer, primary_key=True, index=True)
    politician_id = Column(Integer, ForeignKey("politician.id"))
    politician = Column(String, nullable=False)
    party = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    stock = Column(String, nullable=False)
    company = Column(String, nullable=False)
    action = Column(String, nullable=False)
    amount = Column(String, nullable=False)
    date = Column(String, nullable=False)
    price = Column(String, nullable=False)
    current_price = Column(String, nullable=True)
    return_ = Column(String, nullable=False)
    status = Column(String, nullable=True)
    politician_rel = relationship("Politician", back_populates="trades_list")

class AlertSetting(Base):
    __tablename__ = "alert_setting"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    politician = Column(String, nullable=True)  # NULL = global
    email_frequency = Column(String, nullable=False)
    enable_email = Column(Boolean, default=True)
    notify_high_volume = Column(Boolean, default=False)
    push_notifications = Column(Boolean, default=True)
    notify_new_politician = Column(Boolean, default=False)
    user = relationship("User", back_populates="alerts")

class Following(Base):
    __tablename__ = "following"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    politician_id = Column(Integer, ForeignKey("politician.id"), nullable=False)

    user = relationship("User", back_populates="following_assoc")
    politician = relationship("Politician", back_populates="follower_assoc")
