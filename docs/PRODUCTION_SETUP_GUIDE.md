# 🚀 Movie Madders - Production Setup Guide

**Date:** 2025-11-05  
**Status:** Deployments Live - Configuration Needed

---

## ✅ Current Deployment Status

### Frontend (Vercel)
- **URL:** https://iwm-python.vercel.app/
- **Status:** ✅ Live and accessible
- **Platform:** Vercel
- **Framework:** Next.js 15.2.4

### Backend (Render)
- **URL:** https://iwm-python.onrender.com
- **Health Check:** https://iwm-python.onrender.com/api/v1/health
- **Status:** ✅ Live and healthy (`{"ok":true}`)
- **Platform:** Render
- **Framework:** FastAPI

### Database (Render PostgreSQL)
- **Status:** ✅ Configured internally on Render
- **Connection:** Automatic via Render internal connection string

---

## 🎯 Next Steps (In Order)

### Step 1: Configure Frontend Environment Variables ⚠️ CRITICAL

The frontend needs to be configured to connect to your Render backend instead of localhost.

**Go to Vercel Dashboard:**
1. Visit: https://vercel.com/dashboard
2. Select your project: `iwm-python`
3. Go to **Settings** → **Environment Variables**

**Add/Update These Variables:**

```bash
# Required - API Connection
NEXT_PUBLIC_API_BASE_URL=https://iwm-python.onrender.com

# Required - App Configuration
NEXT_PUBLIC_APP_NAME=Movie Madders
NEXT_PUBLIC_APP_URL=https://iwm-python.vercel.app
NEXT_PUBLIC_BETA_VERSION=true
NEXT_PUBLIC_VERSION=0.1.0-beta

# Optional - Features (set to false for now)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=false
NEXT_PUBLIC_DEBUG=false

# Optional - TMDB Integration (if you have API key)
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

**Important:**
- Set these for **Production** environment
- After adding, click **"Redeploy"** to apply changes
- The redeploy will take 2-3 minutes

---

### Step 2: Run Database Migrations ⚠️ CRITICAL

Your database needs to be initialized with the schema.

**Option A: Via Render Shell (Recommended)**

1. Go to Render Dashboard: https://dashboard.render.com
2. Select your web service: `iwm-python`
3. Click **"Shell"** tab
4. Run these commands:

```bash
cd apps/backend
alembic upgrade head
```

**Option B: Via Local Connection**

If you have the database connection string:

```bash
# Set the DATABASE_URL environment variable
export DATABASE_URL="postgresql://..."

# Run migrations
cd apps/backend
alembic upgrade head
```

**Expected Output:**
```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> abc123, Initial schema
INFO  [alembic.runtime.migration] Running upgrade abc123 -> def456, Add users table
...
```

---

### Step 3: Seed Initial Data (Optional but Recommended)

After migrations, you may want to seed some initial data.

**Via Render Shell:**

```bash
cd apps/backend
python seed_database.py
```

This will create:
- Admin user
- Sample movies
- Sample genres
- Sample collections

---

### Step 4: Test End-to-End Connectivity

**Test Backend API:**

```bash
# Health check
curl https://iwm-python.onrender.com/api/v1/health

# Expected: {"ok":true}
```

**Test Frontend → Backend Connection:**

1. Visit: https://iwm-python.vercel.app/
2. Try to sign up for a new account
3. Try to log in
4. Browse movies
5. Check if data loads correctly

**Common Issues:**

| Issue | Cause | Solution |
|-------|-------|----------|
| "Network Error" | Frontend not configured | Update `NEXT_PUBLIC_API_BASE_URL` |
| "CORS Error" | Backend CORS not configured | Check backend `CORS_ORIGINS` env var |
| "500 Internal Server Error" | Database not migrated | Run `alembic upgrade head` |
| "Authentication Failed" | No users in database | Create user via signup or seed data |

---

### Step 5: Configure Backend Environment Variables

Check that your Render backend has these environment variables set:

**Go to Render Dashboard:**
1. Visit: https://dashboard.render.com
2. Select your web service
3. Go to **Environment** tab

**Required Variables:**

```bash
# Environment
ENV=production
APP_NAME=movie-madders-api
LOG_LEVEL=INFO

# Database (should be auto-set by Render)
DATABASE_URL=<auto-populated-by-render>

# JWT Configuration
JWT_SECRET_KEY=<generate-random-32-byte-hex>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXP_MINUTES=30
REFRESH_TOKEN_EXP_DAYS=7

# CORS (CRITICAL - must include your Vercel domain)
CORS_ORIGINS=["https://iwm-python.vercel.app","https://moviemadders.com","https://moviemadders.in"]

# Features
EXPORT_OPENAPI_ON_STARTUP=false

# Optional - AI Features
GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_MODEL=gemini-2.5-flash

# Optional - TMDB
TMDB_API_KEY=<your-tmdb-api-key>
```

**Generate JWT Secret:**

```bash
# On your local machine
python -c "import secrets; print(secrets.token_hex(32))"
```

Copy the output and use it as `JWT_SECRET_KEY`.

---

### Step 6: Configure Custom Domains (Optional)

You have two domains ready: `moviemadders.com` and `moviemadders.in`

**For Vercel (Frontend):**

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click **"Add Domain"**
3. Enter: `moviemadders.com`
4. Follow DNS configuration instructions
5. Repeat for `moviemadders.in`

**DNS Records (at your domain registrar):**

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**SSL/HTTPS:**
- Vercel automatically provisions SSL certificates
- Wait 24-48 hours for DNS propagation
- Certificates auto-renew

---

## 🔍 Verification Checklist

After completing all steps, verify:

### Backend Checks
- [ ] Health endpoint returns `{"ok":true}`
- [ ] Database migrations completed successfully
- [ ] Environment variables are set correctly
- [ ] CORS includes Vercel domain
- [ ] JWT secret is configured

### Frontend Checks
- [ ] Homepage loads without errors
- [ ] Can sign up for new account
- [ ] Can log in with credentials
- [ ] Movies page loads data
- [ ] API calls go to Render backend (check Network tab)
- [ ] No CORS errors in console

### End-to-End Checks
- [ ] User registration works
- [ ] User login works
- [ ] Movie browsing works
- [ ] Reviews can be created
- [ ] Collections can be created
- [ ] Profile page loads

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" errors

**Cause:** Frontend can't reach backend

**Solutions:**
1. Check `NEXT_PUBLIC_API_BASE_URL` is set to `https://iwm-python.onrender.com`
2. Redeploy frontend after setting env vars
3. Check backend is running: `curl https://iwm-python.onrender.com/api/v1/health`

### Issue: CORS errors

**Cause:** Backend not allowing requests from Vercel domain

**Solution:**
1. Go to Render → Environment Variables
2. Update `CORS_ORIGINS` to include: `["https://iwm-python.vercel.app"]`
3. Redeploy backend

### Issue: Database connection errors

**Cause:** Database not initialized or connection string wrong

**Solutions:**
1. Check `DATABASE_URL` is set in Render
2. Run migrations: `alembic upgrade head`
3. Check database is running in Render dashboard

### Issue: Authentication not working

**Cause:** JWT secret not configured or users table empty

**Solutions:**
1. Set `JWT_SECRET_KEY` in Render environment variables
2. Run migrations to create users table
3. Try signing up for a new account

---

## 📊 Monitoring

### Check Backend Logs

**Via Render Dashboard:**
1. Go to: https://dashboard.render.com
2. Select your web service
3. Click **"Logs"** tab
4. Monitor for errors

### Check Frontend Logs

**Via Vercel Dashboard:**
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click **"Deployments"** → Latest deployment → **"Functions"**
4. Check for errors

---

## 🚀 Performance Optimization (After Setup)

### Render Free Tier Limitations
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- 512 MB RAM limit

### Recommendations
1. **Upgrade to Starter Plan ($7/month):**
   - No sleep time
   - Faster response times
   - Better for production

2. **Enable Caching:**
   - Use Redis for session storage
   - Cache frequently accessed data

3. **Optimize Database:**
   - Add indexes on frequently queried columns
   - Use connection pooling

---

## 📝 Quick Command Reference

```bash
# Test backend health
curl https://iwm-python.onrender.com/api/v1/health

# Test frontend
curl https://iwm-python.vercel.app/

# Run migrations (via Render Shell)
cd apps/backend && alembic upgrade head

# Seed database (via Render Shell)
cd apps/backend && python seed_database.py

# Generate JWT secret (local)
python -c "import secrets; print(secrets.token_hex(32))"

# Check backend logs (Render CLI)
render logs -s <service-id>

# Redeploy frontend (Vercel CLI)
vercel --prod
```

---

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ Frontend loads at https://iwm-python.vercel.app/
2. ✅ Backend responds at https://iwm-python.onrender.com/api/v1/health
3. ✅ You can sign up for a new account
4. ✅ You can log in with your credentials
5. ✅ Movies page loads and displays data
6. ✅ No errors in browser console
7. ✅ No CORS errors
8. ✅ Database queries work correctly

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Next.js Docs:** https://nextjs.org/docs

---

**Last Updated:** 2025-11-05  
**Version:** 1.0.0  
**Status:** Ready for Configuration

