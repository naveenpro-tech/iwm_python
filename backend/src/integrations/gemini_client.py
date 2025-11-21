from __future__ import annotations

import os
import json
from typing import Any, Dict, Optional

import httpx
from ..config import settings

GEMINI_MODEL = settings.gemini_model
GEMINI_API_KEY = settings.gemini_api_key

# Minimal client for Google Generative Language API (Gemini)
# Returns Python dict (parsed JSON) or None if not available
async def fetch_movie_enrichment_with_gemini(query: str) -> Optional[Dict[str, Any]]:
    if not GEMINI_API_KEY:
        return None
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

    system_prompt = (
        "You are a movie knowledge assistant. Return ONLY a single JSON object describing the movie. "
        "Structure strictly as: {\n"
        "  \"external_id\": string (suggest a stable id like 'gem-<slug>'),\n"
        "  \"title\": string, \"tagline\": string|null, \"year\": string|null, \n"
        "  \"release_date\": string|null (ISO YYYY-MM-DD), \"runtime\": number|null (minutes),\n"
        "  \"rating\": string|null, \"siddu_score\": number|null, \"critics_score\": number|null,\n"
        "  \"imdb_rating\": number|null, \"rotten_tomatoes_score\": number|null,\n"
        "  \"language\": string|null, \"country\": string|null, \"overview\": string|null,\n"
        "  \"poster_url\": string|null, \"backdrop_url\": string|null, \"budget\": number|null, \"revenue\": number|null, \"status\": string|null,\n"
        "  \"genres\": [string],\n"
        "  \"directors\": [{\"name\": string, \"image\": string|null}],\n"
        "  \"writers\": [{\"name\": string, \"image\": string|null}],\n"
        "  \"producers\": [{\"name\": string, \"image\": string|null}],\n"
        "  \"cast\": [{\"name\": string, \"character\": string|null, \"image\": string|null}],\n"
        "  \"streaming\": [{\"platform\": string, \"region\": string, \"type\": string, \"price\": number|null, \"quality\": string|null, \"url\": string|null}]\n"
        "}\n"
        "If a field is unknown, set it to null or empty array. DO NOT include commentary."
    )

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": system_prompt},
                    {"text": f"Movie query: {query}\nReturn only JSON."},
                ],
            }
        ]
    }

    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(url, json=payload)
        r.raise_for_status()
        data = r.json()
        # Gemini returns candidates[0].content.parts[0].text with the JSON as text
        candidates = data.get("candidates") or []
        if not candidates:
            return None
        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            return None
        text = parts[0].get("text", "").strip()
        # Try parse JSON
        try:
            if text.startswith("```"):
                # strip fences if present
                text = text.split("\n", 1)[1]
                if text.endswith("```"):
                    text = text[:-3]
            return json.loads(text)
        except Exception:
            return None

