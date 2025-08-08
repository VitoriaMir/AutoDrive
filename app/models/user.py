from typing import Optional
from sqlmodel import SQLModel, Field, Column, DateTime, String
from datetime import datetime, timezone

class UserBase(SQLModel):
    email: str = Field(sa_column=Column(String, unique=True, index=True, nullable=False))
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True), default=datetime.now(timezone.utc)))
    updated_at: datetime = Field(sa_column=Column(DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc)))

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

class UserLogin(SQLModel):
    email: str
    password: str