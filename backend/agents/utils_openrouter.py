import os
import sys
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Initialize the client pointing to OpenRouter
client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.getenv("OPENROUTER_API_KEY"),
)

# List of free models to try in order if the primary fails
FALLBACK_MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "microsoft/phi-3-mini-128k-instruct:free",
    "huggingfaceh4/zephyr-7b-beta:free",
]

def query_openrouter(model, system_prompt, user_input, max_tokens=1000):
    """
    Sends a text-only query to OpenRouter with automatic fallback.
    """
    # Create a list starting with the requested model, then fallbacks (removing duplicates)
    models_to_try = [model] + [m for m in FALLBACK_MODELS if m != model]
    
    last_error = None
    
    for current_model in models_to_try:
        try:
            print(f"🔄 Attempting with model: {current_model}...", file=sys.stderr)
            completion = client.chat.completions.create(
                extra_headers={
                    "HTTP-Referer": os.getenv("SITE_URL", "http://localhost:3000"),
                    "X-Title": os.getenv("SITE_NAME", "FashFolio"),
                },
                model=current_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_input},
                ],
                max_tokens=max_tokens,
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"⚠️ Model {current_model} failed: {str(e)}", file=sys.stderr)
            last_error = e
            continue
            
    return f"All models failed. Last Error: {str(last_error)}"

def query_openrouter_vision(model, system_prompt, image_url):
    """
    Sends an Image + Text query to OpenRouter (for Pixel).
    """
    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": os.getenv("SITE_URL", "http://localhost:3000"),
                "X-Title": os.getenv("SITE_NAME", "FashFolio"),
            },
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": system_prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": image_url}
                        }
                    ]
                }
            ],
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"
