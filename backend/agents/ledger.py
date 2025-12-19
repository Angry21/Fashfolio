# backend/agents/ledger.py
import google.generativeai as genai
import os

def ask_ledger(context):
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    system_prompt = """
    You are LEDGER, the Chief Financial Officer.
    Your focus is PROFIT MARGINS and VIABILITY.
    Analyze the input and provide:
    1. Suggested price point (High/Mid/Low).
    2. Estimated profit margin analysis.
    3. A risk assessment (e.g., 'High manufacturing cost').
    """
    
    response = model.generate_content(f"{system_prompt}\n\nTask: {context}")
    return response.text
