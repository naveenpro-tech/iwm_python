"""
Open Admin Dashboard - Automated login and redirect to admin panel
"""
import requests
import webbrowser
import time
import sys

API_BASE = "http://127.0.0.1:8000"
FRONTEND_BASE = "http://localhost:3000"

def main():
    print("=" * 80)
    print("🚀 OPENING ADMIN DASHBOARD")
    print("=" * 80)
    print()
    
    # Admin credentials
    email = "admin@iwm.com"
    password = "AdminPassword123!"
    
    print(f"📧 Admin Email: {email}")
    print(f"🔑 Password: {password}")
    print()
    
    # Step 1: Check if backend is running
    print("📋 STEP 1: Checking backend server...")
    print("-" * 80)
    
    try:
        response = requests.get(f"{API_BASE}/docs", timeout=5)
        if response.status_code == 200:
            print("✅ Backend server is running on http://127.0.0.1:8000")
        else:
            print(f"⚠️  Backend responded with status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is NOT running!")
        print()
        print("Please start the backend server first:")
        print("   cd apps\\backend")
        print("   .venv\\Scripts\\python -m hypercorn src.main:app --reload --bind 127.0.0.1:8000")
        print()
        return False
    except Exception as e:
        print(f"❌ Error checking backend: {e}")
        return False
    
    print()
    time.sleep(1)
    
    # Step 2: Check if frontend is running
    print("📋 STEP 2: Checking frontend server...")
    print("-" * 80)
    
    try:
        response = requests.get(FRONTEND_BASE, timeout=5)
        if response.status_code == 200:
            print("✅ Frontend server is running on http://localhost:3000")
        else:
            print(f"⚠️  Frontend responded with status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Frontend server is NOT running!")
        print()
        print("Please start the frontend server first:")
        print("   bun run dev")
        print()
        return False
    except Exception as e:
        print(f"❌ Error checking frontend: {e}")
        return False
    
    print()
    time.sleep(1)
    
    # Step 3: Login to get access token
    print("📋 STEP 3: Logging in as admin...")
    print("-" * 80)
    
    try:
        login_response = requests.post(
            f'{API_BASE}/api/v1/auth/login',
            json={'email': email, 'password': password},
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if login_response.status_code == 200:
            data = login_response.json()
            access_token = data.get('access_token')
            user_data = data.get('user', {})
            
            print(f"✅ Login successful!")
            print(f"   User: {user_data.get('name', 'Unknown')}")
            print(f"   Email: {user_data.get('email', 'Unknown')}")
            print(f"   Token: {access_token[:50]}..." if access_token else "   Token: None")
            
            # Check if user has admin role
            role_profiles = user_data.get('role_profiles', [])
            has_admin = any(
                rp.get('role_type') == 'admin' and rp.get('enabled')
                for rp in role_profiles
            )
            
            if has_admin:
                print(f"   Admin Role: ✅ ENABLED")
            else:
                print(f"   Admin Role: ❌ NOT ENABLED")
                print()
                print("⚠️  WARNING: User does not have admin role enabled!")
                print("   You may not be able to access the admin dashboard.")
                print()
        else:
            print(f"❌ Login failed with status {login_response.status_code}")
            print(f"   Response: {login_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error during login: {e}")
        return False
    
    print()
    time.sleep(1)
    
    # Step 4: Open browser
    print("📋 STEP 4: Opening admin dashboard in browser...")
    print("-" * 80)
    
    print()
    print("🌐 Opening URLs:")
    print(f"   1. Login Page: {FRONTEND_BASE}/login")
    print(f"   2. Admin Dashboard: {FRONTEND_BASE}/admin")
    print()
    
    # Open login page first
    print("Opening login page in your default browser...")
    webbrowser.open(f"{FRONTEND_BASE}/login")
    
    print()
    print("=" * 80)
    print("✅ BROWSER OPENED!")
    print("=" * 80)
    print()
    print("📝 NEXT STEPS:")
    print()
    print("1. ✅ Browser should open automatically to the login page")
    print()
    print("2. 📧 Enter admin credentials:")
    print(f"   Email: {email}")
    print(f"   Password: {password}")
    print()
    print("3. 🔐 Click 'Sign In' button")
    print()
    print("4. ✅ You should be redirected to /dashboard")
    print()
    print("5. 🎯 Navigate to Admin Dashboard:")
    print(f"   URL: {FRONTEND_BASE}/admin")
    print("   OR click 'Admin Panel' in the navigation menu")
    print()
    print("=" * 80)
    print()
    print("💡 TIPS:")
    print()
    print("   - Use INCOGNITO/PRIVATE browser window to avoid cached sessions")
    print("   - If you see 'Access Denied', verify admin role is enabled")
    print("   - Check browser console (F12) for any errors")
    print("   - Admin dashboard URL: http://localhost:3000/admin")
    print()
    print("=" * 80)
    print()
    
    # Wait a bit then open admin dashboard
    print("⏳ Waiting 3 seconds before opening admin dashboard...")
    time.sleep(3)
    
    print("Opening admin dashboard...")
    webbrowser.open(f"{FRONTEND_BASE}/admin")
    
    print()
    print("✅ DONE!")
    print()
    print("If the admin dashboard doesn't load:")
    print("   1. Make sure you're logged in first")
    print("   2. Check that admin role is enabled")
    print("   3. Try manually navigating to: http://localhost:3000/admin")
    print()
    
    return True


if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n❌ Cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

