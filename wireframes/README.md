# HRMS Lite - UI Wireframes

This directory contains plain HTML wireframes for all pages and UI states of the HRMS Lite application.

## Pages Overview

### Core Pages

1. **01-employee-list.html** - Employee List Page
   - Displays all employees in a table format
   - Add Employee button
   - Delete action for each employee
   - Shows both populated and empty states (commented)

2. **02-add-employee.html** - Add Employee Form
   - Form with all required fields (Employee ID, Full Name, Email, Department)
   - Form validation states (commented)
   - Cancel and Submit buttons
   - Clean, focused layout

3. **03-attendance.html** - Attendance Management
   - Mark attendance form (Employee dropdown, Date picker, Status radio buttons)
   - Attendance history table for selected employee
   - Filtered by employee view
   - Empty state (commented)

### UI States

4. **04-loading-state.html** - Loading State
   - Spinner loading indicator
   - Alternative skeleton loading (commented)
   - Used during data fetching

5. **05-error-state.html** - Error States
   - Error alert banner
   - Error state in card
   - Validation error examples (commented)
   - Network error handling

6. **06-delete-confirmation.html** - Delete Confirmation Modal
   - Modal overlay
   - Employee details display
   - Confirm/Cancel actions
   - Warning icon and messaging

7. **07-success-toast.html** - Toast Notifications
   - Success toast (active)
   - Error toast (commented)
   - Info toast (commented)
   - Auto-dismiss notification system

### Bonus Features

8. **08-dashboard-bonus.html** - Dashboard (Optional)
   - Statistics cards (Total Employees, Present Today, Absent Today, Departments)
   - Today's attendance overview table
   - Visual metrics and summaries

## Design System

### Colors
- **Primary**: `#2563eb` (Blue)
- **Danger**: `#dc2626` (Red)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Gray Scale**: `#111`, `#374151`, `#6b7280`, `#9ca3af`, `#d1d5db`, `#e5e7eb`, `#f3f4f6`, `#f9fafb`

### Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Headings**: 1.75rem (h2), 1.25rem (h3)
- **Body**: 0.95rem
- **Small**: 0.875rem

### Spacing
- **Card Padding**: 2rem
- **Button Padding**: 0.75rem 1.5rem
- **Table Padding**: 1rem
- **Gap/Margin**: 1rem, 1.5rem, 2rem

### Components
- **Buttons**: Primary, Secondary, Danger variants
- **Cards**: White background with subtle shadow
- **Tables**: Striped rows on hover
- **Forms**: Clear labels, validation states
- **Badges**: Status indicators (Present/Absent)
- **Modals**: Overlay with centered content
- **Toasts**: Fixed top-right notifications

## Usage

1. Open any HTML file in a web browser to view the wireframe
2. All files are self-contained with inline styles
3. Navigation links connect the pages together
4. Commented sections show alternative states (empty, error, etc.)

## Key Features Demonstrated

✅ Clean, professional layout  
✅ Responsive design principles  
✅ Consistent spacing and typography  
✅ Loading states  
✅ Empty states  
✅ Error handling  
✅ User confirmations  
✅ Success feedback  
✅ Accessible markup  
✅ Intuitive navigation  

## Notes

- These are static wireframes for visual reference
- Real application will have interactive functionality
- Color scheme can be adjusted during implementation
- Mobile responsiveness will be enhanced with Tailwind CSS
- Icons use inline SVG for simplicity
