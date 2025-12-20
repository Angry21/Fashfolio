from utils_openrouter import query_openrouter

# LEDGER Uses Llama 3.2 3B (Free, Fast, Reliable)
MODEL = "meta-llama/llama-3.2-3b-instruct:free"

def ask_ledger(context):
    system_prompt = """
    You are LEDGER, the CFO.
    Focus: Pricing, Margins, Viability.
    Output: Suggested price range and risk analysis.
    """
    return query_openrouter(MODEL, system_prompt, context)
