from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .routes import events, auth
from .database import engine, Base
import time
from .errors import EventError

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Ubatuba Events API",
    description="API for managing events in Ubatuba, São Paulo",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

@app.middleware("http")
async def log_request_time(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)  # Process the request

    process_time = time.time() - start_time
    print(f"{request.method} {request.url.path} completed in {process_time:.4f} seconds")

    # OPTIONAL: you can also add the process time into the response headers
    response.headers["X-Process-Time"] = str(process_time)
    
    return response

@app.exception_handler(EventError)
async def event_error_handler(request: Request, exc: EventError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.error_code,
                "message": exc.detail,
                "details": exc.additional_info
            }
        }
    )

app.include_router(events.router)
app.include_router(auth.router) 