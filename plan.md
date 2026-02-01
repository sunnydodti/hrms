# HRMS Lite - Development Plan

## Overview
This plan outlines the development of a lightweight HRMS with Employee and Attendance management, using a React frontend and Node.js/Express backend with MongoDB, ensuring a clean UI and production-ready structure.

---

## Tech Stack

### Frontend
- **Framework**: React 18 (with Vite)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: React Context API (for simple state)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: express-validator
- **CORS**: cors middleware

### Deployment
- **Frontend**: Vercel
- **Backend**: Render / Railway
- **Database**: MongoDB Atlas (free tier)

---

## Project Structure

```
hrms/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Database config
│   │   └── server.js       # Entry point
│   └── package.json
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
- [ ] Initialize Node.js project: `npm init -y`
- [ ] Install dependencies:
  - express
  - mongoose
  - cors
  - dotenv
  - express-validator
- [ ] Install dev dependencies: nodemon
- [ ] Create basic Express server with health check endpoint
- [ ] Setup MongoDB connection (local or Atlas)
- [ ] Configure environment variables (`.env`)

#### 1.3 Frontend Setup
- [ ] Initialize React with Vite: `npm create vite@latest`
- [ ] Install dependencies:
  - react-router-dom
  - axios
  - tailwindcss
- [ ] Configure Tailwind CSS
- [ ] Setup basic routing structure
- [ ] Create environment config for API URL

---

### Phase 2: Backend Development (2-2.5 hours)

#### 2.1 Database Models

**Employee Model** (`models/Employee.js`)
```
- employeeId: String (unique, required)
- fullName: String (required)
- email: String (required, validated)
- department: String (required)
- createdAt: Date (auto)
```

**Attendance Model** (`models/Attendance.js`)
```
- employeeId: ObjectId (ref: Employee, required)
- date: Date (required)
- status: String (enum: ['Present', 'Absent'], required)
- createdAt: Date (auto)
- Compound unique index: [employeeId, date]
```

#### 2.2 Employee API Endpoints

- [ ] `POST /api/employees` - Create employee
  - Validate all required fields
  - Check unique employeeId
  - Validate email format
  - Return 201 on success, 400/409 on error

- [ ] `GET /api/employees` - List all employees
  - Return array of employees
  - Return 200 with empty array if none

- [ ] `DELETE /api/employees/:id` - Delete employee
  - Check if employee exists
  - Return 200 on success, 404 if not found

#### 2.3 Attendance API Endpoints

- [ ] `POST /api/attendance` - Mark attendance
  - Validate employeeId exists
  - Validate date and status
  - Prevent duplicate entries (same employee + date)
  - Return 201 on success, 400/409 on error

- [ ] `GET /api/attendance/:employeeId` - Get attendance by employee
  - Return attendance records sorted by date (desc)
  - Return 200 with empty array if none

#### 2.4 Error Handling & Validation
- [ ] Global error handler middleware
- [ ] Validation middleware for all POST requests
- [ ] Proper HTTP status codes (200, 201, 400, 404, 409, 500)
- [ ] Consistent error response format

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

#### 5.2 Frontend Deployment (Vercel)
- [ ] Update API base URL to deployed backend
- [ ] Create `.env.production` with backend URL
- [ ] Push changes to GitHub
- [ ] Import project to Vercel
- [ ] Configure build settings (Vite)
- [ ] Set environment variables
- [ ] Deploy and verify functionality

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

✅ All core features working (Employee CRUD, Attendance marking/viewing)  
✅ Clean, professional UI with proper spacing and typography  
✅ Proper error handling and validation  
✅ Loading and empty states implemented  
✅ Both frontend and backend deployed and accessible  
✅ GitHub repository with complete source code  
✅ Comprehensive README.md  

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
