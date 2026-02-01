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
- MongoDB connection management
- Collection access
- Query execution

### 5. Models (`app/models/`)
- Pydantic schemas for validation
- Request/response models
- Data type definitions

## API Endpoints

### Health
- `GET /api/health` - Health check

### Employees
- `POST /api/employees` - Create employee
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
   # Edit .env with your settings
   ```

4. **Run development server**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. **Access API**
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Current Status

✅ Layered architecture implemented  
✅ All endpoints defined with dummy responses  
✅ Pydantic models for validation  
✅ API documentation generated  
⏳ Database integration pending  
⏳ Actual business logic pending  

## Next Steps

1. Implement MongoDB connection
2. Implement actual database operations in services
3. Add error handling for database operations
4. Add unit tests
5. Deploy to production
