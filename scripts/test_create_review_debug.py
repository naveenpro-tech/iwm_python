"""Debug script to test review creation"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

# Login
response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "testcritic@iwm.com", "password": "Test123!@#"}
)

if response.status_code != 200:
    print(f"Login failed: {response.text}")
    exit(1)

token = response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Create review
review_data = {
    "movie_id": 1,
    "content": "This is an excellent film that showcases masterful cinematography and compelling storytelling. The director's vision is clear throughout, and the performances are outstanding.",
    "rating_type": "letter",
    "rating_value": "A+",
    "numeric_rating": 9.5,
    "title": "A Masterpiece",
    "is_draft": False
}

print("Sending request...")
print(f"URL: {BASE_URL}/critic-reviews")
print(f"Headers: {headers}")
print(f"Data: {json.dumps(review_data, indent=2)}")

response = requests.post(
    f"{BASE_URL}/critic-reviews",
    headers=headers,
    json=review_data
)

print(f"\nResponse Status: {response.status_code}")
print(f"Response Headers: {dict(response.headers)}")
print(f"Response Body: {response.text}")

if response.status_code == 201:
    print("\n✅ Review created successfully!")
    print(f"Review ID: {response.json()['external_id']}")
else:
    print("\n❌ Review creation failed!")

