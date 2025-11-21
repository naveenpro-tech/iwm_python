#!/usr/bin/env python3
"""Test authentication endpoints"""

import json
import urllib.request
import urllib.error
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_signup():
    """Test signup endpoint"""
    print("🔐 Testing signup...")
    
    data = json.dumps({
        "email": "user1@iwm.com",
        "password": "rmrnn0077",
        "name": "Test User"
    }).encode("utf-8")
    
    req = urllib.request.Request(
        f"{BASE_URL}/auth/signup",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            result = json.loads(body)
            
            print("✅ Signup successful!")
            print(f"   Access Token: {result['access_token'][:50]}...")
            print(f"   Refresh Token: {result['refresh_token'][:50]}...")
            print(f"   Token Type: {result['token_type']}")
            return result['access_token']
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"❌ Signup failed: {e.code}")
        print(f"   Error: {error_body}")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_login():
    """Test login endpoint"""
    print("\n🔐 Testing login...")
    
    data = json.dumps({
        "email": "user1@iwm.com",
        "password": "rmrnn0077"
    }).encode("utf-8")
    
    req = urllib.request.Request(
        f"{BASE_URL}/auth/login",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            result = json.loads(body)
            
            print("✅ Login successful!")
            print(f"   Access Token: {result['access_token'][:50]}...")
            print(f"   Refresh Token: {result['refresh_token'][:50]}...")
            return result['access_token']
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"❌ Login failed: {e.code}")
        print(f"   Error: {error_body}")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_me(access_token):
    """Test /me endpoint"""
    print("\n🔐 Testing /me endpoint...")
    
    req = urllib.request.Request(
        f"{BASE_URL}/auth/me",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        },
        method="GET"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            result = json.loads(body)
            
            print("✅ /me endpoint successful!")
            print(f"   User ID: {result['id']}")
            print(f"   Email: {result['email']}")
            print(f"   Name: {result['name']}")
            return True
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"❌ /me failed: {e.code}")
        print(f"   Error: {error_body}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("🧪 Testing Authentication Flow\n")
    print("=" * 60)
    
    # Test signup
    access_token = test_signup()
    
    # If signup fails (user already exists), try login
    if not access_token:
        print("\n⚠️  Signup failed (user might already exist), trying login...")
        access_token = test_login()
    
    if not access_token:
        print("\n❌ Authentication tests failed!")
        sys.exit(1)
    
    # Test /me endpoint
    if not test_me(access_token):
        print("\n❌ /me endpoint test failed!")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("✅ All authentication tests passed!")
    print("\nYou can now test from the browser:")
    print("1. Open http://localhost:3000/signup")
    print("2. Create account with:")
    print("   - Email: user1@iwm.com")
    print("   - Password: rmrnn0077")
    print("   - Name: Test User")

if __name__ == "__main__":
    main()

