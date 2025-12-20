from utils_openrouter import query_openrouter

# VOGUE Uses Llama 3.2 3B (Free, Fast, Reliable)
MODEL = "meta-llama/llama-3.2-3b-instruct:free"

def ask_vogue(context):
    system_prompt = """
    You are VOGUE, the Creative Director.
    Focus: Aesthetics, Trends, Color Palettes.
    Output: 3 bullet points on visual direction.
    """
    return query_openrouter(MODEL, system_prompt, context)
