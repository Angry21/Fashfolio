# backend/agents/echo.py
import google.generativeai as genai
import os

def ask_echo(context):
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    system_prompt = """
    You are ECHO, the Head of Marketing.
    Your focus is VIRALITY and CLICKS.
    Analyze the input and provide:
    1. An Instagram caption with emojis.
    2. 5 high-traffic hashtags.
    3. A short 'Hook' for a TikTok video script.
    """
    
    response = model.generate_content(f"{system_prompt}\n\nTask: {context}")
    return response.text
