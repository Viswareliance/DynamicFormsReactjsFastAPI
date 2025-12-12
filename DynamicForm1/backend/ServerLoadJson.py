import json
import os
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# -------------------------------
# Load environment variables
# -------------------------------
load_dotenv()

logging.basicConfig(level=logging.INFO)
app = FastAPI(title="Dynamic Form API")

# -------------------------------
# Paths
# -------------------------------
BASE_DIR = os.getenv("BASE_DIR") or os.path.dirname(os.path.abspath(__file__))
QUESTION_FILE = os.path.join(BASE_DIR, os.getenv("QUESTION_FILE") or "questions.json")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

# Ensure uploads folder exists
os.makedirs(UPLOAD_DIR, exist_ok=True)


# -------------------------------
# CORS (React allowed)
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------
# Helper: JSON Reader
# -------------------------------
def read_json(path: str):
    """Safely read and return JSON file contents."""
    if not os.path.exists(path):
        raise HTTPException(404, detail=f"JSON file not found: {path}")

    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        raise HTTPException(500, detail="Invalid JSON format")
    except Exception as e:
        raise HTTPException(500, detail=f"Error reading JSON: {str(e)}")


# -------------------------------
# Routes
# -------------------------------
@app.get("/")
def root():
    return {"message": "Dynamic Form API running"}


# -------------------------------
# GET: All questions
# -------------------------------
@app.get("/questions")
def get_all_questions():
    data = read_json(QUESTION_FILE)
    return {"success": True, "data": data}


# -------------------------------
# GET: Questions by category
# -------------------------------
@app.get("/questions/category/{category}")
def get_questions_by_category(category: str):
    data = read_json(QUESTION_FILE)
    sections = data.get("QuestionSection", {})

    if category not in sections:
        raise HTTPException(404, detail=f"Category '{category}' not found")

    return {"success": True, "data": sections[category]}


# -------------------------------
# GET: Single question inside category
# -------------------------------
@app.get("/questions/category/{category}/{qturn_id}")
def get_single_question(category: str, qturn_id: str):
    data = read_json(QUESTION_FILE)
    categories = data.get("QuestionSection", {})

    if category not in categories:
        raise HTTPException(404, detail=f"Category '{category}' not found")

    for q in categories[category]:
        if str(q.get("QturnId")) == str(qturn_id):
            return {"success": True, "data": q}

    raise HTTPException(
        404, detail=f"QturnId '{qturn_id}' not found in category '{category}'"
    )


# -------------------------------
# POST: Upload answers by category
# -------------------------------
@app.post("/upload_answers")
async def upload_answers(request: Request):
    """Save answers categorized into separate JSON files"""
    try:
        data = await request.json()
    except:
        raise HTTPException(400, detail="Invalid JSON body")

    if not isinstance(data, list):
        raise HTTPException(400, detail="Request body must be a list of answers")

    # Organize answers by category
    categorized_answers = {}

    for answer in data:
        category = answer.get("category")

        if not category:
            logging.warning(f"Missing category in answer: {answer}")
            category = "Unknown"

        categorized_answers.setdefault(category, [])
        categorized_answers[category].append(answer)

    # Save each category into its own file
    try:
        for category, answer_list in categorized_answers.items():
            file_path = os.path.join(UPLOAD_DIR, f"{category}.json")

            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(answer_list, f, indent=4, ensure_ascii=False)

            logging.info(f"Saved {len(answer_list)} answers → {file_path}")

        return {"success": True, "message": "Answers saved successfully"}

    except Exception as e:
        logging.error(f"Error saving answers: {e}")
        raise HTTPException(500, detail="Failed to save answers to files")
