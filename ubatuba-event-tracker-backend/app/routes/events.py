from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from ..auth.utils import get_current_user
from ..errors import (
    EventNotFoundError, 
    InvalidEventDataError, 
    DatabaseError,
    ServiceUnavailableError
)

router = APIRouter(prefix="/events", tags=["events"])

# Public routes (no auth required)
@router.get("/", response_model=List[schemas.Event], status_code=status.HTTP_200_OK)
def get_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        events = db.query(models.Event).offset(skip).limit(limit).all()
        return events
    except Exception as e:
        raise DatabaseError(f"Error fetching events: {str(e)}")

@router.get("/{event_id}", response_model=schemas.Event, status_code=status.HTTP_200_OK)
def get_event(event_id: int, db: Session = Depends(get_db)):
    try:
        event = db.query(models.Event).filter(models.Event.id == event_id).first()
        if event is None:
            raise EventNotFoundError(event_id)
        return event
    except EventNotFoundError:
        raise
    except Exception as e:
        raise DatabaseError(f"Error fetching event: {str(e)}")

# Protected routes (auth required)
@router.post("/", response_model=schemas.Event, status_code=status.HTTP_201_CREATED)
def create_event(
    event: schemas.EventCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        db_event = models.Event(**event.dict())
        db.add(db_event)
        db.commit()
        db.refresh(db_event)
        return db_event
    except Exception as e:
        db.rollback()
        raise DatabaseError(f"Error creating event: {str(e)}")

@router.put("/{event_id}", response_model=schemas.Event, status_code=status.HTTP_200_OK)
def update_event(
    event_id: int, 
    event: schemas.EventUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
        if db_event is None:
            raise EventNotFoundError(event_id)
        
        update_data = event.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_event, field, value)
        
        db.commit()
        db.refresh(db_event)
        return db_event
    except EventNotFoundError:
        raise
    except Exception as e:
        db.rollback()
        raise DatabaseError(f"Error updating event: {str(e)}")

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
        if db_event is None:
            raise EventNotFoundError(event_id)
        
        db.delete(db_event)
        db.commit()
    except EventNotFoundError:
        raise
    except Exception as e:
        db.rollback()
        raise DatabaseError(f"Error deleting event: {str(e)}") 