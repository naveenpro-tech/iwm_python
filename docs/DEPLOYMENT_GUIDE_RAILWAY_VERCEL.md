# IWM Deployment Guide - Railway + Vercel

**Date**: 2025-10-31  
**Stack**: FastAPI Backend + PostgreSQL on Railway | Next.js Frontend on Vercel

---

## 🎯 **DEPLOYMENT ARCHITECTURE**

### **Recommended Setup:**
- **Backend + PostgreSQL**: Railway (Best for Python + PostgreSQL)
- **Frontend**: Vercel (Best for Next.js)

### **Why This Combination?**

| Platform | Best For | Pros | Cons |
|----------|----------|------|------|
| **Railway** | Backend + DB | ✅ Native PostgreSQL<br>✅ Easy Python deployment<br>✅ Great for monorepo<br>✅ Automatic HTTPS<br>✅ $5 free credit | ❌ More expensive than Render<br>❌ Limited free tier |
| **Vercel** | Next.js Frontend | ✅ Built for Next.js<br>✅ Edge network<br>✅ Automatic previews<br>✅ Zero config<br>✅ Generous free tier | ❌ Backend not ideal<br>❌ No PostgreSQL |
| **Render** | Full-stack alternative | ✅ Free PostgreSQL<br>✅ Free web services<br>✅ Good for monoliths | ❌ Slower cold starts<br>❌ Limited resources on free tier |

---

## 📋 **PLATFORM COMPARISON: Railway vs Render**

### **Railway**
**Best for**: Production apps, teams, apps needing PostgreSQL

**Pricing:**
- **Free**: $5 credit/month (enough for small projects)
- **Hobby**: $5/month base + usage
- **Pro**: $20/month base + usage

**Pros:**
- ✅ Native PostgreSQL with backups
- ✅ Excellent DX (developer experience)
- ✅ Fast deployments
- ✅ Great for monorepos
- ✅ Automatic HTTPS
- ✅ Environment variables management
- ✅ Easy database migrations

**Cons:**
- ❌ Can get expensive with high usage
- ❌ Limited free tier ($5 credit runs out fast)

**When to use Railway:**
- You need PostgreSQL
- You want fast, reliable deployments
- You're okay paying $10-20/month
- You need production-grade infrastructure

---

### **Render**
**Best for**: Side projects, MVPs, learning

**Pricing:**
- **Free**: Free web services + Free PostgreSQL (with limitations)
- **Starter**: $7/month per service
- **Standard**: $25/month per service

**Pros:**
- ✅ Truly free tier (PostgreSQL + web service)
- ✅ No credit card required for free tier
- ✅ Good for learning/prototyping
- ✅ Simple setup

**Cons:**
- ❌ Free tier has slow cold starts (30-60 seconds)
- ❌ Free PostgreSQL expires after 90 days
- ❌ Limited resources on free tier
- ❌ Slower than Railway

**When to use Render:**
- You're learning/prototyping
- You don't want to pay anything
- You're okay with slow cold starts
- You don't need production performance

---

## 🚀 **DEPLOYMENT PLAN**

### **Option A: Railway + Vercel (RECOMMENDED)**
- **Backend + PostgreSQL**: Railway
- **Frontend**: Vercel
- **Cost**: ~$10-15/month
- **Performance**: ⭐⭐⭐⭐⭐

### **Option B: Render Only (BUDGET)**
- **Backend + PostgreSQL + Frontend**: All on Render
- **Cost**: $0 (free tier)
- **Performance**: ⭐⭐⭐ (slow cold starts)

### **Option C: Railway Only**
- **Backend + PostgreSQL + Frontend**: All on Railway
- **Cost**: ~$15-20/month
- **Performance**: ⭐⭐⭐⭐⭐

---

## 📝 **STEP-BY-STEP: Railway + Vercel Deployment**

### **PART 1: Deploy Backend + PostgreSQL to Railway**

#### **Step 1: Sign Up for Railway**
1. Go to: https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub (recommended)
4. You'll get $5 free credit

#### **Step 2: Create PostgreSQL Database**
1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Railway will create a PostgreSQL database
4. **Copy the connection details** (you'll need these)

**Connection String Format:**
```
postgresql://postgres:PASSWORD@HOST:PORT/railway
```

#### **Step 3: Prepare Backend for Deployment**

**Create `railway.json` in project root:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd apps/backend && pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "cd apps/backend && alembic upgrade head && hypercorn src.main:app --bind 0.0.0.0:$PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Create `Procfile` in `apps/backend/`:**
```
web: hypercorn src.main:app --bind 0.0.0.0:$PORT
release: alembic upgrade head
```

**Update `apps/backend/src/config.py`** to read Railway environment variables:
```python
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm_db"
    )
    
    # Railway provides DATABASE_URL in postgres:// format
    # Convert to asyncpg format
    @property
    def async_database_url(self) -> str:
        url = self.database_url
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url
    
    jwt_secret: str = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    
    class Config:
        env_file = ".env"

settings = Settings()
```

#### **Step 4: Deploy to Railway**

1. **Connect GitHub Repository:**
   - In Railway dashboard, click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `iwm_python` repository
   - Select the `main` branch

2. **Configure Environment Variables:**
   - Click on your service
   - Go to "Variables" tab
   - Add these variables:
     ```
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     JWT_SECRET=your-super-secret-jwt-key-change-this
     GEMINI_API_KEY=your-gemini-api-key
     PORT=8000
     PYTHONUNBUFFERED=1
     ```

3. **Set Root Directory:**
   - Go to "Settings" tab
   - Set "Root Directory" to `apps/backend`
   - Set "Build Command": `pip install -r requirements.txt`
   - Set "Start Command": `alembic upgrade head && hypercorn src.main:app --bind 0.0.0.0:$PORT`

4. **Deploy:**
   - Railway will automatically deploy
   - Wait for build to complete (2-5 minutes)
   - You'll get a URL like: `https://your-app.up.railway.app`

5. **Run Database Migrations:**
   - In Railway dashboard, click on your service
   - Go to "Deployments" tab
   - Click "Run Command"
   - Run: `alembic upgrade head`

#### **Step 5: Test Backend**
```bash
# Test health endpoint
curl https://your-app.up.railway.app/api/v1/health

# Expected response:
{"status": "ok"}
```

---

### **PART 2: Deploy Frontend to Vercel**

#### **Step 1: Sign Up for Vercel**
1. Go to: https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub (recommended)

#### **Step 2: Prepare Frontend for Deployment**

**Update `.env.local` (for local development):**
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

**Create `.env.production` (for Vercel):**
```env
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
```

**Update `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

#### **Step 3: Deploy to Vercel**

1. **Import Project:**
   - In Vercel dashboard, click "Add New Project"
   - Select "Import Git Repository"
   - Choose your `iwm_python` repository
   - Click "Import"

2. **Configure Project:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Leave as `.` (project root)
   - **Build Command**: `bun run build` (or `npm run build`)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `bun install` (or `npm install`)

3. **Set Environment Variables:**
   - Click "Environment Variables"
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
     ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy (2-3 minutes)
   - You'll get a URL like: `https://your-app.vercel.app`

#### **Step 4: Update CORS in Backend**

**Update `apps/backend/src/main.py`:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app",  # Add your Vercel URL
        "https://*.vercel.app",  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Commit and push** - Railway will auto-deploy the update.

---

### **PART 3: Test End-to-End**

1. **Open your Vercel URL**: `https://your-app.vercel.app`
2. **Sign up** for a new account
3. **Login** with the account
4. **Create a movie** via JSON import
5. **Verify** everything works

---

## 🔧 **TROUBLESHOOTING**

### **Backend Issues**

**Problem**: Database connection fails
**Solution**: Check `DATABASE_URL` in Railway variables. Make sure it's using the PostgreSQL service variable.

**Problem**: Migrations don't run
**Solution**: Run manually in Railway:
```bash
alembic upgrade head
```

**Problem**: CORS errors
**Solution**: Add your Vercel URL to CORS origins in `main.py`

### **Frontend Issues**

**Problem**: API calls fail
**Solution**: Check `NEXT_PUBLIC_API_URL` in Vercel environment variables

**Problem**: Build fails
**Solution**: Check build logs in Vercel. Make sure all dependencies are in `package.json`

---

## 💰 **COST ESTIMATE**

### **Railway + Vercel (Recommended)**
- **Railway**: $10-15/month (backend + PostgreSQL)
- **Vercel**: $0 (free tier is generous)
- **Total**: ~$10-15/month

### **Render Only (Budget)**
- **Render**: $0 (free tier)
- **Total**: $0/month
- **Note**: Slow cold starts, PostgreSQL expires after 90 days

---

## 📚 **NEXT STEPS**

1. ✅ Fix signup/login bug (DONE - just fixed)
2. ⏳ Deploy backend to Railway
3. ⏳ Deploy frontend to Vercel
4. ⏳ Test end-to-end
5. ⏳ Set up custom domain (optional)
6. ⏳ Set up monitoring (optional)

---

**Ready to deploy? Follow the steps above and let me know if you encounter any issues!**

