import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# For SQLite, no need for user, password, or host details.
DB_NAME = os.getenv("DB_NAME", "local_db.sqlite")

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_NAME}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},  # Necessary for SQLite in multi-threaded apps
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
