"""
Quick Signup Flow Test
Tests the signup endpoint directly via API
"""

import requests
import json
from datetime import datetime

# API base URL
API_BASE = "http://localhost:8000"

def test_signup():
    """Test user signup"""
    print("🧪 Testing Signup Flow...")
    print("=" * 60)
    
    # Generate unique username
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    test_user = {
        "email": f"test_{timestamp}@example.com",
        "password": "TestPassword123!",
        "name": "Test User"
    }
    
    print(f"\n📝 Creating user: {test_user['name']}")
    print(f"📧 Email: {test_user['email']}")
    
    # Test signup
    try:
        response = requests.post(
            f"{API_BASE}/api/v1/auth/signup",
            json=test_user,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\n📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Signup successful!")
            print(f"👤 User ID: {data.get('id')}")
            print(f"👤 Username: {data.get('username')}")
            print(f"📧 Email: {data.get('email')}")
            print(f"🔑 Access Token: {data.get('access_token')[:50]}..." if data.get('access_token') else "No token")
            
            # Test login with same credentials
            print("\n🔐 Testing Login...")
            login_response = requests.post(
                f"{API_BASE}/api/v1/auth/login",
                json={
                    "email": test_user["email"],
                    "password": test_user["password"]
                },
                headers={"Content-Type": "application/json"}
            )
            
            print(f"📊 Login Status: {login_response.status_code}")
            
            if login_response.status_code == 200:
                login_data = login_response.json()
                print("✅ Login successful!")
                print(f"🔑 Access Token: {login_data.get('access_token')[:50]}...")
                
                # Test /me endpoint
                print("\n👤 Testing /me endpoint...")
                me_response = requests.get(
                    f"{API_BASE}/api/v1/auth/me",
                    headers={"Authorization": f"Bearer {login_data.get('access_token')}"}
                )
                
                print(f"📊 /me Status: {me_response.status_code}")
                
                if me_response.status_code == 200:
                    me_data = me_response.json()
                    print("✅ /me endpoint works!")
                    print(f"👤 Username: {me_data.get('username')}")
                    print(f"📧 Email: {me_data.get('email')}")
                    print(f"🎭 Roles: {len(me_data.get('role_profiles', []))} role(s)")
                else:
                    print(f"❌ /me failed: {me_response.text}")
            else:
                print(f"❌ Login failed: {login_response.text}")
        else:
            print(f"❌ Signup failed!")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    print("\n" + "=" * 60)
    print("✅ Test Complete!")

if __name__ == "__main__":
    test_signup()

