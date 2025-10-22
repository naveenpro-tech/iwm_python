"""Create a test user for Critic Hub testing"""
import requests

BASE_URL = "http://localhost:8000/api/v1"

# Create test user
response = requests.post(
    f"{BASE_URL}/auth/signup",
    json={
        "email": "testcritic@iwm.com",
        "password": "Test123!@#",
        "name": "Test Critic User"
    }
)

if response.status_code == 200:
    print("✅ Test user created successfully!")
    print(f"   Email: testcritic@iwm.com")
    print(f"   Password: Test123!@#")
    print(f"   Token: {response.json()['access_token'][:50]}...")
elif response.status_code == 400 and "already registered" in response.text:
    print("✅ Test user already exists!")
    print(f"   Email: testcritic@iwm.com")
    print(f"   Password: Test123!@#")
else:
    print(f"❌ Failed to create user: {response.status_code}")
    print(f"   Response: {response.text}")

