# backend/agents/vogue.py
import google.generativeai as genai
import os

def ask_vogue(context):
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    system_prompt = """
    You are VOGUE, the Creative Director of FashFolio.
    Your focus is PURE AESTHETICS. You do not care about price.
    Analyze the input and provide:
    1. A visual mood board description.
    2. Key color palettes (Hex codes).
    3. Trending fashion keywords for this season.
    """
    
    response = model.generate_content(f"{system_prompt}\n\nTask: {context}")
    return response.text
