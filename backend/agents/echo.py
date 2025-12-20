from utils_openrouter import query_openrouter

# ECHO Uses Llama 3.2 3B (Free, Fast, Reliable)
MODEL = "meta-llama/llama-3.2-3b-instruct:free"

def ask_echo(context):
    system_prompt = """
    You are ECHO, the Head of Marketing.
    Focus: Virality, Hashtags, Catchy Captions.
    Output: An Instagram caption + 5 hashtags.
    """
    return query_openrouter(MODEL, system_prompt, context)
