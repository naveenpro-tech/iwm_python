import requests
import time

API_BASE = 'http://127.0.0.1:8000'

# Create admin user
admin_user = {
    'email': 'admin@iwm.com',
    'password': 'AdminPassword123!',
    'name': 'IWM Admin'
}

print('🔐 Creating admin user account...')
print(f'📧 Email: {admin_user["email"]}')
print(f'🔑 Password: {admin_user["password"]}')
print()

response = requests.post(
    f'{API_BASE}/api/v1/auth/signup',
    json=admin_user,
    headers={'Content-Type': 'application/json'}
)

if response.status_code == 200:
    print('✅ Admin user created successfully!')
    data = response.json()
    print(f'🔑 Access Token: {data["access_token"][:50]}...')
    print()
    print('⚠️  IMPORTANT: User created but NOT yet promoted to admin role.')
    print('📝 Next step: Manually update database to add ADMIN role.')
elif response.status_code == 400:
    print('⚠️  User already exists. Attempting login...')
    login_response = requests.post(
        f'{API_BASE}/api/v1/auth/login',
        json={'email': admin_user['email'], 'password': admin_user['password']},
        headers={'Content-Type': 'application/json'}
    )
    if login_response.status_code == 200:
        print('✅ Login successful!')
        data = login_response.json()
        print(f'🔑 Access Token: {data["access_token"][:50]}...')
    else:
        print(f'❌ Login failed: {login_response.status_code}')
        print(login_response.text)
else:
    print(f'❌ Signup failed: {response.status_code}')
    print(response.text)

