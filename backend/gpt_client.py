import os
import httpx
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
MODEL = "gpt-4o"

SYSTEM_PROMPT = (
    "Переводи в очень веселой манере фразы с обычного языка на придуманные языки. "
    "Ответ должен быть очень смешной и должен полностью по смыслу соответствовать по переводу. "
    "Войди в роль того, на кого осуществляется перевод, учти его особенности и жаргон. "
    "Ответ должен быть краткий и содержать до 20 слов, но можно и лучше и меньше. "
    "Ответ должен содержать много жаргона той роли, в которую входит переводчик. "
    "Ответ может содержать матные слова и англицизмы, если они уместны и подходят. "
    "Добавляй грубости или мягкости и нежности там, где это уместно по языку (например, токсичный менеджер должен быть очень груб и материться, зумер должен быть весь такой кринж лол мягкий."
    "Ответ не может содержать смайлы, эмодзи или специальные символы."
    "Перевод должен быть очень мемным. Будет круто, если перевод будет содержать какие-либо пасхалки из известного кино, музыки или общественной и кулуарной жизни."
)

async def ask_gpt(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 256,
        "temperature": 0.9
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(OPENAI_API_URL, headers=headers, json=data, timeout=30)
        resp.raise_for_status()
        result = resp.json()
        return result["choices"][0]["message"]["content"].strip() 