# 🔥 Windows Firewall Configuration for Mobile Access

## ⚠️ IMPORTANT: Run PowerShell as Administrator

Right-click PowerShell → "Run as Administrator"

---

## ✅ RECOMMENDED: Allow Python Backend (Option 1)

This allows the specific Python executable to accept incoming connections:

```powershell
netsh advfirewall firewall add rule name="IWM Python Backend" dir=in action=allow program="C:\iwm\v142\apps\backend\.venv\Scripts\python.exe" enable=yes
```

**Verify the rule was added**:
```powershell
netsh advfirewall firewall show rule name="IWM Python Backend"
```

---

## 🔧 ALTERNATIVE: Allow Port 8000 (Option 2)

This allows any program to use port 8000:

```powershell
netsh advfirewall firewall add rule name="IWM Backend Port 8000" dir=in action=allow protocol=TCP localport=8000
```

**Verify the rule was added**:
```powershell
netsh advfirewall firewall show rule name="IWM Backend Port 8000"
```

---

## 🧪 TESTING ONLY: Temporarily Disable Firewall (Option 3)

**⚠️ NOT RECOMMENDED - Use only for quick testing**

```powershell
# Disable firewall
netsh advfirewall set allprofiles state off
```

**Re-enable firewall after testing**:
```powershell
netsh advfirewall set allprofiles state on
```

---

## 🗑️ Remove Firewall Rules (If Needed)

If you need to remove the rules later:

```powershell
# Remove Python backend rule
netsh advfirewall firewall delete rule name="IWM Python Backend"

# Remove port 8000 rule
netsh advfirewall firewall delete rule name="IWM Backend Port 8000"
```

---

## 🔍 Check Current Firewall Status

```powershell
# Check if firewall is enabled
netsh advfirewall show allprofiles

# List all firewall rules
netsh advfirewall firewall show rule name=all

# Check specific port
netsh advfirewall firewall show rule name=all | findstr "8000"
```

---

## 📋 VERIFICATION STEPS

### Step 1: Add Firewall Rule
Run Option 1 or Option 2 above in PowerShell as Administrator

### Step 2: Test from Computer
Open browser on your computer:
```
http://192.168.0.194:8000/api/v1/health
```
**Expected**: `{"ok": true}`

### Step 3: Test from Mobile
1. Ensure mobile is on same WiFi network
2. Open mobile browser
3. Navigate to: `http://192.168.0.194:8000/api/v1/health`
4. **Expected**: `{"ok": true}`

### Step 4: Test Full App from Mobile
Navigate to: `http://192.168.0.194:3000`
**Expected**: App loads AND API calls work (no "Failed to fetch" errors)

---

## 🐛 TROUBLESHOOTING

### Issue: "Access Denied" when running firewall commands
**Solution**: Make sure you're running PowerShell as Administrator

### Issue: Rule added but still can't connect
**Solution**: 
1. Check if firewall is enabled: `netsh advfirewall show allprofiles`
2. Verify rule exists: `netsh advfirewall firewall show rule name="IWM Python Backend"`
3. Try Option 3 (temporarily disable firewall) to confirm it's a firewall issue

### Issue: Mobile still shows "Failed to fetch"
**Solution**: 
1. Clear mobile browser cache
2. Hard refresh (Ctrl+Shift+R on mobile Chrome)
3. Check that both devices are on same WiFi network
4. Verify IP address hasn't changed: `ipconfig | findstr /i "IPv4"`

---

## ✅ CURRENT STATUS

**Servers Running**:
- ✅ Backend: `http://0.0.0.0:8000` (accessible at `http://192.168.0.194:8000`)
- ✅ Frontend: `http://192.168.0.194:3000`

**Configuration**:
- ✅ Frontend API Base URL: `http://192.168.0.194:8000`
- ✅ CORS Origins: Includes `http://192.168.0.194:3000`
- ✅ Backend Health Check: Working ✅

**Next Step**: 
1. **Add firewall rule** (Option 1 recommended)
2. **Test on mobile phone**
3. **Report any UI bugs**

---

## 📝 NOTES

- Firewall rules persist across reboots
- You only need to add the rule once
- For production deployment, use proper firewall configuration with specific IPs
- Never disable firewall in production environments

