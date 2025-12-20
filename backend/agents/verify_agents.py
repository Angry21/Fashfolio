import os
import sys
import importlib.util
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_modules():
    print("Checking required modules...")
    required_modules = ['openai', 'requests', 'dotenv']
    missing_modules = []
    
    for module in required_modules:
        if importlib.util.find_spec(module) is None:
            missing_modules.append(module)
            print(f"❌ Missing module: {module}")
        else:
            print(f"✅ Found module: {module}")
            
    if missing_modules:
        print(f"CRITICAL: Missing modules: {', '.join(missing_modules)}")
        print("Please run: pip install -r requirements.txt")
        return False
    return True

def check_env():
    print("\nChecking environment variables...")
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("❌ OPENROUTER_API_KEY is missing in .env")
        return False
    
    # Mask key for display
    masked_key = f"{api_key[:8]}...{api_key[-4:]}" if len(api_key) > 12 else "***"
    print(f"✅ Found OPENROUTER_API_KEY: {masked_key}")
    return True

def check_connectivity():
    print("\nChecking OpenRouter Connectivity (with Fallback)...")
    try:
        # Import the util we just patched
        from utils_openrouter import query_openrouter
        
        # Use a model that might be rate limited to test fallback
        model = "meta-llama/llama-3.2-3b-instruct:free"
        print(f"Pinging with intended model: {model}...")
        
        response = query_openrouter(model, "System", "Ping")
        
        if "Error:" in response or "failed" in response.lower():
             print(f"❌ Connectivity Failed: {response}")
             return False
             
        print(f"✅ Connection Successful. Response: {response}")
        return True
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
        return False

def check_agents():
    print("\nChecking Agents Syntax...")
    try:
        import seyna
        import echo
        import ledger
        print("✅ All agents imported successfully (Syntax OK)")
        return True
    except Exception as e:
        print(f"❌ Agent Import Failed: {e}")
        return False

def main():
    print("=== FashFolio Agent Verification ===")
    
    if not check_modules():
        sys.exit(1)
        
    if not check_env():
        sys.exit(1)
        
    if not check_agents():
        sys.exit(1)
        
    if not check_connectivity():
        sys.exit(1)
        
    print("\n🎉 ALL SYSTEMS GO! Agents are ready.")
    sys.exit(0)

if __name__ == "__main__":
    main()
