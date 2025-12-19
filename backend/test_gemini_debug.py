import google.generativeai as genai
import os

key = 'AIzaSyB6kBjLIE85_dz_6HgdQMe5v7NmB8dQcPo'
print(f"Testing key: {key[:5]}...")

genai.configure(api_key=key)
try:
    print("Listing models...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
            break
            
    print("Generating content...")
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content("Hello, this is a test.")
    print("Success! Response:", response.text)
except Exception as e:
    print("Error Details:", e)
