import requests
import json
from datetime import datetime, timedelta, date
import random
import time

# Configuration
BASE_URL = "https://hrms-api.persist.site"  # Change to http://localhost:8000 for local testing
TODAY = date(2026, 2, 2)
START_DATE = date(2026, 1, 1)  # Fixed to Jan 1st, 2026
END_DATE = TODAY - timedelta(days=1)  # Till yesterday

DEPARTMENTS = ["Engineering", "Sales", "Human Resources", "Marketing", "Product"]
EMPLOYEES_DATA = [
    {"fullName": "Alice Johnson", "email": "alice.j@example.com", "department": "Engineering"},
    {"fullName": "Bob Smith", "email": "bob.s@example.com", "department": "Sales"},
    {"fullName": "Charlie Brown", "email": "charlie.b@example.com", "department": "Engineering"},
    {"fullName": "Diana Prince", "email": "diana.p@example.com", "department": "Marketing"},
    {"fullName": "Edward Norton", "email": "edward.n@example.com", "department": "Product"},
    {"fullName": "Fiona Gallagher", "email": "fiona.g@example.com", "department": "Human Resources"},
    {"fullName": "George Miller", "email": "george.m@example.com", "department": "Engineering"},
    {"fullName": "Hannah Abbott", "email": "hannah.a@example.com", "department": "Sales"},
    {"fullName": "Ian Wright", "email": "ian.w@example.com", "department": "Marketing"},
    {"fullName": "Jenny Slate", "email": "jenny.s@example.com", "department": "Product"},
]

def seed():
    print(f"Starting seeding process at {BASE_URL}...")
    
    created_employees = []
    
    # 1. Fetch Existing Employees to avoid duplicates
    print("\nChecking existing employees...")
    try:
        response = requests.get(f"{BASE_URL}/api/employees")
        if response.status_code == 200:
            existing_employees = response.json()
            existing_emails = {emp['email']: emp['employeeId'] for emp in existing_employees}
            print(f"Found {len(existing_employees)} existing employees.")
        else:
            existing_emails = {}
            print("Could not fetch existing employees, proceeding with creation.")
    except Exception as e:
        existing_emails = {}
        print(f"Error fetching employees: {e}")

    # 2. Create Employees
    print("\nSetting up employees...")
    for emp_data in EMPLOYEES_DATA:
        if emp_data['email'] in existing_emails:
            emp_id = existing_emails[emp_data['email']]
            created_employees.append(emp_id)
            print(f"Using existing: {emp_data['fullName']} ({emp_id})")
            continue

        try:
            response = requests.post(f"{BASE_URL}/api/employees", json=emp_data)
            if response.status_code in [200, 201]:
                emp = response.json()
                created_employees.append(emp['employeeId'])
                print(f"Created: {emp['fullName']} ({emp['employeeId']})")
            else:
                print(f"Failed to create {emp_data['fullName']}: {response.text}")
        except Exception as e:
            print(f"Error creating employee: {e}")

    if not created_employees:
        print("No employees available. Exiting.")
        return

    # 3. Populate Attendance
    print(f"\nPopulating attendance from {START_DATE} to {END_DATE}...")
    
    current_date = START_DATE
    total_days = (END_DATE - START_DATE).days + 1
    processed_days = 0

    while current_date <= END_DATE:
        # Skip weekends for realism
        if current_date.weekday() >= 5:  # 5 = Saturday, 6 = Sunday
            current_date += timedelta(days=1)
            processed_days += 1
            print(f"Skipping weekend: {current_date}", end='\r')
            continue

        for emp_id in created_employees:
            # Random status: 90% Present, 10% Absent
            status = "Present" if random.random() > 0.1 else "Absent"
            
            attendance_data = {
                "employeeId": emp_id,
                "date": current_date.isoformat(),
                "status": status
            }
            
            try:
                # We use a small delay if needed, but for 260 days * 10 employees = 2600 calls, 
                # it might take a bit. Let's do it efficiently.
                response = requests.post(f"{BASE_URL}/api/attendance", json=attendance_data)
                if response.status_code != 200:
                    if "already marked" not in response.text: # Ignore duplicates
                        print(f"\nError for {emp_id} on {current_date}: {response.text}")
            except Exception as e:
                print(f"\nConnection error: {e}")
        
        processed_days += 1
        percentage = (processed_days / total_days) * 100
        print(f"Progress: {percentage:.1f}% ({current_date})", end='\r')
        
        current_date += timedelta(days=1)

    print("\n\nSeeding completed successfully!")
    print(f"Total employees: {len(created_employees)}")
    print(f"Date range: {START_DATE} to {END_DATE}")

if __name__ == "__main__":
    seed()
