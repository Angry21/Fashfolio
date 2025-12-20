import sys
import json
from utils_openrouter import query_openrouter_vision

# PIXEL: Uses Llama 3.2 11B Vision (Free)
MODEL = "meta-llama/llama-3.2-11b-vision-instruct:free"

def analyze_image(image_url):
    prompt = """
    Analyze this fashion image. Return ONLY a JSON object:
    {
        "color_hex": "#RRGGBB",
        "fabric": "Material Name",
        "style_tags": ["Tag1", "Tag2"],
        "visual_rating": 8.5
    }
    """
    
    # 1. Get raw text from Vision Model
    raw_response = query_openrouter_vision(MODEL, prompt, image_url)
    
    # 2. Clean up JSON (Models often add ```json blocks)
    try:
        clean_json = raw_response.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
    except:
        return {
            "error": "Failed to parse JSON", 
            "raw_output": raw_response, 
            "style_tags": ["AI_ERROR"], 
            "visual_rating": 0
        }

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        request = json.loads(input_data)
        if request.get('imageUrl'):
            print(json.dumps(analyze_image(request.get('imageUrl'))))
        else:
            print(json.dumps({"error": "No URL provided"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
