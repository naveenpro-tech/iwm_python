"""
Simplified test script for Critic Hub endpoints
Tests critics and reviews endpoints (skips verification)
"""
import requests

BASE_URL = "http://localhost:8000/api/v1"
TEST_USER_EMAIL = "testcritic@iwm.com"
TEST_USER_PASSWORD = "Test123!@#"
CRITIC_USERNAME = "testcritic_20251023002041"

def print_test(name, success):
    status = "✅" if success else "❌"
    print(f"{status} {name}")

# Login
print("\n=== AUTHENTICATION ===")
response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD}
)
if response.status_code != 200:
    print(f"❌ Login failed: {response.text}")
    exit(1)

token = response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print_test("Login", True)

# Test Critic Endpoints
print("\n=== CRITIC ENDPOINTS ===")

# List critics
response = requests.get(f"{BASE_URL}/critics")
print_test(f"List critics ({response.status_code})", response.status_code == 200)

# Search critics
response = requests.get(f"{BASE_URL}/critics/search?q=test")
print_test(f"Search critics ({response.status_code})", response.status_code == 200)

# Get critic by username
response = requests.get(f"{BASE_URL}/critics/{CRITIC_USERNAME}")
print_test(f"Get critic by username ({response.status_code})", response.status_code == 200)

# Update critic profile
response = requests.put(
    f"{BASE_URL}/critics/{CRITIC_USERNAME}",
    headers=headers,
    json={"bio": "Updated bio for testing"}
)
print_test(f"Update critic profile ({response.status_code})", response.status_code == 200)

# Get followers
response = requests.get(f"{BASE_URL}/critics/{CRITIC_USERNAME}/followers")
print_test(f"Get followers ({response.status_code})", response.status_code == 200)

# Test Critic Review Endpoints
print("\n=== CRITIC REVIEW ENDPOINTS ===")

# Create review
review_data = {
    "movie_id": 1,
    "content": "This is an excellent film that showcases masterful cinematography and compelling storytelling. The director's vision is clear throughout, and the performances are outstanding. I particularly enjoyed the way the film explores themes of redemption and hope.",
    "rating_type": "letter",
    "rating_value": "A+",
    "numeric_rating": 9.5,
    "title": "A Masterpiece of Modern Cinema",
    "is_draft": False
}

response = requests.post(
    f"{BASE_URL}/critic-reviews",
    headers=headers,
    json=review_data
)
print_test(f"Create review ({response.status_code})", response.status_code == 201)
if response.status_code != 201:
    print(f"   Error: {response.text[:200]}")

if response.status_code == 201:
    review_id = response.json()["external_id"]
    print(f"   Review ID: {review_id}")
    
    # Get review
    response = requests.get(f"{BASE_URL}/critic-reviews/{review_id}")
    print_test(f"Get review ({response.status_code})", response.status_code == 200)
    
    # List reviews by critic
    response = requests.get(f"{BASE_URL}/critic-reviews/critic/{CRITIC_USERNAME}")
    print_test(f"List reviews by critic ({response.status_code})", response.status_code == 200)
    
    # List reviews by movie
    response = requests.get(f"{BASE_URL}/critic-reviews/movie/1")
    print_test(f"List reviews by movie ({response.status_code})", response.status_code == 200)
    
    # Like review
    response = requests.post(f"{BASE_URL}/critic-reviews/{review_id}/like", headers=headers)
    print_test(f"Like review ({response.status_code})", response.status_code == 200)
    
    # Unlike review
    response = requests.delete(f"{BASE_URL}/critic-reviews/{review_id}/like", headers=headers)
    print_test(f"Unlike review ({response.status_code})", response.status_code == 200)
    
    # Add comment
    response = requests.post(
        f"{BASE_URL}/critic-reviews/{review_id}/comments",
        headers=headers,
        json={"content": "Great review! I totally agree."}
    )
    print_test(f"Add comment ({response.status_code})", response.status_code == 201)
    
    # Get comments
    response = requests.get(f"{BASE_URL}/critic-reviews/{review_id}/comments")
    print_test(f"Get comments ({response.status_code})", response.status_code == 200)
    
    # Update review
    response = requests.put(
        f"{BASE_URL}/critic-reviews/{review_id}",
        headers=headers,
        json={"title": "Updated: A Masterpiece"}
    )
    print_test(f"Update review ({response.status_code})", response.status_code == 200)

print("\n🎉 All tests completed!\n")

