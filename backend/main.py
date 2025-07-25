from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.gpt_client import ask_gpt


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslateRequest(BaseModel):
    phrase: str
    style: str

@app.post("/translate")
async def translate(req: TranslateRequest):
    prompt = f"Переведи фразу '{req.phrase}' на стиль '{req.style}' для рабочего общения."
    gpt_result = await ask_gpt(prompt)
    return {"result": gpt_result}
@app.get("/")
def root():
    return {"status": "ok"}