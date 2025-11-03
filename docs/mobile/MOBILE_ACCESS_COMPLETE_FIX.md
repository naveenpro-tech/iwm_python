# 🔧 Mobile Network Access - Complete Fix

## ✅ ROOT CAUSE IDENTIFIED

The issue was **NOT** with the backend CORS or network binding. The problem was:

**Frontend API Base URL was hardcoded to `localhost:8000`**

When you accessed the app from your mobile phone at `http://192.168.0.194:3000`, the frontend JavaScript tried to make API calls to `http://localhost:8000` (which is your phone's localhost, not your computer).

---

## 🛠️ FIXES APPLIED

### 1. ✅ Frontend API Configuration Fixed
**File**: `.env.local`

**Before**:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

**After**:
```env
NEXT_PUBLIC_API_BASE_URL=http://192.168.0.194:8000
```

**Impact**: Now when you access from mobile, the frontend will correctly call your computer's backend at `192.168.0.194:8000`

---

### 2. ✅ CORS Origins Updated
**File**: `apps/backend/.env`

**Updated to include**:
- `http://192.168.0.194:3000` (mobile frontend)
- `http://192.168.0.194:8000` (mobile API calls)
- `http://192.168.0.194:5173` (alternative port)

---

### 3. ✅ Backend Network Binding
**Command**: Backend will start with `--bind 0.0.0.0:8000`

This allows the backend to accept connections from any network interface (not just localhost).

---

## 🔥 WINDOWS FIREWALL CONFIGURATION

If you still have issues after restarting servers, you may need to allow Python through Windows Firewall:

### Option 1: Allow Python (Recommended)
```powershell
# Run as Administrator in PowerShell
netsh advfirewall firewall add rule name="Python Backend" dir=in action=allow program="C:\iwm\v142\apps\backend\.venv\Scripts\python.exe" enable=yes
```

### Option 2: Allow Port 8000 (Alternative)
```powershell
# Run as Administrator in PowerShell
netsh advfirewall firewall add rule name="IWM Backend Port 8000" dir=in action=allow protocol=TCP localport=8000
```

### Option 3: Temporarily Disable Firewall (Testing Only)
```powershell
# Run as Administrator - NOT RECOMMENDED FOR PRODUCTION
netsh advfirewall set allprofiles state off
```

**To re-enable firewall**:
```powershell
netsh advfirewall set allprofiles state on
```

---

## 📋 VERIFICATION STEPS

### Step 1: Verify Your Computer's IP
```bash
ipconfig | findstr /i "IPv4"
```
**Expected**: `192.168.0.194` (confirmed ✅)

### Step 2: Start Backend with Network Binding
```bash
cd apps/backend
.\.venv\Scripts\python -m hypercorn src.main:app --reload --bind 0.0.0.0:8000
```

### Step 3: Start Frontend
```bash
bun run dev
```

### Step 4: Test Backend from Computer
Open browser on your computer:
```
http://192.168.0.194:8000/api/v1/health
```
**Expected**: `{"ok": true}`

### Step 5: Test Frontend from Computer
```
http://192.168.0.194:3000
```
**Expected**: App loads

### Step 6: Test from Mobile Phone
1. Ensure mobile is on same WiFi network
2. Open mobile browser
3. Navigate to: `http://192.168.0.194:3000`
4. **Expected**: App loads AND API calls work (no "Failed to fetch" errors)

---

## 🐛 TROUBLESHOOTING

### Issue: "Failed to fetch" on mobile
**Cause**: Frontend still using localhost
**Fix**: Clear browser cache on mobile or hard refresh (Ctrl+Shift+R)

### Issue: Backend not accessible from network IP
**Cause**: Windows Firewall blocking
**Fix**: Run firewall commands above (Option 1 or 2)

### Issue: CORS errors in browser console
**Cause**: Origin not in CORS_ORIGINS list
**Fix**: Check browser console for the exact origin and add it to `apps/backend/.env`

### Issue: IP address changed
**Cause**: Router assigned new IP via DHCP
**Fix**: 
1. Check new IP: `ipconfig | findstr /i "IPv4"`
2. Update `.env.local` with new IP
3. Update `apps/backend/.env` CORS_ORIGINS with new IP
4. Restart both servers

---

## 🎯 NEXT STEPS

1. **I'm restarting both servers now with the correct configuration**
2. **Test on your mobile phone**
3. **Report any UI bugs you find**
4. **I'll fix them immediately**

---

## 📝 IMPORTANT NOTES

### For Desktop-Only Development
If you want to switch back to desktop-only development (no mobile access):

**Change `.env.local` back to**:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### For Production Deployment
When deploying to production:

1. **Update `.env.local`** to use production domain:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
   ```

2. **Update `apps/backend/.env`** CORS to specific domain only:
   ```env
   CORS_ORIGINS=["https://yourdomain.com"]
   ```

3. **NEVER use `0.0.0.0` binding in production** - use specific IP or domain

---

## ✅ SUMMARY

**What was wrong**: Frontend was calling `localhost:8000` instead of `192.168.0.194:8000`

**What was fixed**: 
- ✅ Frontend API base URL updated to network IP
- ✅ CORS origins include network IP
- ✅ Backend binds to 0.0.0.0 for network access
- ✅ Firewall commands provided

**Status**: Ready to test on mobile! 🚀

