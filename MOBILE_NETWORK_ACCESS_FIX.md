# 🔧 Mobile Network Access Fix - Complete Guide

## Problem Summary
- ✅ Frontend loads on mobile (`http://192.168.0.194:3000`)
- ❌ Backend API calls fail with "Failed to fetch" errors
- **Root Cause**: Backend bound to `127.0.0.1` (localhost only) and CORS not configured for mobile IP

---

## ✅ FIXES APPLIED

### 1. CORS Configuration Updated
**File**: `apps/backend/src/config.py` (Line 15-20)

**Before**:
```python
cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000", "http://localhost:5173"])
```

**After**:
```python
cors_origins: list[str] = Field(default_factory=lambda: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://192.168.0.194:3000",  # Mobile access on local network
    "http://192.168.0.194:5173",  # Alternative port for mobile
])
```

**Impact**: Backend now accepts API requests from your mobile phone's frontend

---

### 2. Backend Binding Address (CRITICAL)

**Current Issue**: You're probably running backend with:
```bash
hypercorn src.main:app --reload --bind 127.0.0.1:8000
```

**Problem**: `127.0.0.1` only accepts connections from the same machine (localhost)

**Solution**: Change binding to `0.0.0.0` to accept connections from any network interface:
```bash
hypercorn src.main:app --reload --bind 0.0.0.0:8000
```

**What `0.0.0.0` means**:
- Binds to ALL network interfaces on your computer
- Accepts connections from:
  - `localhost` (127.0.0.1)
  - Your local network IP (192.168.0.194)
  - Any other network interface

---

## 🚀 HOW TO RESTART BACKEND WITH CORRECT BINDING

### Step 1: Kill Current Backend Process
```bash
# Windows PowerShell
taskkill /F /IM python.exe 2>nul
```

### Step 2: Start Backend with Network Binding
```bash
cd apps/backend
.\.venv\Scripts\python -m hypercorn src.main:app --reload --bind 0.0.0.0:8000
```

### Step 3: Verify Backend is Accessible
**From your computer**:
```bash
curl http://localhost:8000/api/v1/health
curl http://192.168.0.194:8000/api/v1/health
```

**From your mobile phone browser**:
```
http://192.168.0.194:8000/api/v1/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-03T..."
}
```

---

## 📱 TESTING ON MOBILE

### Step 1: Ensure Both Servers Are Running

**Backend** (Terminal 1):
```bash
cd apps/backend
.\.venv\Scripts\python -m hypercorn src.main:app --reload --bind 0.0.0.0:8000
```

**Frontend** (Terminal 2):
```bash
bun run dev
```

### Step 2: Access from Mobile Phone

**Frontend URL**:
```
http://192.168.0.194:3000
```

**What to Test**:
1. Open the app on mobile
2. Try to login/signup
3. Browse movies
4. Check if API calls work (no "Failed to fetch" errors)
4. Open browser console (if possible) to check for errors

---

## 🔍 TROUBLESHOOTING

### Issue 1: "Failed to fetch" still appears on mobile

**Check 1**: Is backend bound to `0.0.0.0`?
```bash
# Check running processes
netstat -ano | findstr :8000
```

**Check 2**: Is Windows Firewall blocking port 8000?
```bash
# Add firewall rule (run as Administrator)
netsh advfirewall firewall add rule name="IWM Backend" dir=in action=allow protocol=TCP localport=8000
```

**Check 3**: Is your mobile phone on the same WiFi network?
- Both devices must be on the same network
- Check your computer's IP: `ipconfig` (look for IPv4 Address)
- Use that IP on mobile

---

### Issue 2: CORS errors in browser console

**Symptom**: Console shows "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**: Backend CORS is already configured. Make sure:
1. Backend is running with the updated `config.py`
2. You restarted the backend after the config change
3. Mobile is accessing `http://192.168.0.194:3000` (not localhost)

---

### Issue 3: Backend not accessible from mobile

**Check 1**: Verify your computer's IP address
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (e.g., `192.168.0.194`)

**Check 2**: Test from your computer first
```bash
curl http://192.168.0.194:8000/api/v1/health
```

**Check 3**: Disable Windows Firewall temporarily to test
```bash
# Run as Administrator
netsh advfirewall set allprofiles state off
```

**After testing, re-enable firewall**:
```bash
netsh advfirewall set allprofiles state on
```

---

## 🔐 SECURITY CONSIDERATIONS

### Development vs Production

**Current Setup (Development)**:
- ✅ Binding to `0.0.0.0` is fine for local network testing
- ✅ CORS allows specific origins (your mobile IP)
- ⚠️ Anyone on your WiFi can access the backend

**For Production Deployment**:
- ❌ Don't bind to `0.0.0.0` on public servers
- ✅ Use reverse proxy (Nginx, Caddy)
- ✅ Use HTTPS with SSL certificates
- ✅ Restrict CORS to production domain only
- ✅ Use environment variables for configuration

---

## 📋 QUICK REFERENCE

### Backend Start Command (Network Access)
```bash
cd apps/backend
.\.venv\Scripts\python -m hypercorn src.main:app --reload --bind 0.0.0.0:8000
```

### Frontend Start Command
```bash
bun run dev
```

### Mobile Access URLs
- **Frontend**: `http://192.168.0.194:3000`
- **Backend API**: `http://192.168.0.194:8000/api/v1/`
- **Health Check**: `http://192.168.0.194:8000/api/v1/health`

### Kill All Servers
```bash
taskkill /F /IM python.exe 2>nul & taskkill /F /IM node.exe 2>nul
```

---

## ✅ VERIFICATION CHECKLIST

Before testing on mobile, verify:

- [ ] Backend config updated with mobile IP in CORS origins
- [ ] Backend restarted with `--bind 0.0.0.0:8000`
- [ ] Backend health check works from computer: `http://192.168.0.194:8000/api/v1/health`
- [ ] Frontend is running on `http://192.168.0.194:3000`
- [ ] Mobile phone is on the same WiFi network
- [ ] Windows Firewall allows port 8000 (or temporarily disabled)
- [ ] Mobile can access frontend: `http://192.168.0.194:3000`
- [ ] Mobile can access backend health check: `http://192.168.0.194:8000/api/v1/health`

---

## 🎯 NEXT STEPS

1. **Restart backend** with network binding (`0.0.0.0:8000`)
2. **Test from mobile** - Try to login and browse movies
3. **Report mobile UI bugs** - Tell me what doesn't work or looks broken
4. **I'll fix the bugs** - Quick fixes for mobile responsiveness
5. **Commit and push** - Save all changes to git
6. **Prepare for production** - Deployment checklist

---

**Status**: ✅ Configuration Fixed  
**Next Action**: Restart backend with `--bind 0.0.0.0:8000`  
**Test URL**: `http://192.168.0.194:3000` (from mobile)

