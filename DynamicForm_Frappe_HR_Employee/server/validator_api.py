from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import Set
from enum import Enum


app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- ENUMS ----------------
class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"


class EmployeeStatus(str, Enum):
    Active = "Active"
    Inactive = "Inactive"
    Suspended = "Suspended"
    Left = "Left"


# =====================================================
#  JobApplication MODEL
# =====================================================
class JobApplication(BaseModel):
    name: str

    age: int
    email: EmailStr
    dob: str
    gender: Gender
    message: str


#  LeaveApplication MODEL


class LeaveApplication(BaseModel):
    name: str
    employee_no: str
    age: int
    email: EmailStr
    dob: str
    gender: Gender


# =====================================================
#  JobApplication VALIDATION
# =====================================================
@app.post("/api/jobapplication-receive")
def receive_data(data: JobApplication):

    errors = {}

    # --- Custom Validation Rules ---
    if len(data.name) < 3:
        errors["name"] = "Name must have at least 3 characters"

    if data.age < 18:
        errors["age"] = "Age must be 18 or above"

    if data.gender == "Other":
        errors["gender"] = "You cannot select 'Other' (custom rule)"

    if errors:
        return {"success": False, "errors": errors}

    return {"success": True, "message": "Validation OK!", "data": data}


#  LeaveApplication VALIDATION


@app.post("/api/leaveapplication-receive")
def receive_leaveApplication(data: LeaveApplication):

    errors = {}

    # --- Custom Validation Rules ---
    if len(data.name) < 3:
        errors["name"] = "name must have at least 3 characters"

    if data.age < 18:
        errors["age"] = " age must be 18 or above"

    if data.gender == "Other":
        errors["gender"] = "You cannot select 'Other'  (rule)"

    if errors:
        return {"success": False, "errors": errors}

    return {"success": True, "message": " validation OK!", "data": data}


#  Employee PROFILE MODEL
# =====================================================
class EmployeeProfile(BaseModel):
    doctype: str
    series: str
    first_name: str
    gender: Gender
    date_of_birth: str
    date_of_joining: str
    status: EmployeeStatus
    company: str


#  employee PROFILE VALIDATION
# =====================================================
@app.post("/api/employee-receive")
def receive_data(data: EmployeeProfile):

    errors = {}

    # --- Custom Validation Rules ---
    if len(data.first_name) < 3:
        errors["first_name"] = "Name must have at least 3 characters"

    if data.gender == "Other":
        errors["gender"] = "You cannot select 'Other' (custom rule)"

    if errors:
        return {"success": False, "errors": errors}

    return {"success": True, "message": "Validation OK!", "data": data}


# Send to Frappe UI of New Employee Creation
# from frappe_client import create_frappe_doc


# @app.post("/api/employee-receive")
# def receive_employee(data: EmployeeProfile):

#     errors = {}

#     if len(data.first_name) < 3:
#         errors["first_name"] = "Name must have at least 3 characters"

#     if data.gender == "Other":
#         errors["gender"] = "You cannot select 'Other'"

#     if errors:
#         return {"success": False, "errors": errors}

#     payload = data.dict()

#     doctype = payload.pop("doctype")  # 👈 IMPORTANT

#     try:
#         frappe_response = create_frappe_doc(doctype, payload)
#     except Exception as e:
#         return {"success": False, "errors": {"server": str(e)}}

#     return {
#         "success": True,
#         "message": f"{doctype} created successfully",
#         "frappe_response": frappe_response,
#     }
