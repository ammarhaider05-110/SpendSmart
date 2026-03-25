from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    amount: float
    type: str
    category: str
    description: Optional[str] = None

class TransactionResponse(BaseModel):
    id: int
    amount: float
    type: str
    category: str
    description: Optional[str]
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True
