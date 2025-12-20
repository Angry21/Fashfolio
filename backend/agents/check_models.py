import os
import time
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.getenv("OPENROUTER_API_KEY"),
)

models_to_test = [
    "meta-llama/llama-3.2-3b-instruct:free",
    "huggingfaceh4/zephyr-7b-beta:free",
    "qwen/qwen-2-7b-instruct:free",
    "google/gemini-2.0-flash-exp:free", 
]

print("Testing Models...")
for model in models_to_test:
    print(f"\n--- Testing {model} ---")
    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": os.getenv("SITE_URL"),
                "X-Title": os.getenv("SITE_NAME"),
            },
            model=model,
            messages=[
                {"role": "user", "content": "Say 'Online' if you can hear me."}
            ],
            max_tokens=10,
        )
        print(f"SUCCESS: {completion.choices[0].message.content}")
    except Exception as e:
        print(f"FAILED: {e}")
