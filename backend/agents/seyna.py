# backend/agents/seyna.py
import sys
import json
import os
from dotenv import load_dotenv

# Load environment variables for standalone execution
load_dotenv()

from vogue import ask_vogue
from ledger import ask_ledger
from echo import ask_echo

# Seyna is the only one who talks to the outside world (Node.js)
def main():
    try:
        # 1. Read the Goal from the User
        input_data = sys.stdin.read()
        request = json.loads(input_data)
        goal = request.get('goal')
        
        report = {
            "seyna_status": "Processing Goal: " + goal,
            "team_reports": []
        }

        # 2. Seyna Decides: "Everyone, get to work!" 
        # (In a complex agent, she would choose WHO to call. For now, she calls the full board.)
        
        # Call VOGUE
        vogue_output = ask_vogue(goal)
        report['team_reports'].append({
            "agent": "Vogue",
            "role": "Creative Director",
            "output": vogue_output
        })

        # Call LEDGER
        ledger_output = ask_ledger(goal)
        report['team_reports'].append({
            "agent": "Ledger",
            "role": "CFO",
            "output": ledger_output
        })

        # Call ECHO
        echo_output = ask_echo(goal)
        report['team_reports'].append({
            "agent": "Echo",
            "role": "Marketing Head",
            "output": echo_output
        })

        # 3. Final Output
        print(json.dumps(report))

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)

if __name__ == "__main__":
    main()
