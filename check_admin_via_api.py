"""
Check admin users via API (works even if database connection is not available directly)
"""
import requests
import json

# First, check if backend is running
try:
    response = requests.get('http://127.0.0.1:8000/api/v1/health', timeout=2)
    print('✅ Backend is running!')
    print(f'Health check: {response.json()}')
except Exception as e:
    print(f'❌ Backend is NOT running: {e}')
    print('Please start the backend server first.')
    print('Run: cd apps/backend; .venv\\Scripts\\activate; hypercorn src.main:app --reload --bind 127.0.0.1:8000')
    exit(1)

# Try to login with the admin account from the report
print('\n' + '='*80)
print('🔐 Attempting to login with admin@iwm.com...')
print('='*80 + '\n')

try:
    login_response = requests.post(
        'http://127.0.0.1:8000/api/v1/auth/login',
        json={
            'email': 'admin@iwm.com',
            'password': 'AdminPassword123!'
        },
        timeout=5
    )
    
    if login_response.status_code == 200:
        data = login_response.json()
        token = data.get('access_token')
        
        print('✅ Login successful!')
        print(f'User ID: {data.get("user_id")}')
        print(f'Email: {data.get("email")}')
        print(f'Token: {token[:50]}...')
        
        # Now check if this user is admin
        print('\n' + '='*80)
        print('👤 Checking user details...')
        print('='*80 + '\n')
        
        me_response = requests.get(
            'http://127.0.0.1:8000/api/v1/auth/me',
            headers={'Authorization': f'Bearer {token}'},
            timeout=5
        )
        
        if me_response.status_code == 200:
            user_data = me_response.json()
            is_admin = user_data.get('is_admin', False)
            
            print(f'Email: {user_data.get("email")}')
            print(f'User ID: {user_data.get("id")}')
            print(f'Admin Status: {"✅ ADMIN" if is_admin else "❌ Regular User"}')
            
            if is_admin:
                print('\n✅ This account HAS admin privileges!')
                print('You can access the admin panel at: http://localhost:3000/admin')
                print('\nTo test admin endpoints, use this token:')
                print(f'Authorization: Bearer {token}')
            else:
                print('\n⚠️  This account does NOT have admin privileges!')
                print('Need to promote this user to admin.')
                print('Run: python promote_to_admin.py')
        else:
            print(f'❌ Failed to get user details: {me_response.status_code}')
            print(me_response.text)
    else:
        print(f'❌ Login failed: {login_response.status_code}')
        print(login_response.text)
        
        if login_response.status_code == 401:
            print('\n⚠️  User exists but password is incorrect, OR user does not exist.')
            print('Try creating the admin user:')
            print('Run: python create_admin_user.py')
        
except Exception as e:
    print(f'❌ Error: {e}')

print('\n' + '='*80 + '\n')

