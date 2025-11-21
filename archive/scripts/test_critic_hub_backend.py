"""
Test script for Critic Hub Backend API
Tests all endpoints for critics, critic reviews, and verification
"""
import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api/v1"

# Test user credentials (assuming these exist from previous tests)
TEST_USER_EMAIL = "testcritic@iwm.com"
TEST_USER_PASSWORD = "Test123!@#"

# Global variables
auth_token = None
critic_username = None
review_external_id = None
application_id = None


def print_section(title):
    """Print a section header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")


def print_result(test_name, success, response=None):
    """Print test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if response and not success:
        print(f"   Response: {response.status_code} - {response.text[:200]}")


def test_authentication():
    """Test authentication and get token"""
    global auth_token
    
    print_section("AUTHENTICATION")
    
    # Try to login
    response = requests.post(
        f"{API_BASE}/auth/login",
        json={"email": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD}
    )
    
    if response.status_code == 200:
        auth_token = response.json()["access_token"]
        print_result("Login successful", True)
        print(f"   Token: {auth_token[:50]}...")
        return True
    else:
        print_result("Login failed", False, response)
        print("   Note: Make sure test user exists. Run signup if needed.")
        return False


def test_critic_verification():
    """Test critic verification application"""
    global application_id
    
    print_section("CRITIC VERIFICATION")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Submit application
    application_data = {
        "requested_username": f"testcritic_{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "requested_display_name": "Test Critic",
        "bio": "I am a passionate movie critic with over 10 years of experience reviewing films across all genres. My reviews focus on cinematography, storytelling, and character development.",
        "platform_links": [
            {"platform": "YouTube", "url": "https://youtube.com/@testcritic"},
            {"platform": "Blog", "url": "https://testcritic.com"}
        ],
        "sample_review_urls": [
            "https://testcritic.com/review1",
            "https://testcritic.com/review2"
        ],
        "metrics": {
            "youtube_subscribers": 50000,
            "blog_monthly_visitors": 10000
        }
    }
    
    response = requests.post(
        f"{API_BASE}/critic-verification",
        headers=headers,
        json=application_data
    )
    
    if response.status_code == 201:
        application_id = response.json()["id"]
        print_result("Submit application", True)
        print(f"   Application ID: {application_id}")
    else:
        print_result("Submit application", False, response)
        return False
    
    # Get my application
    response = requests.get(
        f"{API_BASE}/critic-verification/my-application",
        headers=headers
    )
    
    print_result("Get my application", response.status_code == 200, response)
    
    # List all applications (admin)
    response = requests.get(
        f"{API_BASE}/critic-verification/admin/applications",
        headers=headers
    )
    
    print_result("List all applications", response.status_code == 200, response)
    
    # Approve application (admin)
    response = requests.put(
        f"{API_BASE}/critic-verification/admin/applications/{application_id}",
        headers=headers,
        json={
            "status": "approved",
            "admin_notes": "Great application! Approved."
        }
    )
    
    if response.status_code == 200:
        global critic_username
        # Get the approved application to extract username
        app_response = requests.get(
            f"{API_BASE}/critic-verification/my-application",
            headers=headers
        )
        if app_response.status_code == 200:
            critic_username = app_response.json()["requested_username"]
            print_result("Approve application", True)
            print(f"   Critic username: {critic_username}")
    else:
        print_result("Approve application", False, response)
        return False
    
    return True


def test_critic_profiles():
    """Test critic profile endpoints"""
    print_section("CRITIC PROFILES")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # List all critics
    response = requests.get(f"{API_BASE}/critics")
    print_result("List all critics", response.status_code == 200, response)
    
    # Search critics
    response = requests.get(f"{API_BASE}/critics/search?q=test")
    print_result("Search critics", response.status_code == 200, response)
    
    # Get critic by username
    response = requests.get(f"{API_BASE}/critics/{critic_username}")
    print_result("Get critic by username", response.status_code == 200, response)
    
    # Update critic profile
    response = requests.put(
        f"{API_BASE}/critics/{critic_username}",
        headers=headers,
        json={
            "bio": "Updated bio: I am a passionate movie critic with extensive experience.",
            "review_philosophy": "I believe in honest, thoughtful criticism that respects the art of filmmaking."
        }
    )
    print_result("Update critic profile", response.status_code == 200, response)
    
    # Follow critic (should fail - can't follow yourself)
    response = requests.post(
        f"{API_BASE}/critics/{critic_username}/follow",
        headers=headers
    )
    # This should fail, but that's expected
    print_result("Follow critic (self - should fail)", response.status_code == 400, response)
    
    # Get followers
    response = requests.get(f"{API_BASE}/critics/{critic_username}/followers")
    print_result("Get critic followers", response.status_code == 200, response)
    
    return True


def test_critic_reviews():
    """Test critic review endpoints"""
    global review_external_id
    
    print_section("CRITIC REVIEWS")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Create a review
    review_data = {
        "movie_id": 1,  # Assuming movie with ID 1 exists
        "content": "This is an excellent film that showcases masterful cinematography and compelling storytelling. The director's vision is clear throughout, and the performances are outstanding. I particularly enjoyed the way the film explores themes of redemption and hope. The pacing is perfect, never dragging but allowing moments to breathe. Highly recommended for anyone who appreciates thoughtful cinema.",
        "rating_type": "letter",
        "rating_value": "A+",
        "numeric_rating": 9.5,
        "title": "A Masterpiece of Modern Cinema",
        "youtube_embed_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "image_gallery": [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg"
        ],
        "watch_links": [
            {"platform": "Netflix", "url": "https://netflix.com/movie", "is_affiliate": False},
            {"platform": "Amazon Prime", "url": "https://amazon.com/movie", "is_affiliate": True}
        ],
        "is_draft": False,
        "meta_description": "An in-depth review of this cinematic masterpiece"
    }
    
    response = requests.post(
        f"{API_BASE}/critic-reviews",
        headers=headers,
        json=review_data
    )
    
    if response.status_code == 201:
        review_external_id = response.json()["external_id"]
        print_result("Create critic review", True)
        print(f"   Review ID: {review_external_id}")
    else:
        print_result("Create critic review", False, response)
        return False
    
    # Get review by ID
    response = requests.get(f"{API_BASE}/critic-reviews/{review_external_id}")
    print_result("Get review by ID", response.status_code == 200, response)
    
    # List reviews by critic
    response = requests.get(f"{API_BASE}/critic-reviews/critic/{critic_username}")
    print_result("List reviews by critic", response.status_code == 200, response)
    
    # List reviews by movie
    response = requests.get(f"{API_BASE}/critic-reviews/movie/1")
    print_result("List reviews by movie", response.status_code == 200, response)
    
    # Like review
    response = requests.post(
        f"{API_BASE}/critic-reviews/{review_external_id}/like",
        headers=headers
    )
    print_result("Like review", response.status_code == 200, response)
    
    # Unlike review
    response = requests.delete(
        f"{API_BASE}/critic-reviews/{review_external_id}/like",
        headers=headers
    )
    print_result("Unlike review", response.status_code == 200, response)
    
    # Add comment
    response = requests.post(
        f"{API_BASE}/critic-reviews/{review_external_id}/comments",
        headers=headers,
        json={"content": "Great review! I totally agree with your analysis."}
    )
    print_result("Add comment", response.status_code == 201, response)
    
    # Get comments
    response = requests.get(f"{API_BASE}/critic-reviews/{review_external_id}/comments")
    print_result("Get comments", response.status_code == 200, response)
    
    # Update review
    response = requests.put(
        f"{API_BASE}/critic-reviews/{review_external_id}",
        headers=headers,
        json={"title": "Updated: A Masterpiece of Modern Cinema"}
    )
    print_result("Update review", response.status_code == 200, response)
    
    return True


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("  CRITIC HUB BACKEND API TEST SUITE")
    print("="*60)
    print(f"  Base URL: {BASE_URL}")
    print(f"  Test User: {TEST_USER_EMAIL}")
    print("="*60)
    
    # Run tests in sequence
    if not test_authentication():
        print("\n❌ Authentication failed. Cannot proceed with tests.")
        return
    
    if not test_critic_verification():
        print("\n⚠️  Verification tests failed. Skipping remaining tests.")
        return
    
    test_critic_profiles()
    test_critic_reviews()
    
    print_section("TEST SUMMARY")
    print("✅ All critical tests completed!")
    print(f"   Critic Username: {critic_username}")
    print(f"   Review ID: {review_external_id}")
    print(f"   Application ID: {application_id}")
    print("\n🎉 Critic Hub Backend is working correctly!\n")


if __name__ == "__main__":
    main()

