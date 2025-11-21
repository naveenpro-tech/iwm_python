# 🚀 Movie Madders - Render Deployment Guide

## Overview

This guide will help you deploy Movie Madders to production using Render for the backend and database, and Vercel for the frontend.

**Deployment Architecture:**
- **Frontend:** Next.js on Vercel (recommended for Next.js apps)
- **Backend:** FastAPI on Render Web Service
- **Database:** PostgreSQL on Render
- **Domains:** moviemadders.com and moviemadders.in

---

## Prerequisites

1. **Render Account:** Sign up at https://render.com
2. **Vercel Account:** Sign up at https://vercel.com
3. **GitHub Repository:** Code pushed to https://github.com/naveenpro-tech/iwm_python
4. **Payment Method:** Add a credit/debit card to Render (required even for free tier)
5. **Domain Access:** Access to moviemadders.com and moviemadders.in DNS settings

---

## Part 1: Deploy Database to Render

### Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure the database:
   - **Name:** `moviemadders-db`
   - **Database:** `moviemadders_db`
   - **User:** `moviemadders_db_user`
   - **Region:** Oregon (or closest to your users)
   - **PostgreSQL Version:** 16
   - **Plan:** Free
4. Click **"Create Database"**
5. Wait for the database to be created (2-3 minutes)

### Step 2: Get Database Connection String

1. Once created, go to the database dashboard
2. Scroll down to **"Connections"**
3. Copy the **"Internal Database URL"** (starts with `postgresql://`)
4. Save this URL - you'll need it for the backend service

**Example URL format:**
```
postgresql://moviemadders_db_user:password@dpg-xxxxx.oregon-postgres.render.com/moviemadders_db
```

---

## Part 2: Deploy Backend to Render

### Step 1: Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository:
   - Select **"naveenpro-tech/iwm_python"**
   - Click **"Connect"**

### Step 2: Configure Web Service

**Basic Settings:**
- **Name:** `moviemadders-api`
- **Region:** Oregon (same as database)
- **Branch:** `main`
- **Root Directory:** `apps/backend`
- **Runtime:** Python 3
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `hypercorn src.main:app --bind 0.0.0.0:$PORT`

**Advanced Settings:**
- **Plan:** Free
- **Health Check Path:** `/api/v1/health`
- **Auto-Deploy:** Yes

### Step 3: Configure Environment Variables

Click **"Environment"** tab and add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `ENV` | `production` | Environment name |
| `APP_NAME` | `movie-madders-api` | Application name |
| `LOG_LEVEL` | `INFO` | Logging level |
| `DATABASE_URL` | `<paste-internal-db-url>` | From Step 1.2 above |
| `JWT_SECRET_KEY` | `<generate-random-string>` | Use: `openssl rand -hex 32` |
| `JWT_ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXP_MINUTES` | `30` | Token expiry |
| `REFRESH_TOKEN_EXP_DAYS` | `7` | Refresh token expiry |
| `CORS_ORIGINS` | `["https://moviemadders.com","https://moviemadders.in","https://www.moviemadders.com","https://www.moviemadders.in"]` | Allowed origins |
| `EXPORT_OPENAPI_ON_STARTUP` | `false` | Disable OpenAPI export |
| `TMDB_API_KEY` | `<your-tmdb-key>` | Optional: TMDB API key |
| `GEMINI_API_KEY` | `<your-gemini-key>` | Optional: Gemini API key |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Gemini model name |

**Generate JWT Secret Key:**
```bash
# On Linux/Mac:
openssl rand -hex 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for the build and deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://moviemadders-api.onrender.com`

### Step 5: Run Database Migrations

1. Go to your service dashboard
2. Click **"Shell"** tab
3. Run migrations:
```bash
cd apps/backend
alembic upgrade head
```

### Step 6: Seed Database (Optional)

If you want to populate the database with initial data:
```bash
cd apps/backend
python seed_database.py
```

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Import Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import **"naveenpro-tech/iwm_python"**

### Step 2: Configure Project

**Framework Preset:** Next.js
**Root Directory:** `./` (leave as root)
**Build Command:** `bun run build` (or leave default)
**Output Directory:** `.next` (default)
**Install Command:** `bun install` (or leave default)

### Step 3: Configure Environment Variables

Add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NEXT_PUBLIC_APP_NAME` | `Movie Madders` | App name |
| `NEXT_PUBLIC_BETA_VERSION` | `true` | Show beta badge |
| `NEXT_PUBLIC_VERSION` | `0.1.0-beta` | Version number |
| `NEXT_PUBLIC_API_BASE_URL` | `https://moviemadders-api.onrender.com` | Backend API URL |
| `NEXT_PUBLIC_APP_URL` | `https://moviemadders.com` | Frontend URL |
| `NEXT_PUBLIC_TMDB_API_KEY` | `<your-tmdb-key>` | Optional |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | `false` | Analytics flag |
| `NEXT_PUBLIC_ENABLE_PWA` | `false` | PWA flag |
| `NEXT_PUBLIC_DEBUG` | `false` | Debug mode |

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment (3-5 minutes)
3. You'll get a URL like: `https://iwm-python.vercel.app`

---

## Part 4: Configure Custom Domains

### A. Configure moviemadders.com on Vercel

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add domain: `moviemadders.com`
4. Add domain: `www.moviemadders.com`
5. Vercel will provide DNS records to add

**DNS Configuration (at your domain registrar):**

For **moviemadders.com**:
```
Type: A
Name: @
Value: 76.76.21.21
```

For **www.moviemadders.com**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### B. Configure moviemadders.in on Vercel

Repeat the same process for moviemadders.in:

1. Add domain: `moviemadders.in`
2. Add domain: `www.moviemadders.in`
3. Configure DNS records at your registrar

### C. Configure API Subdomain (Optional)

If you want `api.moviemadders.com` to point to Render:

1. Go to Render service dashboard
2. Click **"Settings"** → **"Custom Domain"**
3. Add: `api.moviemadders.com`
4. Render will provide DNS records

**DNS Configuration:**
```
Type: CNAME
Name: api
Value: <provided-by-render>.onrender.com
```

---

## Part 5: Post-Deployment Verification

### 1. Test Backend API

```bash
# Health check
curl https://moviemadders-api.onrender.com/api/v1/health

# Expected response:
{"status": "healthy"}
```

### 2. Test Frontend

Visit: https://moviemadders.com

**Verify:**
- ✅ Page loads correctly
- ✅ Beta badge shows (if enabled)
- ✅ Navigation works
- ✅ API calls work (check browser console)

### 3. Test Authentication

1. Go to https://moviemadders.com/signup
2. Create a test account
3. Verify email/login works
4. Check that JWT tokens are being issued

### 4. Test Database Connection

```bash
# In Render Shell
cd apps/backend
python -c "from src.db import engine; print('DB Connected!')"
```

---

## Part 6: Monitoring and Maintenance

### Render Monitoring

1. **Logs:** https://dashboard.render.com → Your Service → Logs
2. **Metrics:** Check CPU, Memory, Request count
3. **Health Checks:** Automatic health monitoring

### Vercel Monitoring

1. **Analytics:** https://vercel.com/dashboard/analytics
2. **Logs:** Check function logs and build logs
3. **Performance:** Monitor Core Web Vitals

### Database Backups

**Render Free Tier:**
- No automatic backups
- Manual backup: Use `pg_dump` via Shell

**Upgrade to Paid Plan for:**
- Automatic daily backups
- Point-in-time recovery
- Increased storage

---

## Part 7: Scaling and Upgrades

### When to Upgrade from Free Tier

**Render Backend:**
- Free tier sleeps after 15 minutes of inactivity
- Upgrade to **Starter ($7/month)** for:
  - No sleep
  - 512 MB RAM
  - Better performance

**Render Database:**
- Free tier: 90 days, then expires
- Upgrade to **Starter ($7/month)** for:
  - Persistent database
  - 1 GB storage
  - Daily backups

**Vercel Frontend:**
- Free tier is generous for hobby projects
- Upgrade to **Pro ($20/month)** for:
  - Custom domains on team
  - Advanced analytics
  - More bandwidth

### Migration Path

1. **Phase 1 (Current):** Free tier for testing
2. **Phase 2 (Launch):** Starter plans ($14/month total)
3. **Phase 3 (Growth):** Standard plans with auto-scaling
4. **Phase 4 (Scale):** Pro plans with dedicated resources

---

## Troubleshooting

### Backend Won't Start

**Check:**
1. Environment variables are set correctly
2. DATABASE_URL is valid
3. Build logs for errors
4. Python version compatibility

**Common Issues:**
- Missing `PORT` environment variable (Render sets this automatically)
- Database connection timeout (check DATABASE_URL)
- Missing dependencies in requirements.txt

### Frontend Can't Connect to Backend

**Check:**
1. `NEXT_PUBLIC_API_BASE_URL` is correct
2. CORS origins include your frontend domain
3. Backend is running (not sleeping)
4. Network tab in browser for errors

### Database Connection Errors

**Check:**
1. DATABASE_URL format is correct
2. Database is running (not expired)
3. IP allowlist (if configured)
4. Connection pool settings

---

## Security Checklist

- ✅ JWT_SECRET_KEY is strong and random
- ✅ CORS origins are restricted to your domains
- ✅ HTTPS is enabled (automatic on Render/Vercel)
- ✅ Environment variables are not committed to Git
- ✅ Database credentials are secure
- ✅ API keys are stored as environment variables
- ✅ Debug mode is disabled in production

---

## Support and Resources

**Render Documentation:**
- https://render.com/docs
- https://render.com/docs/deploy-fastapi

**Vercel Documentation:**
- https://vercel.com/docs
- https://nextjs.org/docs/deployment

**Movie Madders Support:**
- GitHub Issues: https://github.com/naveenpro-tech/iwm_python/issues
- Email: support@moviemadders.com (if configured)

---

## Quick Reference

### Deployment URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend (Vercel) | https://moviemadders.com | Production |
| Frontend (Vercel) | https://moviemadders.in | Production |
| Backend (Render) | https://moviemadders-api.onrender.com | Production |
| Database (Render) | Internal only | Production |

### Important Commands

```bash
# Generate JWT secret
openssl rand -hex 32

# Run migrations (Render Shell)
cd apps/backend && alembic upgrade head

# Seed database (Render Shell)
cd apps/backend && python seed_database.py

# Check database connection
python -c "from src.db import engine; print('Connected!')"

# View logs (Render)
# Use dashboard: https://dashboard.render.com

# Deploy frontend (Vercel)
# Automatic on git push to main
```

---

**Deployment Status:** ✅ Ready to Deploy
**Last Updated:** 2025-11-04
**Version:** 1.0.0

