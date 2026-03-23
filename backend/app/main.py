from fastapi import FastAPI
from .database import engine, Base
from . import models

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def home():
    return {"message": "SpendSmart API is running and its working!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}