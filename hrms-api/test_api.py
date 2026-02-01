#!/usr/bin/env python3
"""
HRMS API Test Script
Tests all endpoints for the HRMS API

RECENT FIXES APPLIED:
- Fixed GET/DELETE employee endpoints to work with employee IDs (EMP001, etc.) instead of database UUIDs
- Fixed services to raise ValueError instead of HTTPException for proper error handling
- Fixed attendance endpoints to work correctly
- Employee ID auto-generation now working properly
- Added better error handling for database operations

IMPORTANT: Make sure you have run the schema.sql file against your Supabase database before running this test.
The schema.sql is located in the hrms-db folder.

All endpoints should now work without 500 errors.
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

class HRMSTester:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.test_employee_id = "TEST001"  # Fixed test employee ID
        self.test_employee_data = None

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """Make HTTP request and return response"""
        url = f"{self.base_url}{endpoint}"

        try:
            if data:
                response = self.session.request(method, url, json=data)
            else:
                response = self.session.request(method, url)

            print(f"\n{method} {endpoint}")
            print(f"Status: {response.status_code}")

            if response.content:
                try:
                    result = response.json()
                    print(f"Response: {json.dumps(result, indent=2)}")
                    return result
                except json.JSONDecodeError:
                    print(f"Response: {response.text}")
                    return {"text": response.text}
            else:
                print("Response: (empty)")
                return {}

        except requests.exceptions.RequestException as e:
            print(f"Error: {e}")
            return {"error": str(e)}

    def cleanup_test_employee(self):
        """Clean up test employee if it exists"""
        print("\n" + "="*50)
        print("CLEANING UP TEST EMPLOYEE")
        print("="*50)

        # Try to delete the test employee if it exists
        result = self.make_request("DELETE", f"/api/employees/{self.test_employee_id}")
        if result.get("status_code") == 200 or "deleted successfully" in str(result).lower():
            print(f"Cleaned up existing test employee: {self.test_employee_id}")
        else:
            print(f"Test employee {self.test_employee_id} not found or already cleaned up")

        return result

    def test_health(self):
        """Test health endpoint"""
        print("\n" + "="*50)
        print("TESTING HEALTH ENDPOINT")
        print("="*50)
        return self.make_request("GET", "/api/health")

    def test_create_employee(self):
        """Test creating a new employee"""
        print("\n" + "="*50)
        print("TESTING CREATE EMPLOYEE")
        print("="*50)

        # Use fixed test employee ID
        employee_data = {
            "employeeId": self.test_employee_id,
            "fullName": "John Doe",
            "email": "john.doe@example.com",
            "department": "Engineering"
        }

        result = self.make_request("POST", "/api/employees", employee_data)

        if "employeeId" in result:
            print(f"Created employee with ID: {self.test_employee_id}")
            self.test_employee_data = result

        return result

    def test_create_employee_custom_id(self):
        """Test creating employee with custom ID"""
        print("\n" + "="*50)
        print("TESTING CREATE EMPLOYEE WITH CUSTOM ID")
        print("="*50)

        # Use a different fixed ID for this test
        custom_employee_id = "TEST002"

        employee_data = {
            "employeeId": custom_employee_id,
            "fullName": "Jane Smith",
            "email": "jane.smith@example.com",
            "department": "Marketing"
        }

        result = self.make_request("POST", "/api/employees", employee_data)

        # Clean up this test employee too
        if result.get("status_code") != 400:  # If creation was successful
            cleanup_result = self.make_request("DELETE", f"/api/employees/{custom_employee_id}")

        return result

    def test_get_all_employees(self):
        """Test getting all employees"""
        print("\n" + "="*50)
        print("TESTING GET ALL EMPLOYEES")
        print("="*50)
        return self.make_request("GET", "/api/employees")

    def test_get_employee_by_id(self):
        """Test getting employee by ID"""
        if not self.test_employee_id:
            print("No test employee ID available")
            return {"error": "No test employee ID"}

        print("\n" + "="*50)
        print(f"TESTING GET EMPLOYEE BY ID: {self.test_employee_id}")
        print("="*50)
        return self.make_request("GET", f"/api/employees/{self.test_employee_id}")

    def test_mark_attendance(self):
        """Test marking attendance"""
        if not self.test_employee_id:
            print("No test employee ID available")
            return {"error": "No test employee ID"}

        print("\n" + "="*50)
        print(f"TESTING MARK ATTENDANCE FOR: {self.test_employee_id}")
        print("="*50)

        from datetime import date
        attendance_data = {
            "employeeId": self.test_employee_id,
            "date": str(date.today()),
            "status": "Present"
        }

        return self.make_request("POST", "/api/attendance", attendance_data)

    def test_get_attendance(self):
        """Test getting attendance records"""
        if not self.test_employee_id:
            print("No test employee ID available")
            return {"error": "No test employee ID"}

        print("\n" + "="*50)
        print(f"TESTING GET ATTENDANCE FOR: {self.test_employee_id}")
        print("="*50)
        return self.make_request("GET", f"/api/attendance/{self.test_employee_id}")

    def test_delete_employee(self):
        """Test deleting employee"""
        if not self.test_employee_id:
            print("No test employee ID available")
            return {"error": "No test employee ID"}

        print("\n" + "="*50)
        print(f"TESTING DELETE EMPLOYEE: {self.test_employee_id}")
        print("="*50)
        return self.make_request("DELETE", f"/api/employees/{self.test_employee_id}")

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("Starting HRMS API Tests")
        print(f"Base URL: {self.base_url}")
        print("="*60)

        # Clean up first
        self.cleanup_test_employee()

        # Test health
        self.test_health()

        # Test employee operations
        self.test_create_employee()
        self.test_create_employee_custom_id()
        self.test_get_all_employees()
        self.test_get_employee_by_id()

        # Test attendance operations
        self.test_mark_attendance()
        self.test_get_attendance()

        # Clean up
        self.test_delete_employee()

        print("\n" + "="*60)
        print("All tests completed!")
        print("="*60)


def main():
    """Main function"""
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    else:
        # Default to localhost, but allow user to choose
        print("Select environment:")
        print("1. Localhost (http://localhost:8000)")
        print("2. Production (enter URL)")

        choice = input("Enter choice (1 or 2): ").strip()

        if choice == "1":
            base_url = "http://localhost:8000"
        elif choice == "2":
            base_url = input("Enter production URL: ").strip()
        else:
            print("Invalid choice, using localhost")
            base_url = "http://localhost:8000"

    print(f"Testing API at: {base_url}")

    tester = HRMSTester(base_url)
    tester.run_all_tests()


if __name__ == "__main__":
    main()