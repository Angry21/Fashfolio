import sys
import json
import os
import google.generativeai as genai

# 1. Setup the AI with the Environment Variable
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    # Fallback if key is missing (prevents crash)
    print(json.dumps([{"error": "Missing API Key"}])) 
    sys.exit()

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.5-flash')

def analyze_trend(product):
    try:
        # 2. Construct the Prompt
        prompt = f"""
        Analyze this fashion item:
        Item: {product.get('title')}
        Designer: {product.get('designer')}
        Category: {product.get('category')}
        Price: ${product.get('price')}

        Task:
        1. Give a 'trendScore' from 0 to 100 based on current fashion trends.
        2. Write a short, catchy 1-sentence 'marketingBlurb' for social media.
        
        Return ONLY valid JSON like this: {{"trendScore": 85, "marketingBlurb": "The must-have look for summer."}}
        """

        # 3. Call the AI
        response = model.generate_content(prompt)
        
        # 4. Clean up result (AI sometimes adds ```json markers)
        text_response = response.text.replace('```json', '').replace('```', '').strip()
        ai_data = json.loads(text_response)
        
        return ai_data
    except Exception as e:
        return {"trendScore": 50, "marketingBlurb": "AI Analysis Unavailable"}

def main():
    try:
        # Read input from Node.js
        input_data = sys.stdin.read()
        products = json.loads(input_data)
        
        results = []
        for p in products:
            # Only analyze if it doesn't have a score yet (to save API credits)
            if p.get('trendScore', 0) == 0:
                analysis = analyze_trend(p)
                p['trendScore'] = analysis.get('trendScore', 0)
                p['marketingBlurb'] = analysis.get('marketingBlurb', "")
            results.append(p)

        # Send back to Node.js
        print(json.dumps(results))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)

if __name__ == "__main__":
    main()
