import requests
import sys

url = "https://iwm-python.onrender.com/api/v1/health"
origin = "http://localhost:3000"

print(f"Checking CORS for {url} with Origin: {origin}")

try:
    response = requests.options(
        url,
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
        },
        timeout=30
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
    print("Headers:")
    for k, v in response.headers.items():
        print(f"{k}: {v}")
        
    if response.headers.get("access-control-allow-origin") == origin:
        print("\nSUCCESS: CORS is configured correctly for localhost:3000")
    else:
        print(f"\nFAILURE: Access-Control-Allow-Origin is '{response.headers.get('access-control-allow-origin')}' (Expected: '{origin}')")

except Exception as e:
    print(f"Error: {e}")
