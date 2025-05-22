import os
import uuid
from gtts import gTTS # type: ignore
from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend usage
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route to check API is working
@app.get("/")
def read_root():
    return {"message": "Voice API is running."}

@app.post("/voice")
async def generate_voice(request: Request, background_tasks: BackgroundTasks):
    try:
        payload = await request.json()
        text = payload.get("text")

        if not text:
            raise HTTPException(status_code=400, detail="Missing 'text' in request body.")

        # Generate unique filename
        filename = f"{uuid.uuid4().hex}.mp3"
        audio_path = os.path.join("tmp", filename)
        os.makedirs("tmp", exist_ok=True)

        # Use gTTS to synthesize speech
        tts = gTTS(text)
        tts.save(audio_path)

        # Background cleanup
        def cleanup(path: str):
            try:
                os.remove(path)
            except OSError:
                pass

        background_tasks.add_task(cleanup, audio_path)

        return FileResponse(audio_path, media_type="audio/mpeg", filename=filename)

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})
