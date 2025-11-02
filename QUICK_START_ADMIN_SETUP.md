# 🚀 QUICK START: Admin User Setup & Testing

**Status:** ✅ System restored to working checkpoint  
**Database:** ✅ Fresh schema (70 tables)  
**Code:** ✅ All admin RBAC files present

---

## 📋 **PRE-FLIGHT CHECKLIST**

Before starting, verify:

- ✅ PostgreSQL 18 is running on port 5433
- ✅ Database `iwm` exists with 70 tables
- ✅ Backend virtual environment is activated
- ✅ Frontend dependencies are installed (bun)

---

## 🎯 **STEP-BY-STEP GUIDE**

### **Step 1: Start Backend Server**

```powershell
# Terminal 1: Backend
cd apps\backend
.\.venv\Scripts\python -m hypercorn src.main:app --reload --bind 127.0.0.1:8000
```

**Expected Output:**
```
[INFO] Running on http://127.0.0.1:8000 (CTRL + C to quit)
```

**Verify:** Open http://localhost:8000/docs in browser (should show Swagger UI)

---

### **Step 2: Start Frontend Server**

```powershell
# Terminal 2: Frontend
bun run dev
```

**Expected Output:**
```
▲ Next.js 15.2.4
- Local:        http://localhost:3000
```

**Verify:** Open http://localhost:3000 (should show IWM homepage)

---

### **Step 3: Create Admin User Account**

```powershell
# Terminal 3: Admin Setup
python create_admin_user.py
```

**Expected Output:**
```
🔐 Creating admin user account...
📧 Email: admin@iwm.com
🔑 Password: AdminPassword123!

✅ Admin user created successfully!
🔑 Access Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

⚠️  IMPORTANT: User created but NOT yet promoted to admin role.
📝 Next step: Manually update database to add ADMIN role.
```

**If user already exists:**
```
⚠️  User already exists. Attempting login...
✅ Login successful!
```

---

### **Step 4: Promote User to Admin Role**

```powershell
# Terminal 3: Promote to Admin
cd apps\backend
.\.venv\Scripts\python ..\..\promote_to_admin.py
```

**Expected Output:**
```
🔐 Promoting user 'admin@iwm.com' to ADMIN role...

✅ Found user: IWM Admin (ID: 1, Email: admin@iwm.com)
✅ Successfully promoted user to ADMIN role!
   User ID: 1
   Email: admin@iwm.com
   Name: IWM Admin
   Admin Role: ENABLED

============================================================
✅ ADMIN USER SETUP COMPLETE!
============================================================
📧 Email: admin@iwm.com
🔑 Password: AdminPassword123!

🚀 You can now log in with admin privileges!
🔗 Login URL: http://localhost:3000/login
🔗 Admin Panel: http://localhost:3000/admin
```

---

### **Step 5: Test Admin Login (Incognito Browser)**

1. **Open Incognito/Private Browser Window**
   - Chrome: `Ctrl + Shift + N`
   - Firefox: `Ctrl + Shift + P`
   - Edge: `Ctrl + Shift + N`

2. **Navigate to Login Page**
   ```
   http://localhost:3000/login
   ```

3. **Enter Admin Credentials**
   - Email: `admin@iwm.com`
   - Password: `AdminPassword123!`

4. **Click "Sign In"**

5. **Verify Redirect**
   - Should redirect to: `http://localhost:3000/dashboard`
   - Should see user profile dropdown with "Admin" badge

---

### **Step 6: Access Admin Dashboard**

1. **Navigate to Admin Panel**
   ```
   http://localhost:3000/admin
   ```

2. **Verify Access**
   - ✅ Should load admin dashboard
   - ✅ Should see admin sidebar with menu items
   - ✅ Should NOT redirect to login or dashboard

3. **Test Admin Features**
   - Click "Movies" in sidebar
   - Click "Users" in sidebar
   - Click "Analytics" in sidebar

---

## 🧪 **VERIFICATION TESTS**

### **Test 1: Non-Admin User Cannot Access Admin Panel**

1. **Create Regular User**
   - Open new incognito window
   - Go to http://localhost:3000/signup
   - Create account: `user@test.com` / `Test123!`

2. **Try to Access Admin Panel**
   - Navigate to http://localhost:3000/admin
   - **Expected:** Redirect to `/dashboard?error=admin_access_denied`

3. **Verify Error Message**
   - Should see error: "You don't have permission to access the admin panel"

### **Test 2: JWT Token Contains Admin Role**

1. **Login as Admin**
   - Login with `admin@iwm.com` / `AdminPassword123!`

2. **Open Browser DevTools**
   - Press `F12`
   - Go to "Application" tab (Chrome) or "Storage" tab (Firefox)

3. **Check Cookies**
   - Find `access_token` cookie
   - Copy the value

4. **Decode JWT Token**
   - Go to https://jwt.io
   - Paste token in "Encoded" section
   - **Verify Payload Contains:**
     ```json
     {
       "sub": "1",
       "type": "access",
       "role_profiles": [
         {
           "role_type": "admin",
           "enabled": true
         },
         {
           "role_type": "lover",
           "enabled": true
         }
       ]
     }
     ```

### **Test 3: Backend Admin Endpoint Protection**

1. **Test Without Token**
   ```bash
   curl http://localhost:8000/api/v1/admin/users
   ```
   **Expected:** `401 Unauthorized`

2. **Test With Non-Admin Token**
   - Login as regular user
   - Copy access token
   ```bash
   curl -H "Authorization: Bearer <token>" http://localhost:8000/api/v1/admin/users
   ```
   **Expected:** `403 Forbidden - Admin access required`

3. **Test With Admin Token**
   - Login as admin
   - Copy access token
   ```bash
   curl -H "Authorization: Bearer <token>" http://localhost:8000/api/v1/admin/users
   ```
   **Expected:** `200 OK` with user list

---

## 🔍 **TROUBLESHOOTING**

### **Problem: "User already exists" but can't login**

**Solution:**
```sql
-- Check if user exists
SELECT id, email, name FROM users WHERE email = 'admin@iwm.com';

-- If user exists, reset password
UPDATE users 
SET hashed_password = '$2b$12$...' -- Use bcrypt to hash 'AdminPassword123!'
WHERE email = 'admin@iwm.com';
```

### **Problem: Admin user can't access /admin**

**Solution:**
```bash
# Check if user has admin role
python check_admin_users.py

# If no admin role, promote user
cd apps\backend
.\.venv\Scripts\python ..\..\promote_to_admin.py
```

### **Problem: Middleware redirects admin to dashboard**

**Solution:**
```bash
# Verify middleware.ts has admin routes enabled
# Should have: const adminRoutes: string[] = ["/admin"]
# Should NOT have: /^\/admin/ in publicRoutes

# Check current middleware
git diff middleware.ts
```

### **Problem: JWT token doesn't include role_profiles**

**Solution:**
```bash
# Logout and login again to get fresh token
# Old tokens don't have role_profiles

# Verify auth.py includes role_profiles in token creation
# Check lines 122-136 (signup) and 151-167 (login)
```

---

## 📊 **VERIFICATION CHECKLIST**

After completing all steps, verify:

- ✅ Backend server running on port 8000
- ✅ Frontend server running on port 3000
- ✅ Admin user created (`admin@iwm.com`)
- ✅ Admin user promoted to ADMIN role
- ✅ Admin can login successfully
- ✅ Admin can access `/admin` dashboard
- ✅ Non-admin users CANNOT access `/admin`
- ✅ JWT token includes `role_profiles` array
- ✅ Backend endpoints protected with `require_admin`

---

## 🎉 **SUCCESS CRITERIA**

**System is ready when:**

1. ✅ Admin user can login and access `/admin` dashboard
2. ✅ Regular users are blocked from `/admin` with error message
3. ✅ JWT tokens include `role_profiles` with admin role
4. ✅ Backend admin endpoints return 403 for non-admin users
5. ✅ All admin features are accessible (movies, users, analytics)

---

## 📝 **ADMIN CREDENTIALS**

**Email:** `admin@iwm.com`  
**Password:** `AdminPassword123!`  
**Role:** Admin + Lover  
**Access:** Full admin panel access

---

## 🔐 **SECURITY NOTES**

1. **Change Default Password:**
   - The default password is for testing only
   - Change it in production: http://localhost:3000/settings

2. **Protect Admin Credentials:**
   - Never commit credentials to git
   - Use environment variables in production
   - Enable 2FA for admin accounts (future feature)

3. **Monitor Admin Access:**
   - Check admin activity logs regularly
   - Review user role changes
   - Audit admin actions

---

## 🚀 **NEXT STEPS**

After admin setup is complete:

1. **Create Test Data:**
   - Add sample movies via admin panel
   - Create test users with different roles
   - Add reviews and ratings

2. **Test Movie Creation:**
   - Go to `/admin/movies/import`
   - Use JSON import feature
   - Verify movie appears on `/movies` page

3. **Test User Management:**
   - Go to `/admin/users`
   - View user list
   - Promote/demote user roles

4. **Create Database Backup:**
   ```powershell
   cd "C:\Program Files\PostgreSQL\18\bin"
   .\pg_dump.exe -U postgres -p 5433 -d iwm -F c -f "C:\iwm\v142\backups\iwm_admin_setup_$(Get-Date -Format 'yyyyMMdd_HHmmss').dump"
   ```

---

**Generated:** 2025-10-31  
**Checkpoint:** eecd7d3e08adbf53a19ed438468bee55d0a3e91e  
**Status:** ✅ Ready for Admin Testing

