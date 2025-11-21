#!/usr/bin/env python3
"""
Test script for Critic Platform Phase 2 - Real-Time Data Integration
Tests the complete workflow: Application -> Approval -> Review Creation -> Publishing
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api/v1"

# Test user credentials
import uuid
TEST_EMAIL = f"critic.phase2.{uuid.uuid4().hex[:8]}@example.com"
TEST_PASSWORD = "TestPassword123!"
TEST_USERNAME = f"critic_phase2_{uuid.uuid4().hex[:8]}"

def log(message: str, level: str = "INFO"):
    """Log a message with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] [{level}] {message}")

def test_signup():
    """Test user signup"""
    log("Testing user signup...")
    response = requests.post(
        f"{API_BASE}/auth/signup",
        json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "username": TEST_USERNAME,
            "name": "Test Critic Phase 2",
        }
    )
    
    if response.status_code in [200, 201]:
        data = response.json()
        log(f"✓ Signup successful", "SUCCESS")
        return "1"  # Return a user ID (will be extracted from token)
    else:
        log(f"✗ Signup failed: {response.status_code} - {response.text}", "ERROR")
        return None

def test_login():
    """Test user login"""
    log("Testing user login...")
    response = requests.post(
        f"{API_BASE}/auth/login",
        json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        token = data.get("access_token")
        log(f"✓ Login successful. Token: {token[:20]}...", "SUCCESS")
        return token
    else:
        log(f"✗ Login failed: {response.status_code} - {response.text}", "ERROR")
        return None

def test_activate_critic_role(token: str):
    """Test activating critic role"""
    log("Testing critic role activation...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{API_BASE}/roles/critic/activate",
        headers=headers,
        json={"handle": None}
    )
    
    if response.status_code == 200:
        log("✓ Critic role activated", "SUCCESS")
        return True
    else:
        log(f"✗ Role activation failed: {response.status_code} - {response.text}", "ERROR")
        return False

def test_submit_critic_application(token: str):
    """Test submitting critic application"""
    log("Testing critic application submission...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{API_BASE}/critic-verification",
        headers=headers,
        json={
            "requested_username": TEST_USERNAME,
            "requested_display_name": "Test Critic Phase 2",
            "bio": "This is a test critic profile for Phase 2 testing. I review movies with a focus on cinematography and storytelling.",
            "platform_links": [
                {"platform": "youtube", "url": "https://youtube.com/testcritic"}
            ],
            "sample_review_urls": [
                "https://example.com/review1",
                "https://example.com/review2"
            ]
        }
    )
    
    if response.status_code == 201:
        data = response.json()
        log(f"✓ Application submitted. Status: {data.get('status')}", "SUCCESS")
        return data.get("id")
    else:
        log(f"✗ Application submission failed: {response.status_code} - {response.text}", "ERROR")
        return None

def test_get_application_status(token: str):
    """Test getting application status"""
    log("Testing get application status...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        f"{API_BASE}/critic-verification/my-application",
        headers=headers
    )
    
    if response.status_code == 200:
        data = response.json()
        log(f"✓ Application status: {data.get('status')}", "SUCCESS")
        return data
    else:
        log(f"✗ Get status failed: {response.status_code} - {response.text}", "ERROR")
        return None

def test_admin_approve_application(admin_token: str, app_id: str):
    """Test admin approving application"""
    log(f"Testing admin approval of application {app_id}...")
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = requests.put(
        f"{API_BASE}/critic-verification/admin/applications/{app_id}",
        headers=headers,
        json={
            "status": "approved",
            "admin_notes": "Approved for testing"
        }
    )
    
    if response.status_code == 200:
        log("✓ Application approved by admin", "SUCCESS")
        return True
    else:
        log(f"✗ Admin approval failed: {response.status_code} - {response.text}", "ERROR")
        return False

def test_create_review(token: str, movie_id: str):
    """Test creating a critic review"""
    log(f"Testing review creation for movie {movie_id}...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{API_BASE}/critic-reviews",
        headers=headers,
        json={
            "movie_id": int(movie_id),
            "title": "Test Review - Phase 2",
            "content": "This is a comprehensive test review for Phase 2 testing. The movie was absolutely excellent with great cinematography and outstanding direction. The narrative was compelling and the performances were stellar. The cinematography was breathtaking with beautiful color grading and composition. Overall, this is a must-watch film that showcases exceptional filmmaking.",
            "numeric_rating": 8.5,
            "tags": ["test", "phase2", "excellent"],
            "is_draft": False
        }
    )
    
    if response.status_code == 201:
        data = response.json()
        log(f"✓ Review created. ID: {data.get('id')}", "SUCCESS")
        return data.get("id")
    else:
        log(f"✗ Review creation failed: {response.status_code} - {response.text}", "ERROR")
        return None

def test_get_critic_profile(username: str):
    """Test getting critic profile"""
    log(f"Testing get critic profile for {username}...")
    response = requests.get(f"{API_BASE}/critics/{username}")
    
    if response.status_code == 200:
        data = response.json()
        log(f"✓ Critic profile retrieved. Display name: {data.get('display_name')}", "SUCCESS")
        return data
    else:
        log(f"✗ Get profile failed: {response.status_code} - {response.text}", "ERROR")
        return None

def test_get_critic_reviews(username: str):
    """Test getting critic reviews"""
    log(f"Testing get reviews for critic {username}...")
    response = requests.get(f"{API_BASE}/critic-reviews/critic/{username}")
    
    if response.status_code == 200:
        data = response.json()
        reviews = data if isinstance(data, list) else data.get("reviews", [])
        log(f"✓ Retrieved {len(reviews)} reviews", "SUCCESS")
        return reviews
    else:
        log(f"✗ Get reviews failed: {response.status_code} - {response.text}", "ERROR")
        return []

def main():
    """Run all tests"""
    log("=" * 60)
    log("CRITIC PLATFORM PHASE 2 - WORKFLOW TEST")
    log("=" * 60)
    
    # Step 1: Signup
    user_id = test_signup()
    if not user_id:
        log("Signup failed. Exiting.", "ERROR")
        return
    
    time.sleep(1)
    
    # Step 2: Login
    token = test_login()
    if not token:
        log("Login failed. Exiting.", "ERROR")
        return
    
    time.sleep(1)
    
    # Step 3: Activate critic role
    if not test_activate_critic_role(token):
        log("Role activation failed. Exiting.", "ERROR")
        return
    
    time.sleep(1)
    
    # Step 4: Submit application
    app_id = test_submit_critic_application(token)
    if not app_id:
        log("Application submission failed. Exiting.", "ERROR")
        return
    
    time.sleep(1)
    
    # Step 5: Check application status
    app_status = test_get_application_status(token)
    
    time.sleep(1)
    
    # Step 6: Admin login and approve
    log("\nTesting admin approval workflow...")
    admin_token = test_login_admin()
    if admin_token and app_id:
        test_admin_approve_application(admin_token, app_id)
    
    time.sleep(1)
    
    # Step 7: Create review (using movie ID 1 as example)
    review_id = test_create_review(token, "1")
    
    time.sleep(1)
    
    # Step 8: Get critic profile
    test_get_critic_profile(TEST_USERNAME)
    
    time.sleep(1)
    
    # Step 9: Get critic reviews
    test_get_critic_reviews(TEST_USERNAME)
    
    log("\n" + "=" * 60)
    log("WORKFLOW TEST COMPLETED")
    log("=" * 60)

def test_login_admin():
    """Test admin login"""
    log("Testing admin login...")
    response = requests.post(
        f"{API_BASE}/auth/login",
        json={
            "email": "admin@iwm.com",
            "password": "AdminPassword123!",
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        token = data.get("access_token")
        log(f"✓ Admin login successful", "SUCCESS")
        return token
    else:
        log(f"✗ Admin login failed: {response.status_code}", "ERROR")
        return None

if __name__ == "__main__":
    main()

