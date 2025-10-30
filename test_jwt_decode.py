#!/usr/bin/env python3
"""
Decode JWT token to see what's in it
"""

import json
import base64

# Token from the test output
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1N"

# The full token from the test (truncated in output, but we can get it from the test)
# Let's just decode the header and payload structure

def decode_jwt_part(part):
    """Decode a JWT part (header or payload)"""
    # Add padding if needed
    padding = 4 - len(part) % 4
    if padding != 4:
        part += "=" * padding
    
    try:
        decoded = base64.urlsafe_b64decode(part)
        return json.loads(decoded)
    except Exception as e:
        return f"Error: {e}"

# Split the token
parts = token.split(".")
if len(parts) >= 2:
    print("JWT Header:")
    print(json.dumps(decode_jwt_part(parts[0]), indent=2))
    print("\nJWT Payload (partial):")
    print(json.dumps(decode_jwt_part(parts[1]), indent=2))
else:
    print("Invalid token format")

print("\n" + "="*80)
print("To see the full token, run the test and capture the full token from the output")
print("="*80)

