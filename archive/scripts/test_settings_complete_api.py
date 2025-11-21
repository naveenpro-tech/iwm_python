#!/usr/bin/env python3
"""
Complete Settings API Test Suite
Tests all settings endpoints with real data
"""

import os
import sys
import json
import requests
from typing import Dict, Any

# Configuration
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
# Ensure BASE_URL points to backend, not frontend
if "3000" in BASE_URL or "3001" in BASE_URL:
    BASE_URL = "http://localhost:8000"

TEST_USER_EMAIL = "user1@iwm.com"
TEST_USER_PASSWORD = "rmrnn0077"

# Test data
PROFILE_DATA = {
    "username": "user1",
    "fullName": "John Doe",
    "bio": "Movie enthusiast and reviewer",
    "avatarUrl": "https://example.com/avatar.jpg"
}

ACCOUNT_DATA = {
    "name": "John Doe",
    "email": "user1@iwm.com",
    "phone": "+1-555-0123",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Updated bio"
}

PREFERENCES_DATA = {
    "language": "en",
    "region": "us",
    "hideSpoilers": True,
    "excludedGenres": ["horror"],
    "contentRating": "pg13"
}

DISPLAY_DATA = {
    "theme": "dark",
    "fontSize": "medium",
    "highContrastMode": False,
    "reduceMotion": False
}

PRIVACY_DATA = {
    "profileVisibility": "public",
    "activitySharing": True,
    "messageRequests": "everyone",
    "dataDownloadRequested": False
}

class SettingsAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.token = None
        self.results = []

    def login(self) -> bool:
        """Login and get JWT token"""
        print("\n🔐 Logging in...")
        try:
            response = self.session.post(
                f"{BASE_URL}/api/v1/auth/login",
                json={"email": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD}
            )
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                self.session.headers.update({"Authorization": f"Bearer {self.token}"})
                print(f"✅ Login successful - Token: {self.token[:20]}...")
                return True
            else:
                print(f"❌ Login failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Login error: {e}")
            return False

    def test_endpoint(self, method: str, endpoint: str, data: Dict[str, Any] = None, name: str = "") -> bool:
        """Test a single endpoint"""
        try:
            url = f"{BASE_URL}/api/v1/settings/{endpoint}"
            print(f"\n📝 Testing {name or endpoint}...")
            
            if method == "GET":
                response = self.session.get(url)
            elif method == "PUT":
                response = self.session.put(url, json=data)
            else:
                return False

            success = response.status_code in [200, 201]
            status = "✅" if success else "❌"
            print(f"{status} {method} {endpoint}: {response.status_code}")
            
            if not success:
                print(f"   Response: {response.text[:200]}")
            else:
                print(f"   Response: {json.dumps(response.json(), indent=2)[:200]}...")
            
            self.results.append({
                "endpoint": endpoint,
                "method": method,
                "status": response.status_code,
                "success": success,
                "name": name
            })
            return success
        except Exception as e:
            print(f"❌ Error: {e}")
            self.results.append({
                "endpoint": endpoint,
                "method": method,
                "status": 0,
                "success": False,
                "name": name,
                "error": str(e)
            })
            return False

    def run_all_tests(self):
        """Run all settings tests"""
        print("=" * 60)
        print("SETTINGS API COMPLETE TEST SUITE")
        print("=" * 60)

        if not self.login():
            print("❌ Cannot proceed without login")
            return

        # Test all endpoints
        tests = [
            ("GET", "", None, "Get All Settings"),
            ("GET", "profile", None, "Get Profile Settings"),
            ("PUT", "profile", PROFILE_DATA, "Update Profile Settings"),
            ("GET", "account", None, "Get Account Settings"),
            ("PUT", "account", ACCOUNT_DATA, "Update Account Settings"),
            ("GET", "preferences", None, "Get Preferences"),
            ("PUT", "preferences", PREFERENCES_DATA, "Update Preferences"),
            ("GET", "display", None, "Get Display Settings"),
            ("PUT", "display", DISPLAY_DATA, "Update Display Settings"),
            ("GET", "privacy", None, "Get Privacy Settings"),
            ("PUT", "privacy", PRIVACY_DATA, "Update Privacy Settings"),
        ]

        for method, endpoint, data, name in tests:
            self.test_endpoint(method, endpoint, data, name)

        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.results if r["success"])
        total = len(self.results)
        
        print(f"\n✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        
        print("\nDetailed Results:")
        for result in self.results:
            status = "✅" if result["success"] else "❌"
            print(f"{status} {result['method']:4} {result['endpoint']:20} {result['status']:3} - {result['name']}")

if __name__ == "__main__":
    tester = SettingsAPITester()
    tester.run_all_tests()

