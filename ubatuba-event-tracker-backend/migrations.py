from app.database import engine, Base
from app.models import Event
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def init_db():
    # Verify if the SQLite database file is provided in the environment
    db_name = os.getenv("DB_NAME", "local_db.sqlite")

    # Check if the database file exists and is accessible
    if not db_name:
        raise ValueError("SQLite database file is not specified.")

    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print(f"Database tables created successfully for {db_name}!")

if __name__ == "__main__":
    init_db()
