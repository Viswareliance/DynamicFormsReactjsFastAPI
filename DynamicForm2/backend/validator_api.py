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


class EmployeeOptions(str, Enum):
    SoftwareEngineer = "Software Engineer"
    FrontendDeveloper = "Frontend Developer"
    FullStackDeveloper = "Full Stack Developer"
    UIUXDesigner = "UI/UX Designer"


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
    employee_name: str
    employee_no: str
    age: int
    email: EmailStr
    dob: str
    gender: Gender
    message: str
    employee_type: Set[EmployeeOptions]
    image_url: str
    video_url: str
    audio_url: str


#  employee PROFILE VALIDATION
# =====================================================
@app.post("/api/employee-receive")
def receive_data(data: EmployeeProfile):

    errors = {}

    # --- Custom Validation Rules ---
    if len(data.employee_name) < 3:
        errors["employee_name"] = "Name must have at least 3 characters"

    if data.age < 18:
        errors["age"] = "Age must be 18 or above"

    if data.gender == "Other":
        errors["gender"] = "You cannot select 'Other' (custom rule)"

    if errors:
        return {"success": False, "errors": errors}

    return {"success": True, "message": "Validation OK!", "data": data}
