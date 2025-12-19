import sys
import json

def calculate_trend(product):
    score = 0
    # Simple Logic: Higher price + specific categories = Higher Trend Score
    if product.get('category') == 'Streetwear':
        score += 80
    elif product.get('category') == 'Vintage':
        score += 60
    else:
        score += 30
        
    if product.get('price', 0) > 1000:
        score += 10 # Premium items get a boost
        
    return score

def main():
    try:
        input_data = sys.stdin.read()
        products = json.loads(input_data)
        
        results = []
        for p in products:
            p['trendScore'] = calculate_trend(p)
            results.append(p)

        print(json.dumps(results))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)

if __name__ == "__main__":
    main()
