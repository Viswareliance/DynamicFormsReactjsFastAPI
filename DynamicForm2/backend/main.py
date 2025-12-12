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


class CourseOptions(str, Enum):
    SCIENCE = "Science"
    ARTS = "Arts"
    COMMERCE = "Commerce"
    ENGINEERING = "Engineering"
    SPORTS = "Sports"


# =====================================================
#  MASTER PROFILE MODEL
# =====================================================
class MasterProfile(BaseModel):
    name: str = Field(..., min_length=2, max_length=30)
    username: str = Field(description="Readonly username")
    age: int = Field(..., ge=5, le=100)
    email: EmailStr
    dob: str
    gender: Gender
    message: str = Field("", max_length=500)
    courses: Set[CourseOptions]
    image_url: str = Field("https://picsum.photos/200")
    video_url: str = Field("https://www.w3schools.com/html/mov_bbb.mp4")
    audio_url: str = Field(
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    )


# =====================================================
#  STUDENT PROFILE MODEL (SAME STRUCTURE)
# =====================================================
class StudentProfile(BaseModel):
    student_name: str = Field(..., min_length=2, max_length=30)
    roll_no: str = Field(description="Readonly username")
    age: int = Field(..., ge=5, le=100)
    email: EmailStr
    dob: str
    gender: Gender
    message: str = Field("", max_length=500)
    courses: Set[CourseOptions]
    image_url: str = Field("https://picsum.photos/200")
    video_url: str = Field("https://www.w3schools.com/html/mov_bbb.mp4")
    audio_url: str = Field(
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    )


# =====================================================
#  SHARED UTILITY FOR FORM GENERATION
# =====================================================
def get_form_structure(model, defaults: dict):
    schema = model.model_json_schema()

    # Make read-only field readonly
    for key, value in defaults.items():
        if key in schema["properties"]:
            if "roll" in key or "username" in key:
                schema["properties"][key]["readOnly"] = True

    ui_schema = {
        "gender": {"ui:widget": "radio"},
        "courses": {"ui:widget": "checkboxes"},
        "message": {"ui:widget": "textarea"},
    }

    return {"schema": schema, "uiSchema": ui_schema, "formData": defaults}


# =====================================================
#  ENDPOINTS FOR MASTER PROFILE
# =====================================================
@app.get("/api/profile-form")
def get_master_profile_form():
    defaults = {
        "name": "",
        "username": "user456",
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
    return get_form_structure(MasterProfile, defaults)


@app.post("/api/submit")
def submit_profile(data: MasterProfile):
    return {"status": "success", "received_data": data}


# =====================================================
#  ENDPOINTS FOR STUDENT PROFILE
# =====================================================
@app.get("/api/student-form")
def get_student_form():
    defaults = {
        "student_name": "",
        "roll_no": "ROLL123",
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
    return get_form_structure(StudentProfile, defaults)


@app.post("/api/student-submit")
def submit_student(data: StudentProfile):
    return {"status": "success", "received_data": data}
