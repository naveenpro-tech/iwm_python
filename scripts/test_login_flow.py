#!/usr/bin/env python3
"""Test complete login flow"""

import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8000/api/v1"

def test_login_with_existing_user():
    """Test login with user1@iwm.com"""
    print("🔐 Testing login with existing user...")
    
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
            print(f"   Token Type: {result['token_type']}")
            
            # Test /me endpoint
            print("\n🔐 Testing /me endpoint with token...")
            me_req = urllib.request.Request(
                f"{BASE_URL}/auth/me",
                headers={
                    "Authorization": f"Bearer {result['access_token']}"
                },
                method="GET"
            )
            
            with urllib.request.urlopen(me_req, timeout=10) as me_resp:
                me_body = me_resp.read().decode("utf-8")
                me_result = json.loads(me_body)
                
                print("✅ /me endpoint successful!")
                print(f"   User ID: {me_result['id']}")
                print(f"   Email: {me_result['email']}")
                print(f"   Name: {me_result['name']}")
                
            return True
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"❌ Login failed: {e.code}")
        print(f"   Error: {error_body}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_login_with_wrong_password():
    """Test login with wrong password"""
    print("\n🔐 Testing login with wrong password...")
    
    data = json.dumps({
        "email": "user1@iwm.com",
        "password": "wrongpassword"
    }).encode("utf-8")
    
    req = urllib.request.Request(
        f"{BASE_URL}/auth/login",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print("❌ Login should have failed but succeeded!")
            return False
            
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("✅ Login correctly rejected with 401 Unauthorized")
            return True
        else:
            print(f"❌ Unexpected error code: {e.code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_login_with_nonexistent_user():
    """Test login with non-existent user"""
    print("\n🔐 Testing login with non-existent user...")
    
    data = json.dumps({
        "email": "nonexistent@iwm.com",
        "password": "password123"
    }).encode("utf-8")
    
    req = urllib.request.Request(
        f"{BASE_URL}/auth/login",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print("❌ Login should have failed but succeeded!")
            return False
            
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("✅ Login correctly rejected with 401 Unauthorized")
            return True
        else:
            print(f"❌ Unexpected error code: {e.code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("🧪 Testing Complete Login Flow\n")
    print("=" * 60)
    
    all_passed = True
    
    # Test 1: Login with correct credentials
    if not test_login_with_existing_user():
        all_passed = False
    
    # Test 2: Login with wrong password
    if not test_login_with_wrong_password():
        all_passed = False
    
    # Test 3: Login with non-existent user
    if not test_login_with_nonexistent_user():
        all_passed = False
    
    print("\n" + "=" * 60)
    if all_passed:
        print("✅ All login tests passed!")
        print("\n📝 Next steps:")
        print("1. Open http://localhost:3000/login in browser")
        print("2. Login with:")
        print("   - Email: user1@iwm.com")
        print("   - Password: rmrnn0077")
        print("3. Verify redirect to /dashboard")
        print("4. Verify 'Welcome, Test User' message")
    else:
        print("❌ Some tests failed!")

if __name__ == "__main__":
    main()

