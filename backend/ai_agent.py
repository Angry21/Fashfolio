import sys
import json
from agents.utils_openrouter import query_openrouter

# PIXIE Uses Llama 3.2 3B (Free, Fast, Reliable)
MODEL = "meta-llama/llama-3.2-3b-instruct:free"

def chat_with_agent(user_query, product_context, context_mode):
    # Define Personas
    personas = {
        "CREATIVE_MODE": "You are 'Pixie', a trendy Gen-Z stylist. Use emojis.",
        "STRATEGIC_MODE": "You are 'Pixie', a ruthless business strategist. No emojis."
    }
    
    system_instruction = personas.get(context_mode, personas["CREATIVE_MODE"])
    
    # Construct prompt
    full_prompt = f"""
    Context Inventory: {json.dumps(product_context)}
    User Query: {user_query}
    """
    
    return query_openrouter(MODEL, system_instruction, full_prompt)

def main():
    try:
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        response = chat_with_agent(data.get('query'), data.get('products'), data.get('context'))
        print(json.dumps({"response": response}))
    except Exception as e:
        print(json.dumps({"response": "Pixie is offline: " + str(e)}))

if __name__ == "__main__":
    main()
