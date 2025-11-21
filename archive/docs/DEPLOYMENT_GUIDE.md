# Movie Madders Deployment Guide

**Version**: 0.1.0-beta  
**Last Updated**: 2025-11-04  
**Status**: Production Ready (Beta)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Environment Variables](#environment-variables)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Backend Deployment (Railway)](#backend-deployment-railway)
6. [Database Setup](#database-setup)
7. [Domain Configuration](#domain-configuration)
8. [Post-Deployment Verification](#post-deployment-verification)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Movie Madders is deployed using:
- **Frontend**: Vercel (Next.js 15.2.4)
- **Backend**: Railway (FastAPI + Hypercorn)
- **Database**: Railway PostgreSQL 18
- **Domain**: moviemadders.com

### Architecture
```
moviemadders.com (Vercel)
    ↓
api.moviemadders.com (Railway Backend)
    ↓
PostgreSQL Database (Railway)
```

---

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] All tests pass (if tests exist)
- [ ] No `console.log` or debug statements in production code
- [ ] Remove debug logging from backend (`[PRIVACY CHECK]` print statements)
- [ ] Error handling is production-ready (no stack traces exposed)
- [ ] All API endpoints return proper error messages

### Security
- [ ] All secrets are in environment variables (not hardcoded)
- [ ] JWT secret is strong and unique (generate with `openssl rand -hex 32`)
- [ ] CORS is properly configured (not allowing "*")
- [ ] Rate limiting is enabled (if implemented)
- [ ] SQL injection protection verified
- [ ] XSS protection verified

### Performance
- [ ] Frontend build is optimized (`bun run build` completes without errors)
- [ ] Images are optimized
- [ ] Database indexes are in place
- [ ] API responses are reasonably fast

### Branding
- [ ] Search codebase for "IWM" - should find 0 results
- [ ] Search for "I Watch Movies" - should find 0 results
- [ ] All page titles show "Movie Madders"
- [ ] All meta tags reference "Movie Madders"
- [ ] Footer shows "Movie Madders" copyright
- [ ] Beta badge is visible on all pages

---

## 🔐 Environment Variables

### Frontend (.env.production)

```env
# Application
NEXT_PUBLIC_APP_NAME="Movie Madders"
NEXT_PUBLIC_BETA_VERSION=true
NEXT_PUBLIC_VERSION="0.1.0-beta"

# URLs
NEXT_PUBLIC_APP_URL=https://moviemadders.com
NEXT_PUBLIC_API_BASE_URL=https://api.moviemadders.com

# External APIs (Optional)
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

### Backend (.env.production)

```env
# Environment
ENV=production

# Database (Auto-provided by Railway)
DATABASE_URL=postgresql+asyncpg://user:pass@host:port/database

# Application
APP_NAME=movie-madders-api
LOG_LEVEL=WARNING

# CORS
CORS_ORIGINS=https://moviemadders.com,https://www.moviemadders.com

# JWT (CHANGE THESE!)
JWT_SECRET_KEY=your-secure-random-string-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXP_MINUTES=30
REFRESH_TOKEN_EXP_DAYS=7

# External APIs
TMDB_API_KEY=your_tmdb_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Production Settings
API_BASE_URL=https://api.moviemadders.com
EXPORT_OPENAPI_ON_STARTUP=false
```

---

## 🚀 Frontend Deployment (Vercel)

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository: `naveenpro-tech/iwm_python`

### Step 2: Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave empty)
- **Build Command**: `bun run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `bun install`

### Step 3: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_APP_NAME = Movie Madders
NEXT_PUBLIC_BETA_VERSION = true
NEXT_PUBLIC_VERSION = 0.1.0-beta
NEXT_PUBLIC_APP_URL = https://moviemadders.com
NEXT_PUBLIC_API_BASE_URL = https://api.moviemadders.com
NEXT_PUBLIC_TMDB_API_KEY = your_tmdb_api_key_here
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Vercel will provide a preview URL (e.g., `movie-madders.vercel.app`)

### Step 5: Configure Custom Domain

1. Go to Settings → Domains
2. Add domain: `moviemadders.com`
3. Add domain: `www.moviemadders.com` (redirect to main)
4. Follow Vercel's DNS configuration instructions

---

## 🚂 Backend Deployment (Railway)

### Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `apps/backend` directory as the root

### Step 2: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a database and provide `DATABASE_URL`

### Step 3: Configure Environment Variables

In Railway Dashboard → Variables, add:

```
ENV = production
APP_NAME = movie-madders-api
LOG_LEVEL = WARNING
CORS_ORIGINS = https://moviemadders.com,https://www.moviemadders.com
JWT_SECRET_KEY = [Generate with: openssl rand -hex 32]
JWT_ALGORITHM = HS256
ACCESS_TOKEN_EXP_MINUTES = 30
REFRESH_TOKEN_EXP_DAYS = 7
TMDB_API_KEY = your_tmdb_api_key_here
GEMINI_API_KEY = your_gemini_api_key_here
GEMINI_MODEL = gemini-2.5-flash
API_BASE_URL = https://api.moviemadders.com
EXPORT_OPENAPI_ON_STARTUP = false
```

**Note**: `DATABASE_URL` is automatically set by Railway when you add PostgreSQL.

### Step 4: Configure Build Settings

Railway should auto-detect Python. Verify:

- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `hypercorn src.main:app --bind 0.0.0.0:$PORT`
- **Health Check Path**: `/api/v1/health`

If not auto-detected, create `railway.toml` (already created in `apps/backend/railway.toml`).

### Step 5: Deploy

1. Railway will automatically deploy on push to main branch
2. Wait for deployment to complete
3. Railway will provide a URL (e.g., `movie-madders-api.up.railway.app`)

### Step 6: Run Database Migrations

1. In Railway Dashboard, go to your backend service
2. Click "Settings" → "Deploy"
3. Add a one-time command: `alembic upgrade head`
4. Or use Railway CLI:
   ```bash
   railway run alembic upgrade head
   ```

### Step 7: Configure Custom Domain

1. Go to Settings → Domains
2. Add custom domain: `api.moviemadders.com`
3. Follow Railway's DNS configuration instructions

---

## 🗄️ Database Setup

### Initial Setup

Railway automatically creates a PostgreSQL database. To verify:

1. In Railway Dashboard, click on PostgreSQL service
2. Go to "Connect" tab
3. Copy the connection string (this is your `DATABASE_URL`)

### Run Migrations

```bash
# Using Railway CLI
railway run alembic upgrade head

# Or connect directly
alembic upgrade head
```

### Verify Database

```bash
# Using Railway CLI
railway run python -c "from src.db import init_db; import asyncio; asyncio.run(init_db())"
```

### Backup Strategy

Railway provides automatic daily backups. To configure:

1. Go to PostgreSQL service → Settings
2. Enable "Automated Backups"
3. Set retention period (7 days recommended for beta)

---

## 🌐 Domain Configuration

### DNS Records

Configure these DNS records with your domain registrar:

#### For moviemadders.com (Frontend - Vercel)

```
Type: A
Name: @
Value: 76.76.21.21 (Vercel's IP)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### For api.moviemadders.com (Backend - Railway)

```
Type: CNAME
Name: api
Value: [Your Railway domain].up.railway.app
```

### SSL Certificates

Both Vercel and Railway automatically provision SSL certificates via Let's Encrypt. No manual configuration needed.

---

## ✅ Post-Deployment Verification

### Frontend Checks

1. **Visit**: https://moviemadders.com
   - [ ] Site loads successfully
   - [ ] Beta badge is visible
   - [ ] No console errors in browser DevTools
   - [ ] Images load correctly
   - [ ] Navigation works

2. **Test Authentication**:
   - [ ] Signup works
   - [ ] Login works
   - [ ] JWT tokens are stored correctly
   - [ ] Protected routes redirect to login

3. **Test Features**:
   - [ ] Movie browsing works
   - [ ] Search functionality works
   - [ ] User profile loads
   - [ ] Collections work
   - [ ] Reviews can be created

### Backend Checks

1. **Health Check**: https://api.moviemadders.com/api/v1/health
   - [ ] Returns `{"status": "healthy"}`

2. **API Documentation** (if enabled in dev):
   - [ ] https://api.moviemadders.com/docs (should be disabled in production)

3. **Database Connection**:
   - [ ] Check Railway logs for successful database connection
   - [ ] No connection errors in logs

4. **CORS**:
   - [ ] Frontend can make API calls
   - [ ] No CORS errors in browser console

### Performance Checks

1. **Frontend**:
   - [ ] Lighthouse score > 80
   - [ ] First Contentful Paint < 2s
   - [ ] Time to Interactive < 3s

2. **Backend**:
   - [ ] API response time < 500ms
   - [ ] No 500 errors in logs
   - [ ] Database queries are optimized

---

## 🐛 Troubleshooting

### Frontend Issues

#### Build Fails on Vercel

**Symptoms**: Build fails with TypeScript errors

**Solution**:
1. Check Vercel build logs
2. Verify all dependencies are in `package.json`
3. Run `bun run build` locally to reproduce
4. Fix TypeScript errors or set `typescript.ignoreBuildErrors: true` in `next.config.mjs`

#### API Calls Fail (CORS)

**Symptoms**: Browser console shows CORS errors

**Solution**:
1. Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
2. Check backend `CORS_ORIGINS` includes frontend domain
3. Ensure both `https://moviemadders.com` and `https://www.moviemadders.com` are in CORS origins

### Backend Issues

#### Database Connection Fails

**Symptoms**: Backend logs show "could not connect to database"

**Solution**:
1. Verify `DATABASE_URL` is set in Railway
2. Check PostgreSQL service is running
3. Verify database credentials are correct
4. Check Railway logs for detailed error messages

#### Migrations Fail

**Symptoms**: `alembic upgrade head` fails

**Solution**:
1. Check Alembic version matches local development
2. Verify database schema is compatible
3. Run migrations locally first to test
4. Check for conflicting migrations

#### 500 Errors

**Symptoms**: API returns 500 Internal Server Error

**Solution**:
1. Check Railway logs for stack traces
2. Verify all environment variables are set
3. Check for missing dependencies in `requirements.txt`
4. Verify JWT_SECRET_KEY is set

### Domain Issues

#### Domain Not Resolving

**Symptoms**: Domain shows "DNS_PROBE_FINISHED_NXDOMAIN"

**Solution**:
1. Verify DNS records are configured correctly
2. Wait 24-48 hours for DNS propagation
3. Use `nslookup moviemadders.com` to check DNS
4. Clear browser DNS cache

#### SSL Certificate Issues

**Symptoms**: Browser shows "Not Secure" warning

**Solution**:
1. Wait for SSL certificate provisioning (can take up to 24 hours)
2. Verify domain is correctly configured in Vercel/Railway
3. Check for mixed content (HTTP resources on HTTPS page)

---

## 📞 Support

For deployment issues:
- **Vercel**: https://vercel.com/support
- **Railway**: https://railway.app/help
- **Movie Madders Team**: hello@moviemadders.com

---

## 🎉 Deployment Complete!

Once all checks pass, your Movie Madders beta is live at:
- **Frontend**: https://moviemadders.com
- **Backend API**: https://api.moviemadders.com

**Next Steps**:
1. Monitor logs for errors
2. Set up error tracking (Sentry, LogRocket, etc.)
3. Configure analytics (Google Analytics, Plausible, etc.)
4. Plan for beta user feedback collection
5. Prepare for production launch (remove beta indicators)

---

**Built with ❤️ by the Movie Madders Team**

