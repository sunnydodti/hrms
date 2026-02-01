# HRMS Lite - Backend API

FastAPI backend for HRMS Lite application with layered architecture.

## Project Structure

```
hrms-api/
├── app/
│   ├── __init__.py
│   ├── config.py              # Configuration settings
│   ├── database/              # Database layer
│   │   ├── __init__.py
│   │   └── connection.py      # MongoDB connection
│   ├── models/                # Pydantic models
│   │   ├── __init__.py
│   │   ├── employee.py        # Employee schemas
│   │   ├── attendance.py      # Attendance schemas
│   │   └── common.py          # Common schemas
│   ├── routes/                # API routes/controllers
│   │   ├── __init__.py
│   │   ├── employees.py       # Employee endpoints
│   │   ├── attendance.py      # Attendance endpoints
│   │   └── health.py          # Health check
│   └── services/              # Business logic layer
│       ├── __init__.py
│       ├── employee_service.py
│       └── attendance_service.py
├── main.py                    # Application entry point
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
└── README.md
```

## Architecture Layers

### 1. Main (`main.py`)
- FastAPI application initialization
- CORS middleware configuration
- Router registration
- Startup/shutdown events

### 2. Routes (`app/routes/`)
- HTTP endpoint definitions
- Request/response handling
- Input validation
- Error handling
- Delegates to service layer

### 3. Services (`app/services/`)
- Business logic
- Data processing
- Validation rules
- Delegates to database layer

### 4. Database (`app/database/`)
- PostgreSQL connection management via SQLAlchemy
- Async database operations
- Automatic table initialization
- Session management

### 5. Models (`app/models/`)
- Pydantic schemas for validation
- Request/response models
- SQLAlchemy ORM models for database
- Data type definitions

## API Endpoints

### Health
- `GET /api/health` - Health check

### Employees
- `POST /api/employees` - Create employee (employeeId auto-generated if not provided)
- `GET /api/employees` - Get all employees
- `GET /api/employees/{employee_id}` - Get employee by ID
- `DELETE /api/employees/{employee_id}` - Delete employee

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/{employee_id}` - Get attendance records

## Setup

1. **Create virtual environment**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # macOS/Linux
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   copy .env.example .env
   # Edit .env with your Supabase PostgreSQL URL
   ```

4. **Run development server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Access API**
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Deployment

### Production Deployment

The application automatically handles database initialization on startup:

1. **Environment Setup**
   - Set `DATABASE_URL` environment variable with your PostgreSQL connection string
   - Set `ENVIRONMENT=production` to disable SQL echo logs

2. **Database Initialization**
   - Tables are created automatically when the app starts
   - No manual database setup required
   - Safe to run multiple times (idempotent)

3. **Running in Production**
   ```bash
   # Using uvicorn directly
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

   # Or using gunicorn with uvicorn workers (recommended for production)
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

### Database Schema

The application uses PostgreSQL with the following features:
- UUID primary keys with automatic generation
- Foreign key constraints
- Unique constraints for attendance (employee + date)
- Proper indexing for performance
- Enum types for attendance status

## Current Status

✅ Layered architecture implemented  
✅ PostgreSQL database integration complete  
✅ All endpoints with real database operations  
✅ Pydantic models for validation  
✅ API documentation generated  
✅ Automatic database initialization  
✅ Production-ready deployment setup  
⏳ Unit tests pending  
⏳ CI/CD pipeline pending  

## Next Steps

1. Add comprehensive unit tests
2. Set up CI/CD pipeline
3. Add monitoring and logging
4. Implement rate limiting
5. Add API versioning
