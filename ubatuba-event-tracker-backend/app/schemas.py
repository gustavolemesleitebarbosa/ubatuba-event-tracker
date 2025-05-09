from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class EventBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    date: datetime
    location: str = Field(..., min_length=1, max_length=100)
    image: Optional[str] = None
    category: Optional[str] = Field(None, max_length=50)

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    date: Optional[datetime] = None
    location: Optional[str] = Field(None, min_length=1, max_length=100)
    image: Optional[str] = None
    category: Optional[str] = Field(None, max_length=50)

class Event(EventBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: str = Field(..., min_length=5, max_length=100, description="Email address")
    password: str = Field(
        ..., 
        min_length=6, 
        description="Password must be at least 6 characters long"
    )

class UserLogin(BaseModel):
    email: str = Field(..., min_length=5, max_length=100, description="Email address")
    password: str = Field(
        ..., 
        min_length=6, 
        description="Password must be at least 6 characters long"
    )

class Token(BaseModel):
    access_token: str
    token_type: str 