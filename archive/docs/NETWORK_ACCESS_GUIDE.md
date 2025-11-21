# 🌐 Network Access Configuration Guide

## Overview
The IWM application now **automatically detects** the correct backend API URL based on how you access it. No manual configuration needed!

---

## ✅ How It Works

### Automatic Detection
The app uses smart URL detection in `lib/api-config.ts`:

```typescript
export function getApiUrl(): string {
  const hostname = window.location.hostname;
  
  // If accessing via localhost -> use localhost backend
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // If accessing via network IP -> use same IP for backend
  return `http://${hostname}:8000`;
}
```

### Access Scenarios

| Access Method | Frontend URL | Backend URL (Auto-detected) |
|--------------|--------------|----------------------------|
| **Localhost** | `http://localhost:3000` | `http://localhost:8000` |
| **Network IP** | `http://192.168.0.194:3000` | `http://192.168.0.194:8000` |
| **Mobile Device** | `http://192.168.0.194:3000` | `http://192.168.0.194:8000` |

---

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd apps/backend
.\.venv\Scripts\python -m hypercorn src.main:app --reload --bind 0.0.0.0:8000
```

**Important:** Use `0.0.0.0:8000` (not `127.0.0.1:8000`) to allow network access!

### 2. Start Frontend Server
```bash
bun run dev
```

Frontend automatically binds to both localhost and network IP.

### 3. Access the App

**From Desktop (Same Machine):**
- Open: `http://localhost:3000`
- Backend auto-detected: `http://localhost:8000`

**From Mobile/Other Device (Same Network):**
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Open: `http://192.168.0.194:3000` (replace with your IP)
- Backend auto-detected: `http://192.168.0.194:8000`

---

## 🔧 Manual Override (Optional)

If you need to manually set the backend URL, edit `.env.local`:

```env
# Uncomment and set your custom backend URL
NEXT_PUBLIC_API_URL=http://192.168.0.194:8000
```

Then restart the frontend server:
```bash
# Kill frontend
taskkill /F /IM node.exe

# Restart
bun run dev
```

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" or "Connection refused"

**Check Backend Binding:**
```bash
# ❌ Wrong (localhost only)
hypercorn src.main:app --bind 127.0.0.1:8000

# ✅ Correct (network accessible)
hypercorn src.main:app --bind 0.0.0.0:8000
```

**Verify Backend is Running:**
```bash
# From desktop
curl http://localhost:8000/health

# From network
curl http://192.168.0.194:8000/health
```

### Issue: Mobile can't access

**Check Firewall:**
- Windows: Allow Python/Hypercorn through Windows Firewall
- Mac: System Preferences → Security & Privacy → Firewall
- Linux: `sudo ufw allow 8000`

**Check Network:**
- Ensure mobile device is on the same WiFi network
- Some corporate/public WiFi networks block device-to-device communication

### Issue: Wrong API URL detected

**Check Browser Console:**
```javascript
// Open DevTools (F12) → Console
console.log(window.location.hostname)
// Should show: "localhost" or "192.168.0.194"
```

**Force Refresh:**
- Clear browser cache: Ctrl+Shift+Delete
- Hard refresh: Ctrl+Shift+R
- Or use Incognito/Private mode

---

## 📝 When Traveling / Changing Networks

### Your IP Address Changes
When you connect to a different WiFi network, your local IP address will change.

**Example:**
- Home WiFi: `192.168.0.194`
- Office WiFi: `10.0.1.50`
- Coffee Shop: `172.16.0.100`

**No Action Needed!** The app automatically detects the new IP.

### Steps:
1. Find your new IP address:
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

2. Restart backend with network binding:
   ```bash
   cd apps/backend
   .\.venv\Scripts\python -m hypercorn src.main:app --reload --bind 0.0.0.0:8000
   ```

3. Access from mobile using new IP:
   ```
   http://<new-ip>:3000
   ```

---

## 🔐 Security Note

**Development Mode:**
- Backend binds to `0.0.0.0:8000` (accessible from network)
- This is **safe for local development** on trusted networks

**Production Mode:**
- Use proper firewall rules
- Use HTTPS with SSL certificates
- Restrict access to specific IPs
- Use environment-based configuration

---

## 📚 Technical Details

### Files Modified
1. **`lib/api-config.ts`** - Smart URL detection
2. **`hooks/use-feature-flags.ts`** - Uses `getApiUrl()`
3. **`components/admin/system/feature-management.tsx`** - Uses `getApiUrl()`
4. **`.env.local`** - Removed hardcoded URL

### How to Update Other Components
If you add new API calls, use the smart config:

```typescript
import { getApiUrl } from '@/lib/api-config'

// In your component
const apiUrl = getApiUrl()
const response = await fetch(`${apiUrl}/api/v1/your-endpoint`)
```

**Don't use:**
```typescript
// ❌ Don't do this
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/endpoint`)
```

---

## ✅ Summary

**What Changed:**
- ✅ App now auto-detects backend URL based on access method
- ✅ Works on localhost AND network IP without configuration
- ✅ No need to manually update `.env.local` when changing networks
- ✅ Mobile devices can access using your network IP

**What You Need to Do:**
1. Start backend with `--bind 0.0.0.0:8000`
2. Access app via localhost or network IP
3. Everything else is automatic!

**When Traveling:**
- Just find your new IP address
- Restart servers
- Access using new IP
- No configuration changes needed!

---

**Last Updated:** 2025-11-03  
**Version:** 1.0.0

