import requests
import json

BASE_URL = "https://iwm-python.onrender.com"
ORIGIN = "http://localhost:3000"

def check_health():
    print(f"Checking health at {BASE_URL}/api/v1/health...")
    try:
        resp = requests.get(f"{BASE_URL}/api/v1/health", timeout=10)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")

def check_cors():
    print(f"\nChecking CORS for Origin: {ORIGIN}...")
    try:
        resp = requests.options(
            f"{BASE_URL}/api/v1/movies",
            headers={
                "Origin": ORIGIN,
                "Access-Control-Request-Method": "GET"
            },
            timeout=10
        )
        print(f"Status: {resp.status_code}")
        print("Headers:")
        for k, v in resp.headers.items():
            if "access-control" in k.lower():
                print(f"  {k}: {v}")
        
        if resp.headers.get("access-control-allow-origin") == ORIGIN:
            print("✅ CORS Configured Correctly for localhost:3000")
        else:
            print("❌ CORS Header Missing or Incorrect")
    except Exception as e:
        print(f"❌ CORS check failed: {e}")

def check_login():
    print(f"\nChecking Admin Login...")
    try:
        resp = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            data={
                "username": "siddu@moviemadders.com",
                "password": "Bava@123"
            },
            timeout=10
        )
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print("✅ Login Successful")
            print(f"Token: {resp.json().get('access_token')[:20]}...")
        else:
            print(f"❌ Login Failed: {resp.text}")
    except Exception as e:
        print(f"❌ Login check failed: {e}")

if __name__ == "__main__":
    print("="*50)
    print(f"Verifying Backend: {BASE_URL}")
    print("="*50)
    check_health()
    check_cors()
    check_login()
    print("="*50)
