# Ubatuba Events API

A FastAPI backend application for managing local events in Ubatuba, São Paulo. This application provides a RESTful API for browsing, searching, and managing local events.

## Prerequisites

- Python 3.11
- pip (Python package installer)

## Install Python 3.11 (using pyenv)

### macOS

If you don't have `pyenv` installed:

```bash
  brew install pyenv
  pyenv install 3.11.9
  pyenv local 3.11.9
```

### Ubuntu / Debian

```bash
    sudo apt update
    sudo apt install -y make build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev

```

then install pyenv (via curl):

```bash
curl https://pyenv.run | bash
```

Add the following to your ~/.bashrc or ~/.zshrc:

```bash
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv virtualenv-init -)"
```

Restart your shell, then:

```bash
pyenv install 3.11.9
pyenv local 3.11.9
```

### Windows (via pyenv-win)

```bash
git clone https://github.com/pyenv-win/pyenv-win.git $HOME\.pyenv
setx PATH "$HOME\.pyenv\pyenv-win\bin;$HOME\.pyenv\pyenv-win\shims;%PATH%"
```

```bash
pyenv install 3.11.9
pyenv local 3.11.9
```

## API Endpoints

### Public Endpoints
- `GET /events`: Retrieve all events
- `GET /events/{id}`: Retrieve specific event details
- `POST /auth/login`: Login with email and password
- `POST /auth/signup`: Create new user account

### Protected Endpoints (Requires Authentication)
- `POST /events`: Create a new event
- `PUT /events/{id}`: Update an existing event
- `DELETE /events/{id}`: Delete an event


## Features

- RESTful API design
- Data validation using Pydantic
- SQLite database
- Automatic API documentation
- Error handling
- Event management (CRUD operations)

## Development

The application is built using:

- Python 3.11
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

## Infrastructure

### Database

The application uses PostgreSQL hosted on Supabase for data persistence. The database connection is configured using connection pooling for better performance and scalability.

### Hosting

The API is currently hosted on Render.com, providing continuous deployment from the main branch.

### Environment Variables

The following environment variables are required for database connection, create a .env file and replace those with the project secret values:

```bash
DB_NAME=
```

## Technical Details

### Authentication
- JWT-based authentication without expiration
- Password hashing using bcrypt
- Protected routes require Bearer token
- Token validation via middleware

### Error Handling
- Custom error classes for different scenarios
- Consistent error response format
- HTTP status codes:
  - 200: Successful GET/PUT requests
  - 201: Successful POST request
  - 204: Successful DELETE request
  - 400: Bad Request
  - 401: Unauthorized
  - 404: Resource Not Found
  - 422: Validation Error
  - 500: Internal Server Error
  - 503: Service Unavailable

### Database Configuration
- Connection pooling with:
  - Pool size: 5
  - Max overflow: 10
  - Pool timeout: 30 seconds
  - Pool recycle: 1800 seconds
- PostgreSQL with Supabase connection
- SQLAlchemy ORM for database operations

### API Security
- CORS enabled for all origins
- Password hashing with bcrypt
- JWT token validation middleware
- Protected routes for write operations
- Request logging middleware

### Performance
- Database connection pooling
- Request timing logging
- Process time headers in responses

## Getting Started:

To run the app type the following commands:

```bash
python3.11 -m venv venv
source venv/bin/activate
pip3.11 install -r requirements.txt
python3.11 migrations.py
uvicorn app.main:app --reload
```

The API will be available at:

- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Alternative Documentation: http://localhost:8000/redoc

## API Documentation

### Authentication Endpoints

#### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:

```json
{
  "email": "string",
  "password": "string"
}
```

- **Response**: JWT token

#### Signup

- **URL**: `/auth/signup`
- **Method**: `POST`
- **Body**:

```json
{
  "email": "string",
  "password": "string"
}
```

- **Response**: JWT token

### Event Endpoints

#### Get All Events

- **URL**: `/events`
- **Method**: `GET`
- **Response**: Array of events

#### Get Single Event

- **URL**: `/events/:id`
- **Method**: `GET`
- **Response**: Event object

#### Create Event

- **URL**: `/events`
- **Method**: `POST`
- **Authentication**: Required
- **Body**:

```json
{
  "title": "string",
  "description": "string",
  "location": "string",
  "date": "string",
  "category": "string",
  "image": "string"
}
```

#### Update Event

- **URL**: `/events/:id`
- **Method**: `PUT`
- **Authentication**: Required
- **Body**: Same as Create Event

#### Delete Event

- **URL**: `/events/:id`
- **Method**: `DELETE`
- **Authentication**: Required

### Test Structure

The test suite uses pytest and includes:

1. **Authentication Tests**
   - Signup validation
   - Login authentication
   - Token validation
   - Password security

2. **Event Tests**
   - CRUD operations
   - Authorization checks
   - Input validation
   - Error handling

### Test Database

Tests use SQLite as the database backend instead of PostgreSQL for:
- Faster execution
- No external dependencies
- Isolated test environment

### Test Coverage

Key areas covered by tests:
- Route handlers
- Authentication middleware
- Database operations
- Error handling
- Input validation
- Token management

to run the tests execute:

```bash
 pytest tests/ -v
```



