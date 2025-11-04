# 🚀 Movie Madders - Production Deployment Checklist

## Pre-Deployment Checklist

### Code Preparation
- [x] All code committed to Git
- [x] Code pushed to GitHub (main branch)
- [x] Build tested successfully (`bun run build`)
- [x] All tests passing
- [x] Platform rebranding complete (Siddu → Movie Madders)
- [x] Beta badge configured
- [x] Environment variables documented

### Account Setup
- [ ] Render account created
- [ ] Payment method added to Render (required for free tier)
- [ ] Vercel account created
- [ ] GitHub repository access granted to Render
- [ ] GitHub repository access granted to Vercel

### Domain Preparation
- [ ] moviemadders.com domain registered
- [ ] moviemadders.in domain registered
- [ ] DNS access available for both domains
- [ ] SSL certificates ready (automatic on Render/Vercel)

---

## Deployment Steps

### Phase 1: Database Deployment (Render)

- [ ] **Step 1.1:** Create PostgreSQL database on Render
  - Name: `moviemadders-db`
  - Region: Oregon
  - Version: PostgreSQL 16
  - Plan: Free
  - Status: ✅ **CREATED** (ID: dpg-d450gci4d50c73ervgl0-a)

- [ ] **Step 1.2:** Wait for database to be ready (2-3 minutes)
  - Dashboard: https://dashboard.render.com/d/dpg-d450gci4d50c73ervgl0-a

- [ ] **Step 1.3:** Copy Internal Database URL
  - Format: `postgresql://user:pass@host/db`
  - Save for backend configuration

### Phase 2: Backend Deployment (Render)

- [ ] **Step 2.1:** Create Web Service
  - Name: `moviemadders-api`
  - Repository: `naveenpro-tech/iwm_python`
  - Branch: `main`
  - Root Directory: `apps/backend`
  - Runtime: Python 3

- [ ] **Step 2.2:** Configure Build Settings
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `hypercorn src.main:app --bind 0.0.0.0:$PORT`
  - Health Check: `/api/v1/health`

- [ ] **Step 2.3:** Set Environment Variables
  - [ ] `ENV=production`
  - [ ] `APP_NAME=movie-madders-api`
  - [ ] `LOG_LEVEL=INFO`
  - [ ] `DATABASE_URL=<from-step-1.3>`
  - [ ] `JWT_SECRET_KEY=<generate-random>`
  - [ ] `JWT_ALGORITHM=HS256`
  - [ ] `ACCESS_TOKEN_EXP_MINUTES=30`
  - [ ] `REFRESH_TOKEN_EXP_DAYS=7`
  - [ ] `CORS_ORIGINS=["https://moviemadders.com","https://moviemadders.in"]`
  - [ ] `EXPORT_OPENAPI_ON_STARTUP=false`
  - [ ] `TMDB_API_KEY=<optional>`
  - [ ] `GEMINI_API_KEY=<optional>`
  - [ ] `GEMINI_MODEL=gemini-2.5-flash`

- [ ] **Step 2.4:** Deploy Backend
  - Click "Create Web Service"
  - Wait for build (5-10 minutes)
  - Verify deployment successful

- [ ] **Step 2.5:** Run Database Migrations
  ```bash
  cd apps/backend
  alembic upgrade head
  ```

- [ ] **Step 2.6:** Seed Database (Optional)
  ```bash
  cd apps/backend
  python seed_database.py
  ```

- [ ] **Step 2.7:** Test Backend API
  ```bash
  curl https://moviemadders-api.onrender.com/api/v1/health
  ```

### Phase 3: Frontend Deployment (Vercel)

- [ ] **Step 3.1:** Import Project to Vercel
  - Repository: `naveenpro-tech/iwm_python`
  - Framework: Next.js
  - Root Directory: `./`

- [ ] **Step 3.2:** Configure Build Settings
  - Build Command: `bun run build` (or default)
  - Output Directory: `.next`
  - Install Command: `bun install` (or default)

- [ ] **Step 3.3:** Set Environment Variables
  - [ ] `NEXT_PUBLIC_APP_NAME=Movie Madders`
  - [ ] `NEXT_PUBLIC_BETA_VERSION=true`
  - [ ] `NEXT_PUBLIC_VERSION=0.1.0-beta`
  - [ ] `NEXT_PUBLIC_API_BASE_URL=https://moviemadders-api.onrender.com`
  - [ ] `NEXT_PUBLIC_APP_URL=https://moviemadders.com`
  - [ ] `NEXT_PUBLIC_TMDB_API_KEY=<optional>`
  - [ ] `NEXT_PUBLIC_ENABLE_ANALYTICS=false`
  - [ ] `NEXT_PUBLIC_ENABLE_PWA=false`
  - [ ] `NEXT_PUBLIC_DEBUG=false`

- [ ] **Step 3.4:** Deploy Frontend
  - Click "Deploy"
  - Wait for deployment (3-5 minutes)
  - Verify deployment successful

- [ ] **Step 3.5:** Test Frontend
  - Visit Vercel URL
  - Check console for errors
  - Verify API connection works

### Phase 4: Domain Configuration

#### moviemadders.com

- [ ] **Step 4.1:** Add Domain to Vercel
  - Add: `moviemadders.com`
  - Add: `www.moviemadders.com`

- [ ] **Step 4.2:** Configure DNS Records
  ```
  Type: A
  Name: @
  Value: 76.76.21.21
  
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```

- [ ] **Step 4.3:** Wait for DNS Propagation (up to 48 hours)

- [ ] **Step 4.4:** Verify SSL Certificate
  - Automatic via Vercel
  - Check: https://moviemadders.com

#### moviemadders.in

- [ ] **Step 4.5:** Add Domain to Vercel
  - Add: `moviemadders.in`
  - Add: `www.moviemadders.in`

- [ ] **Step 4.6:** Configure DNS Records
  ```
  Type: A
  Name: @
  Value: 76.76.21.21
  
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```

- [ ] **Step 4.7:** Wait for DNS Propagation

- [ ] **Step 4.8:** Verify SSL Certificate
  - Check: https://moviemadders.in

#### API Subdomain (Optional)

- [ ] **Step 4.9:** Add Custom Domain to Render
  - Domain: `api.moviemadders.com`
  - Get CNAME from Render

- [ ] **Step 4.10:** Configure DNS
  ```
  Type: CNAME
  Name: api
  Value: <from-render>.onrender.com
  ```

---

## Post-Deployment Verification

### Backend Verification

- [ ] **Health Check Endpoint**
  ```bash
  curl https://moviemadders-api.onrender.com/api/v1/health
  # Expected: {"status": "healthy"}
  ```

- [ ] **API Documentation**
  ```bash
  curl https://moviemadders-api.onrender.com/docs
  # Should return OpenAPI docs (if enabled)
  ```

- [ ] **Database Connection**
  - Check Render logs for successful connection
  - Verify no connection errors

- [ ] **CORS Configuration**
  - Test from frontend domain
  - Verify no CORS errors in browser console

### Frontend Verification

- [ ] **Homepage Loads**
  - Visit: https://moviemadders.com
  - Check for errors in console
  - Verify page renders correctly

- [ ] **Beta Badge Shows**
  - Desktop: Compact badge visible
  - Mobile: Minimal badge visible

- [ ] **Navigation Works**
  - Test all main navigation links
  - Verify routing works correctly

- [ ] **API Integration**
  - Check browser Network tab
  - Verify API calls to backend succeed
  - Check for authentication flows

- [ ] **Authentication Flow**
  - Test signup: https://moviemadders.com/signup
  - Test login: https://moviemadders.com/login
  - Verify JWT tokens are issued
  - Test protected routes

- [ ] **Movie Features**
  - Browse movies
  - View movie details
  - Test search functionality
  - Verify images load

### Domain Verification

- [ ] **moviemadders.com**
  - [ ] HTTP redirects to HTTPS
  - [ ] www redirects to non-www (or vice versa)
  - [ ] SSL certificate valid
  - [ ] No mixed content warnings

- [ ] **moviemadders.in**
  - [ ] HTTP redirects to HTTPS
  - [ ] www redirects to non-www (or vice versa)
  - [ ] SSL certificate valid
  - [ ] No mixed content warnings

### Performance Verification

- [ ] **Lighthouse Score**
  - Run on: https://moviemadders.com
  - Target: >90 Performance
  - Target: >90 Accessibility
  - Target: >90 Best Practices
  - Target: >90 SEO

- [ ] **Core Web Vitals**
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

- [ ] **API Response Times**
  - Health check < 200ms
  - Movie list < 500ms
  - Movie details < 300ms

---

## Monitoring Setup

### Render Monitoring

- [ ] **Enable Alerts**
  - Service down alerts
  - High CPU/memory alerts
  - Error rate alerts

- [ ] **Log Retention**
  - Configure log retention period
  - Set up log exports (if needed)

### Vercel Monitoring

- [ ] **Enable Analytics**
  - Web Analytics
  - Speed Insights
  - Audience Insights

- [ ] **Configure Alerts**
  - Deployment failures
  - Build errors
  - Performance degradation

### Database Monitoring

- [ ] **Connection Pool**
  - Monitor active connections
  - Check for connection leaks

- [ ] **Storage Usage**
  - Track database size
  - Plan for upgrades

- [ ] **Backup Strategy**
  - Manual backups (free tier)
  - Upgrade for automatic backups

---

## Security Checklist

- [ ] **Environment Variables**
  - [ ] No secrets in Git
  - [ ] Strong JWT secret key
  - [ ] API keys secured

- [ ] **HTTPS/SSL**
  - [ ] All domains use HTTPS
  - [ ] Valid SSL certificates
  - [ ] No mixed content

- [ ] **CORS Configuration**
  - [ ] Restricted to production domains
  - [ ] No wildcard origins in production

- [ ] **Database Security**
  - [ ] Strong database password
  - [ ] Internal connections only
  - [ ] No public access

- [ ] **API Security**
  - [ ] Rate limiting configured
  - [ ] Authentication required for protected routes
  - [ ] Input validation enabled

---

## Rollback Plan

### If Backend Deployment Fails

1. Check Render logs for errors
2. Verify environment variables
3. Test build locally
4. Rollback to previous deployment (Render dashboard)

### If Frontend Deployment Fails

1. Check Vercel build logs
2. Verify environment variables
3. Test build locally: `bun run build`
4. Rollback to previous deployment (Vercel dashboard)

### If Database Migration Fails

1. Check migration logs
2. Rollback migration: `alembic downgrade -1`
3. Fix migration script
4. Re-run: `alembic upgrade head`

---

## Success Criteria

### Deployment Complete When:

- ✅ Backend API is accessible and healthy
- ✅ Frontend loads on both domains
- ✅ Database is connected and migrations applied
- ✅ Authentication flow works end-to-end
- ✅ All main features functional
- ✅ SSL certificates valid
- ✅ No console errors
- ✅ Performance metrics acceptable
- ✅ Monitoring configured

---

## Next Steps After Deployment

1. **Announce Launch**
   - Social media posts
   - Email to beta testers
   - Update README with live URLs

2. **Monitor Closely**
   - Watch logs for errors
   - Monitor performance metrics
   - Track user feedback

3. **Plan Upgrades**
   - Schedule upgrade from free tier
   - Plan for scaling
   - Budget for paid plans

4. **Continuous Improvement**
   - Fix bugs as reported
   - Optimize performance
   - Add new features

---

## Important URLs

| Resource | URL |
|----------|-----|
| **Production Frontend** | https://moviemadders.com |
| **Production Frontend (Alt)** | https://moviemadders.in |
| **Production API** | https://moviemadders-api.onrender.com |
| **Render Dashboard** | https://dashboard.render.com |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **GitHub Repository** | https://github.com/naveenpro-tech/iwm_python |
| **Database Dashboard** | https://dashboard.render.com/d/dpg-d450gci4d50c73ervgl0-a |

---

**Status:** Ready for Manual Deployment
**Reason:** Render requires payment information to be added before creating web services
**Action Required:** Add payment method at https://dashboard.render.com/billing

**Last Updated:** 2025-11-04
**Version:** 1.0.0

