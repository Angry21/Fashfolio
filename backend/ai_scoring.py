import sys
import json

def calculate_score(user):
    # This is where your AI/ML Logic goes.
    # For now, we simulate a simple heuristic model.
    score = 0
    
    # Feature 1: Role weight (Simulated based on username/email/clerk metadata if we had it)
    # Since our User model might not have 'role', we can use 'isDesigner' or email/username heuristics
    
    # Simple Heuristic: 
    # - Length of username (longer names maybe more thoughtful? just a toy heuristic)
    # - Email domain
    
    username = user.get('username', '')
    if len(username) > 8:
        score += 10
        
    email = user.get('email', '') # Note: User model might not expose email publicly in all queries, but let's assume it does or we use other fields
    
    # Feature 2: Email domain analysis (mock)
    if "gmail" in email:
        score += 5
    elif "edu" in email: # Educational institutions get higher priority
        score += 20
        
    # Feature 3: Activity (Posts/Followers)
    # Providing higher score for active users
    followers = user.get('followers', [])
    if len(followers) > 0:
        score += len(followers) * 2

    # Provide a base score so everyone has something
    score += 50
        
    return score

def main():
    try:
        # 1. Read input from Node.js (stdin)
        input_data = sys.stdin.read()
        if not input_data:
            return

        users = json.loads(input_data)
        
        # 2. Process data
        results = []
        for user in users:
            # Calculate the "AI Score"
            user['ai_score'] = calculate_score(user)
            results.append(user)

        # 3. Print result to stdout (Node reads this)
        print(json.dumps(results))
        
    except Exception as e:
        # Send error to stderr
        print(json.dumps({"error": str(e)}), file=sys.stderr)

if __name__ == "__main__":
    main()
