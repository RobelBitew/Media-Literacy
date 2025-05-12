from fastapi import APIRouter, HTTPException, Form
#from app.scraper 
import instaloader
import os

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
        return {"message": f"Session for {username} saved successfully."}
    except Exception as e:
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
        raise HTTPException(status_code=500, detail=str(e))
