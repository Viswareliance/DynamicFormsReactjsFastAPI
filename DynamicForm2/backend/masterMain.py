from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

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


# --- Location Model ---
class Location(BaseModel):
    lat: float = Field(..., description="Latitude")
    lon: float = Field(..., description="Longitude")


# --- Endpoint for location form ---
@app.get("/api/location-form")
def get_location_form():
    schema = {
        "title": "A localisation form",
        "type": "object",
        "required": ["lat", "lon"],
        "properties": {
            "lat": {"type": "number"},
            "lon": {"type": "number"},
        },
    }

    ui_schema = {
        "lat": {
            "ui:widget": "updown",
            "ui:options": {"classNames": "w-full p-2 border rounded"},
        },
        "lon": {
            "ui:widget": "updown",
            "ui:options": {"classNames": "w-full p-2 border rounded"},
        },
    }

    form_data = {"lat": 0, "lon": 0}

    return {
        "schema": schema,
        "uiSchema": ui_schema,
        "formData": form_data,
    }


@app.post("/api/location-submit")
def submit_location(data: Location):
    return {"status": "success", "received_data": data}
