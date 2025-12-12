from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from enum import Enum
from typing import Set

app = FastAPI()

# --- CORS ---
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


# --- Enums ---
class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"


class EmployeeOptions(str, Enum):
    SoftwareEngineer = "Software Engineer"
    FrontendDeveloper = "Frontend Developer"
    FullStackDeveloper = "Full Stack Developer"
    UIUXDesigner = "UI/UX Designer"


#  JobApplication MODEL


class JobApplication(BaseModel):
    name: str = Field(..., min_length=2, max_length=30)

    age: int = Field(..., ge=5, le=100)
    email: EmailStr
    dob: str
    gender: Gender
    message: str = Field("", max_length=500)


#  LeaveApplication MODEL (SAME STRUCTURE)


class LeaveApplication(BaseModel):
    name: str = Field(..., min_length=2, max_length=30)
    employee_no: str = Field(description="Readonly username")
    age: int = Field(..., ge=5, le=100)
    email: EmailStr
    dob: str
    gender: Gender


class EmployeeProfile(BaseModel):
    employee_name: str = Field(..., min_length=2, max_length=30)
    employee_no: str = Field(..., min_length=2, max_length=30)
    age: int = Field(..., ge=5, le=100)
    email: EmailStr
    dob: str
    gender: Gender
    message: str = Field("", max_length=500)
    employee_type: Set[EmployeeOptions]
    image_url: str = Field("https://picsum.photos/200")
    video_url: str = Field("https://www.w3schools.com/html/mov_bbb.mp4")
    audio_url: str = Field(
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    )


#  SHARED UTILITY FOR FORM GENERATION


def get_form_structure(model, defaults: dict):
    schema = model.model_json_schema()

    # Make read-only field readonly
    for key, value in defaults.items():
        if key in schema["properties"]:
            if "roll" in key or "username" in key:
                schema["properties"][key]["readOnly"] = True

    ui_schema = {
        "gender": {"ui:widget": "radio"},
        "employee_type": {"ui:widget": "checkboxes"},
        "message": {"ui:widget": "textarea"},
    }

    return {"schema": schema, "uiSchema": ui_schema, "formData": defaults}


#  ENDPOINTS FOR JobApplication


@app.get("/api/jobapplication-form")
def get_jobApplication_profile_form():
    defaults = {
        "name": "",
        "age": "",
        "email": "",
        "dob": "",
        "gender": "Male",
        "message": "",
    }
    return get_form_structure(JobApplication, defaults)


@app.post("/api/jobapplication-submit")
def submit_jobApplication(data: JobApplication):
    return {"status": "success", "received_data": data}


#  ENDPOINTS FOR STUDENT PROFILE


@app.get("/api/leaveapplication-form")
def get_leaveApplication_form():
    defaults = {
        "name": "",
        "employee_no": "EMP123",
        "age": "",
        "email": "",
        "dob": "",
        "gender": "Male",
    }
    return get_form_structure(LeaveApplication, defaults)


@app.post("/api/leaveapplication-submit")
def submit_leaveApplication(data: LeaveApplication):
    return {"status": "success", "received_data": data}


# employee


@app.get("/api/employee-form")
def get_employee_profile_form():
    defaults = {
        "employee_name": "",
        "employee_no": "Emp456",
        "age": "",
        "email": "",
        "dob": "",
        "gender": "Male",
        "message": "",
        "courses": [],
        "image_url": "https://picsum.photos/200",
        "video_url": "https://www.w3schools.com/html/mov_bbb.mp4",
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    }
    return get_form_structure(EmployeeProfile, defaults)


@app.post("/api/employee-submit")
def submit_employee(data: EmployeeProfile):
    return {"status": "success", "received_data": data}
