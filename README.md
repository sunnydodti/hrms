# HRMS Lite - Human Resource Management System

A lightweight, professional Human Resource Management System (HRMS) built to manage employee records and track daily attendance.

## Live Demo
- **Frontend**: [hrms.persist.site/](https://hrms.persist.site/)
- **API**: [hrms-api.persist.site](https://hrms-api.persist.site/)
- **API Documentation**: [hrms-api.persist.site/docs](https://hrms-api.persist.site/docs)

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Axios.
  - Hosted on **Cloudflare Pages**.
- **Backend**: Python (FastAPI), SQLAlchemy, Pydantic.
  - Hosted on **Render** (with a keep-alive job to prevent sleep).
- **Database**: PostgreSQL via **Supabase**.
- **Version Control**: [GitHub Repository](https://github.com/sunnydodti/hrms)

## Project Documentation
- **Development Plan**: [plan](./plan.md)
- **Design Wireframes**: [wireframes](./wireframes/README.md)

## Key Features
- **Dashboard**: Real-time summary of total employees, present/absent counts for today, and active departments.
- **Employee Management**: 
  - Add, view, and delete employees.
  - Automatic Employee ID generation (e.g., EMP001).
  - Validations for email and required fields.
- **Attendance Tracking**:
  - Mark employees as Present or Absent for specific dates.
  - View full attendance history for each employee.
  - **Date Filtering**: Search attendance records by specific date (Bonus).
  - **Present Days Count**: Total active days displayed per employee (Bonus).
- **Professional UI**: Responsive dark theme matching modern design aesthetics with high-contrast status indicators.
- **Robust Error Handling**: Server-side middleware for consistent error responses and frontend toast notifications.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL Database (Supabase)

### Installation & Local Setup

#### 1. Clone the repository
```bash
git clone https://github.com/sunnydodti/hrms.git
cd hrms
```

#### 2. Backend Setup
```bash
cd hrms-api
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your DATABASE_URL (Supabase connection string)
```

#### 3. Frontend Setup
```bash
cd hrms-ui
npm install
npm run dev
```

## Assumptions & Limitations
- **Single User**: No authentication is implemented as per the requirements.
- **Attendance**: Each employee can have only one attendance record per day.
- **Keep-Alive**: The Render backend uses a looping request pattern to prevent the free tier from sleeping.

## License
MIT
