# 🌍 Environment Configuration Guide

**Status:** ✅ All hardcoded IP addresses removed  
**Last Updated:** November 7, 2025

---

## Overview

Movie Madders now uses **100% environment-driven configuration**. No hardcoded IP addresses or URLs exist in the codebase.

---

## Frontend Configuration

### Environment Variables

**File:** `.env.local` (development) or `.env.production` (production)

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# LAN IP (for network image loading)
NEXT_PUBLIC_LAN_IP=
```

### How It Works

1. **Localhost Access** (default)
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`
   - No configuration needed

2. **Network/LAN Access**
   - Set `NEXT_PUBLIC_LAN_IP` to your computer's IP
   - Example: `NEXT_PUBLIC_LAN_IP=192.168.0.194`
   - Frontend: `http://192.168.0.194:3000`
   - Backend: `http://192.168.0.194:8000`

3. **Production Deployment**
   - Set `NEXT_PUBLIC_API_BASE_URL` to your production API URL
   - Example: `NEXT_PUBLIC_API_BASE_URL=https://api.moviemadders.com`

### Auto-Detection Logic

The `getApiUrl()` function in `lib/api-config.ts` uses this priority:

1. **Localhost Check** - If accessing from `localhost` or `127.0.0.1`, use `http://localhost:8000`
2. **Environment Override** - Use `NEXT_PUBLIC_API_BASE_URL` if set
3. **LAN Fallback** - Derive from current hostname (e.g., `http://192.168.0.194:8000`)
4. **Server-Side Fallback** - Use `http://localhost:8000` for SSR/build

---

## Backend Configuration

### Environment Variables

**File:** `apps/backend/.env` (development) or set in hosting platform

```env
# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# For LAN access, add your IP:
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://192.168.0.194:3000

# For production:
CORS_ORIGINS=https://moviemadders.com,https://www.moviemadders.com
```

### CORS Configuration

The backend accepts CORS requests from origins specified in `CORS_ORIGINS`:

**Format Options:**
- Comma-separated: `http://localhost:3000,http://localhost:5173`
- JSON array: `["http://localhost:3000","http://localhost:5173"]`

**Common Scenarios:**

| Scenario | CORS_ORIGINS |
|----------|--------------|
| Local dev | `http://localhost:3000,http://localhost:5173` |
| Local + mobile | `http://localhost:3000,http://localhost:5173,http://{YOUR_LAN_IP}:3000` |
| Production | `https://moviemadders.com,https://www.moviemadders.com` |

---

## Image Loading Configuration

### Frontend Image Patterns

**File:** `next.config.mjs`

Images are loaded from:
- ✅ All HTTPS domains (`https://**`)
- ✅ Localhost (`http://localhost`)
- ✅ Localhost IP (`http://127.0.0.1`)
- ✅ LAN IP (if `NEXT_PUBLIC_LAN_IP` is set)
- ✅ TMDB (`https://image.tmdb.org`)
- ✅ Production domain (`https://api.moviemadders.com`)

**To add a custom domain:**

```javascript
// next.config.mjs
if (process.env.NEXT_PUBLIC_LAN_IP) {
  remotePatterns.push({
    protocol: 'http',
    hostname: process.env.NEXT_PUBLIC_LAN_IP,
  })
}
```

---

## Deployment Scenarios

### Local Development

```bash
# Terminal 1: Backend
cd apps/backend
.\.venv\Scripts\python -m hypercorn src.main:app --reload --bind 127.0.0.1:8000

# Terminal 2: Frontend
bun run dev
```

**Access:** `http://localhost:3000`

### Local Development with Mobile Testing

```bash
# Find your IP
ipconfig | findstr IPv4
# Example output: 192.168.0.194

# Terminal 1: Backend (bind to all interfaces)
cd apps/backend
.\.venv\Scripts\python -m hypercorn src.main:app --reload --bind 0.0.0.0:8000

# Terminal 2: Frontend
bun run dev
```

**Backend `.env`:**
```env
CORS_ORIGINS=http://localhost:3000,http://192.168.0.194:3000
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_LAN_IP=192.168.0.194
```

**Access from mobile:** `http://192.168.0.194:3000`

### Production Deployment (Vercel + Render)

**Vercel Environment Variables:**
```env
NEXT_PUBLIC_API_BASE_URL=https://api.moviemadders.com
NEXT_PUBLIC_APP_URL=https://moviemadders.com
```

**Render Environment Variables:**
```env
CORS_ORIGINS=https://moviemadders.com,https://www.moviemadders.com
DATABASE_URL=postgresql+asyncpg://...
JWT_SECRET_KEY=...
```

---

## Troubleshooting

### Issue: "Failed to fetch" errors

**Check 1: Backend binding**
```bash
# ❌ Wrong (localhost only)
hypercorn src.main:app --bind 127.0.0.1:8000

# ✅ Correct (all interfaces)
hypercorn src.main:app --bind 0.0.0.0:8000
```

**Check 2: CORS configuration**
```bash
# Verify CORS_ORIGINS includes your frontend URL
curl -H "Origin: http://192.168.0.194:3000" http://localhost:8000/health
```

**Check 3: Environment variables**
```bash
# Frontend
echo $env:NEXT_PUBLIC_API_BASE_URL

# Backend
echo $env:CORS_ORIGINS
```

### Issue: Images not loading

**Check 1: LAN IP configuration**
```env
# .env.local
NEXT_PUBLIC_LAN_IP=192.168.0.194
```

**Check 2: Restart frontend**
```bash
# Kill and restart
bun run dev
```

---

## Security Best Practices

✅ **Do:**
- Use HTTPS in production
- Specify exact origins in CORS (never use `*` with credentials)
- Rotate JWT secrets regularly
- Use environment variables for all secrets
- Never commit `.env` files to version control

❌ **Don't:**
- Hardcode IP addresses in code
- Use wildcard CORS origins in production
- Commit secrets to git
- Use `127.0.0.1` for network access (use `0.0.0.0`)

---

## Files Modified

- ✅ `next.config.mjs` - Environment-driven image patterns
- ✅ `.env.example` - Frontend configuration template
- ✅ `apps/backend/.env.example` - Backend configuration template
- ✅ `lib/api-config.ts` - Smart URL detection (no changes needed)
- ✅ `apps/backend/src/config.py` - Environment-driven CORS (no changes needed)

---

## Summary

All hardcoded IP addresses have been removed. The application now uses:
- Environment variables for all configuration
- Smart auto-detection for localhost vs. network access
- Flexible CORS configuration for different deployment scenarios
- Production-ready security practices

**Status: ✅ PRODUCTION READY**

