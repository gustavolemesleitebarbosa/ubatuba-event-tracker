from fastapi import HTTPException, status
from typing import Any, Dict, Optional

class EventError(HTTPException):
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: str,
        additional_info: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.additional_info = additional_info or {}

class EventNotFoundError(EventError):
    def __init__(self, event_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id {event_id} not found",
            error_code="EVENT_NOT_FOUND",
            additional_info={"event_id": event_id}
        )

class InvalidEventDataError(EventError):
    def __init__(self, detail: str, field_errors: Optional[Dict[str, str]] = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
            error_code="INVALID_EVENT_DATA",
            additional_info={"field_errors": field_errors or {}}
        )

class DatabaseError(EventError):
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
            error_code="DATABASE_ERROR"
        )

class ServiceUnavailableError(EventError):
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail,
            error_code="SERVICE_UNAVAILABLE"
        )

class UnauthorizedError(EventError):
    def __init__(self, detail: str = "Not authenticated"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            error_code="UNAUTHORIZED",
            headers={"WWW-Authenticate": "Bearer"}
        ) 