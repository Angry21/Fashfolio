import sys
import json
from utils_openrouter import query_openrouter
from vogue import ask_vogue
from ledger import ask_ledger
from echo import ask_echo

# SEYNA: Uses Llama 3.2 3B (Free, Fast, Reliable)
MODEL = "meta-llama/llama-3.2-3b-instruct:free"

def main():
    try:
        input_data = sys.stdin.read()
        request = json.loads(input_data)
        goal = request.get('goal')
        
        report = {
            "seyna_status": "Orchestrating Agents via OpenRouter...",
            "team_reports": []
        }

        # 1. Seyna Thinks (Plan)
        system_prompt = "You are SEYNA, the AI Supervisor. Briefly acknowledge the goal and delegate."
        seyna_output = query_openrouter(MODEL, system_prompt, goal)
        report['team_reports'].append({"agent": "Seyna", "role": "Supervisor", "output": seyna_output})
        
        # 2. Call Sub-Agents (Parallel Execution)
        # In a real async app, these would run in parallel. Here we run sequential for simplicity.
        
        report['team_reports'].append({
            "agent": "Vogue", "role": "Creative", "output": ask_vogue(goal)
        })
        
        report['team_reports'].append({
            "agent": "Ledger", "role": "Finance", "output": ask_ledger(goal)
        })

        report['team_reports'].append({
            "agent": "Echo", "role": "Marketing", "output": ask_echo(goal)
        })

        print(json.dumps(report))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
