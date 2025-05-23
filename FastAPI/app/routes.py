from fastapi import APIRouter, HTTPException, Form
import instaloader
import os
import logging
from pydantic import BaseModel
from analysis import analyze_sentiment

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class TextInput(BaseModel):
    text: str

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setFormatter(logging.Formatter('[%(levelname)s] %(asctime)s - %(message)s'))

    fh = logging.FileHandler(os.path.join(LOG_DIR, "app.log"))
    fh.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))

    logger.addHandler(ch)
    logger.addHandler(fh)


SESSION_DIR = "sessions"
os.makedirs(SESSION_DIR, exist_ok=True)
router = APIRouter()

@router.post("/login/")
def login_instagram(username: str = Form(...), password: str = Form(...)):
    L = instaloader.Instaloader()

    try:
        L.login(username, password)
        session_path = os.path.join(SESSION_DIR, f"session-{username}")
        L.save_session_to_file(session_path)
        logger.info(f"Session saved for user: {username}")
        return {"message": f"Session for {username} saved successfully."}
    except Exception as e:
        logger.error(f"Login failed for {username}")
        raise HTTPException(status_code=401, detail=f"Login failed")

@router.get("/followees/{username}")
def get_followees(username: str):
    session_path = os.path.join("sessions", f"session-{username}")
    if not os.path.exists(session_path):
        raise HTTPException(status_code=404, detail="Session file not found")

    try:
        L = instaloader.Instaloader()
        L.load_session_from_file(username, session_path)
        profile = instaloader.Profile.from_username(L.context, username)

        followees = [f.username for f in profile.get_followees()]
        return {"followees": followees}
    except Exception as e:
        logger.error(f"Follower fetch failed: {username} threw bot flag")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze")
async def analyze_text(data: TextInput):
    try:
        sentiment = analyze_sentiment(data.text)
        logger.info(f"Sentiment analyzed: {sentiment}")
        return {"sentiment": sentiment}
    except Exception as e:
        logger.error(f"Sentiment analysis failed: {e}")
        raise HTTPException(status_code=500, detail="Sentiment analysis failed.")