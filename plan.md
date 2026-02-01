# HRMS Lite - Development Plan

## Overview
This plan outlines the development of a lightweight HRMS with Employee and Attendance management, using a React frontend and FastAPI backend with MongoDB, ensuring a clean UI and production-ready structure.

---

## Tech Stack

### Frontend
- **Framework**: React 18 (with Vite) - Static build
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: React useState/useEffect (simple state)

### Backend
- **Runtime**: Python 3.10+
- **Framework**: FastAPI
- **Database**: MongoDB with Motor (async) or PyMongo
- **Validation**: Pydantic models (built-in with FastAPI)
- **CORS**: FastAPI CORS middleware

### Deployment
- **Frontend**: Cloudflare Pages (static hosting)
- **Backend**: Render / Railway
- **Database**: MongoDB Atlas (free tier)

---

## Project Structure

```
hrms/
├── client/                 # React frontend (static)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── dist/               # Build output for Cloudflare Pages
│
├── server/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # Pydantic models & MongoDB schemas
│   │   ├── routes/         # API route handlers
│   │   ├── database.py     # Database connection
│   │   ├── config.py       # Configuration & env vars
│   │   └── main.py         # FastAPI app entry point
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## Development Steps

### Phase 1: Project Setup (30-45 min)

#### 1.1 Initialize Repository
- [ ] Create Git repository
- [ ] Setup `.gitignore` for Node.js
- [ ] Create monorepo folder structure (`client/`, `server/`)

#### 1.2 Backend Setup
- [ ] Create Python virtual environment: `python -m venv venv`
- [ ] Activate virtual environment
- [ ] Install dependencies:
  - fastapi
  - uvicorn[standard]
  - pymongo or motor (async)
  - pydantic
  - python-dotenv
  - python-multipart
- [ ] Create basic FastAPI server with health check endpoint
- [ ] Setup MongoDB connection (local or Atlas)
- [ ] Configure environment variables (`.env`)
- [ ] Create requirements.txt

#### 1.3 Frontend Setup
- [ ] Initialize React with Vite: `npm create vite@latest`
- [ ] Install dependencies:
  - react-router-dom
  - axios
  - tailwindcss
  - autoprefixer
  - postcss
- [ ] Configure Tailwind CSS
- [ ] Setup basic routing structure (client-side only)
- [ ] Create environment config for API URL (.env for production)
- [ ] Configure Vite for static build (SPA mode)

---

### Phase 2: Backend Development (2-2.5 hours)

#### 2.1 Database Models & Schemas

**Employee Model** (`models/employee.py`)
```python
# Pydantic Schema
class EmployeeCreate(BaseModel):
    employeeId: str
    fullName: str
    email: EmailStr
    department: str

class EmployeeResponse(BaseModel):
    id: str
    employeeId: str
    fullName: str
    email: str
    department: str
    createdAt: datetime

# MongoDB Document
{
    "_id": ObjectId,
    "employeeId": str (unique index),
    "fullName": str,
    "email": str,
    "department": str,
    "createdAt": datetime
}
```

**Attendance Model** (`models/attendance.py`)
```python
# Pydantic Schema
class AttendanceCreate(BaseModel):
    employeeId: str
    date: date
    status: Literal["Present", "Absent"]

class AttendanceResponse(BaseModel):
    id: str
    employeeId: str
    date: date
    status: str
    createdAt: datetime

# MongoDB Document
{
    "_id": ObjectId,
    "employeeId": str,
    "date": datetime,
    "status": str (enum: Present/Absent),
    "createdAt": datetime
}
# Compound unique index: [employeeId, date]
```

#### 2.2 API Endpoints Documentation

### Employee Endpoints

**1. Create Employee**
```
POST /api/employees
Content-Type: application/json

Request Body:
{
  "employeeId": "EMP001",
  "fullName": "John Doe",
  "email": "john.doe@company.com",
  "department": "Engineering"
}

Success Response (201 Created):
{
  "id": "507f1f77bcf86cd799439011",
  "employeeId": "EMP001",
  "fullName": "John Doe",
  "email": "john.doe@company.com",
  "department": "Engineering",
  "createdAt": "2026-02-01T10:30:00Z"
}

Error Responses:
- 400 Bad Request: Invalid data (missing fields, invalid email)
- 409 Conflict: Employee ID already exists
```

**2. Get All Employees**
```
GET /api/employees

Success Response (200 OK):
[
  {
    "id": "507f1f77bcf86cd799439011",
    "employeeId": "EMP001",
    "fullName": "John Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "createdAt": "2026-02-01T10:30:00Z"
  },
  ...
]

Empty Response (200 OK):
[]
```

**3. Delete Employee**
```
DELETE /api/employees/{employee_id}

Success Response (200 OK):
{
  "message": "Employee deleted successfully",
  "employeeId": "EMP001"
}

Error Responses:
- 404 Not Found: Employee does not exist
```

### Attendance Endpoints

**4. Mark Attendance**
```
POST /api/attendance
Content-Type: application/json

Request Body:
{
  "employeeId": "EMP001",
  "date": "2026-02-01",
  "status": "Present"
}

Success Response (201 Created):
{
  "id": "507f1f77bcf86cd799439012",
  "employeeId": "EMP001",
  "date": "2026-02-01",
  "status": "Present",
  "createdAt": "2026-02-01T10:35:00Z"
}

Error Responses:
- 400 Bad Request: Invalid data (invalid date, invalid status)
- 404 Not Found: Employee does not exist
- 409 Conflict: Attendance already marked for this date
```

**5. Get Attendance by Employee**
```
GET /api/attendance/{employee_id}

Success Response (200 OK):
[
  {
    "id": "507f1f77bcf86cd799439012",
    "employeeId": "EMP001",
    "date": "2026-02-01",
    "status": "Present",
    "createdAt": "2026-02-01T10:35:00Z"
  },
  {
    "id": "507f1f77bcf86cd799439013",
    "employeeId": "EMP001",
    "date": "2026-01-31",
    "status": "Present",
    "createdAt": "2026-01-31T09:00:00Z"
  },
  ...
]
# Sorted by date (descending)

Empty Response (200 OK):
[]

Error Responses:
- 404 Not Found: Employee does not exist
```

**6. Health Check (Optional)**
```
GET /api/health

Success Response (200 OK):
{
  "status": "healthy",
  "timestamp": "2026-02-01T10:40:00Z"
}
```

#### 2.3 Implementation Checklist

- [ ] Implement all employee endpoints with Pydantic validation
- [ ] Implement all attendance endpoints with Pydantic validation
- [ ] Check unique employeeId constraint
- [ ] Validate email format (EmailStr)
- [ ] Prevent duplicate attendance entries (compound index)
- [ ] Return proper HTTP status codes
- [ ] Add CORS middleware for frontend access

#### 2.4 Error Handling & Validation
- [ ] Use FastAPI's built-in HTTPException for errors
- [ ] Pydantic automatic validation for request bodies
- [ ] Custom exception handlers for database errors
- [ ] Proper HTTP status codes (200, 201, 400, 404, 409, 500)
- [ ] Consistent error response format:
```json
{
  "detail": "Error message",
  "type": "validation_error" | "not_found" | "conflict"
}
```

---

### Phase 3: Frontend Development (2.5-3 hours)

#### 3.1 Core Components

**Reusable Components** (`components/`)
- [ ] `Button.jsx` - Primary/Secondary/Danger variants
- [ ] `Input.jsx` - Text input with label and error state
- [ ] `Table.jsx` - Generic table component
- [ ] `Card.jsx` - Container with shadow and padding
- [ ] `LoadingSpinner.jsx` - Loading indicator
- [ ] `EmptyState.jsx` - Empty state message
- [ ] `ErrorMessage.jsx` - Error display

**Layout Components**
- [ ] `Layout.jsx` - Main layout with navigation
- [ ] `Navbar.jsx` - Top navigation bar

#### 3.2 Employee Management Pages

**Employee List Page** (`pages/EmployeeList.jsx`)
- [ ] Fetch and display all employees in a table
- [ ] Show loading state while fetching
- [ ] Show empty state if no employees
- [ ] Delete button for each employee (with confirmation)
- [ ] "Add Employee" button navigating to form
- [ ] Handle errors gracefully

**Add Employee Page** (`pages/AddEmployee.jsx`)
- [ ] Form with fields: Employee ID, Full Name, Email, Department
- [ ] Client-side validation (required fields, email format)
- [ ] Submit handler calling API
- [ ] Show success message and redirect on success
- [ ] Display server-side validation errors
- [ ] Cancel button to go back

#### 3.3 Attendance Management Pages

**Attendance Page** (`pages/Attendance.jsx`)
- [ ] Dropdown to select employee
- [ ] Form to mark attendance (Date picker, Status radio buttons)
- [ ] Display attendance history for selected employee
- [ ] Show loading/empty states
- [ ] Handle duplicate attendance error gracefully

#### 3.4 API Service Layer

**Service** (`services/api.js`)
- [ ] Axios instance with base URL
- [ ] Employee API calls (getAll, create, delete)
- [ ] Attendance API calls (create, getByEmployee)
- [ ] Error interceptor for consistent error handling

#### 3.5 Routing

**Routes** (`App.jsx`)
- [ ] `/` - Dashboard/Home (redirect to employees)
- [ ] `/employees` - Employee list
- [ ] `/employees/add` - Add employee form
- [ ] `/attendance` - Attendance management

---

### Phase 4: UI/UX Polish (45-60 min)

#### 4.1 Styling
- [ ] Consistent color scheme (primary, secondary, danger)
- [ ] Proper spacing and padding (use Tailwind utilities)
- [ ] Responsive design (mobile-friendly)
- [ ] Typography hierarchy (headings, body text)
- [ ] Hover states for interactive elements

#### 4.2 User Experience
- [ ] Confirmation dialog before deleting employee
- [ ] Toast notifications for success/error messages
- [ ] Form validation feedback (inline errors)
- [ ] Disabled states for submit buttons during API calls
- [ ] Keyboard navigation support

#### 4.3 Edge Cases
- [ ] Handle network errors
- [ ] Handle server errors (500)
- [ ] Prevent duplicate submissions
- [ ] Empty state messaging
- [ ] Loading states for all async operations

---

### Phase 5: Deployment (45-60 min)

#### 5.1 Backend Deployment (Render/Railway)
- [ ] Create MongoDB Atlas cluster (free tier)
- [ ] Get connection string
- [ ] Create new web service on Render/Railway
- [ ] Connect GitHub repository
- [ ] Set environment variables:
  - `MONGODB_URI`
  - `PORT`
  - `NODE_ENV=production`
- [ ] Configure build command: `npm install`
- [ ] Configure start command: `node src/server.js`
- [ ] Deploy and verify endpoints

#### 5.2 Frontend Deployment (Cloudflare Pages)
- [ ] Update API base URL to deployed backend
- [ ] Create `.env.production` with backend URL (VITE_API_URL)
- [ ] Build static files: `npm run build`
- [ ] Push changes to GitHub
- [ ] Connect repository to Cloudflare Pages
- [ ] Configure build settings:
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Environment variables: VITE_API_URL
- [ ] Deploy and verify functionality
- [ ] Configure custom domain (optional)

#### 5.3 Testing
- [ ] Test all employee operations (add, list, delete)
- [ ] Test all attendance operations (mark, view)
- [ ] Test error scenarios
- [ ] Test on different browsers
- [ ] Test responsive design

---

### Phase 6: Documentation & Submission (30 min)

#### 6.1 README.md
- [ ] Project overview
- [ ] Tech stack
- [ ] Features implemented
- [ ] Local setup instructions:
  - Prerequisites
  - Installation steps
  - Environment variables
  - Running the app
- [ ] Deployment URLs
- [ ] Assumptions and limitations
- [ ] Screenshots (optional but recommended)

#### 6.2 Code Cleanup
- [ ] Remove console.logs
- [ ] Remove unused imports
- [ ] Format code consistently
- [ ] Add comments for complex logic
- [ ] Verify `.gitignore` excludes `node_modules`, `.env`

#### 6.3 Final Checks
- [ ] All endpoints working
- [ ] Frontend connected to backend
- [ ] No console errors
- [ ] All requirements met
- [ ] Deployment URLs accessible

---

## Bonus Features (If Time Permits)

### Priority 1: Dashboard Summary
- [ ] Create dashboard page with:
  - Total employees count
  - Total attendance records today
  - Recent attendance table

### Priority 2: Attendance Filtering
- [ ] Add date range filter on attendance page
- [ ] Filter by status (Present/Absent)

### Priority 3: Employee Statistics
- [ ] Show total present days per employee
- [ ] Calculate attendance percentage

---

## Time Breakdown (Target: 6-8 hours)

| Phase | Estimated Time |
|-------|----------------|
| Project Setup | 30-45 min |
| Backend Development | 2-2.5 hours |
| Frontend Development | 2.5-3 hours |
| UI/UX Polish | 45-60 min |
| Deployment | 45-60 min |
| Documentation | 30 min |
| **Total** | **7-8 hours** |

---

## Key Success Criteria

[x] All core features working (Employee CRUD, Attendance marking/viewing)
[x] Clean, professional UI with proper spacing and typography
[x] Proper error handling and validation
[x] Loading and empty states implemented
[x] Both frontend and backend deployed and accessible
[x] GitHub repository with complete source code
[x] Comprehensive README.md

---

## Assumptions & Constraints

1. **No Authentication**: Single admin user, no login required
2. **No Employee Edit**: Only add and delete operations
3. **Simple Attendance**: Only Present/Absent, no late/half-day
4. **No Bulk Operations**: Individual operations only
5. **Date Handling**: Use local date, no timezone complexity

---

## Notes

- Focus on **stability over features**
- **Test frequently** during development
- **Commit often** to Git
- **Deploy early** to catch environment issues
- **Don't over-engineer** - keep it simple and functional
