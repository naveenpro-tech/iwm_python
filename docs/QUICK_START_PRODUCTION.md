# ⚡ Movie Madders - Quick Start Production Setup

**Your deployments are LIVE! Follow these steps to make them work together.**

---

## 🎯 3 Critical Steps (Do These Now!)

### ✅ Step 1: Configure Frontend to Connect to Backend (5 minutes)

**Go to Vercel:**
1. Visit: https://vercel.com/dashboard
2. Click on your project: `iwm-python`
3. Go to: **Settings** → **Environment Variables**
4. Add this variable:

```
Name: NEXT_PUBLIC_API_BASE_URL
Value: https://iwm-python.onrender.com
Environment: Production
```

5. Click **"Save"**
6. Go to **Deployments** tab
7. Click **"Redeploy"** on the latest deployment
8. Wait 2-3 minutes for redeploy to complete

---

### ✅ Step 2: Initialize Database (5 minutes)

**Go to Render:**
1. Visit: https://dashboard.render.com
2. Click on your web service (backend)
3. Click **"Shell"** tab (top right)
4. Wait for shell to connect
5. Run these commands:

```bash
cd apps/backend
alembic upgrade head
```

6. Wait for migrations to complete (you'll see "Running upgrade..." messages)
7. Type `exit` to close the shell

---

### ✅ Step 3: Configure CORS (2 minutes)

**Still in Render Dashboard:**
1. Click **"Environment"** tab
2. Find or add: `CORS_ORIGINS`
3. Set value to:

```json
["https://iwm-python.vercel.app","https://moviemadders.com","https://moviemadders.in"]
```

4. Click **"Save Changes"**
5. Service will auto-redeploy (wait 2-3 minutes)

---

## 🧪 Test Your Deployment

After completing the 3 steps above:

1. **Visit:** https://iwm-python.vercel.app/
2. **Click:** "Sign Up" button
3. **Create:** A new account
4. **Try:** Browsing movies

**If everything works:** ✅ You're done!

**If you see errors:** Check the troubleshooting section below.

---

## 🐛 Quick Troubleshooting

### Error: "Network Error" or "Failed to fetch"

**Cause:** Frontend not configured to use backend

**Fix:**
- Make sure you set `NEXT_PUBLIC_API_BASE_URL=https://iwm-python.onrender.com`
- Make sure you clicked "Redeploy" in Vercel
- Wait for redeploy to complete (2-3 minutes)

### Error: "CORS policy" in browser console

**Cause:** Backend not allowing requests from Vercel

**Fix:**
- Make sure `CORS_ORIGINS` includes `https://iwm-python.vercel.app`
- Make sure you saved changes in Render
- Wait for backend to redeploy (2-3 minutes)

### Error: "500 Internal Server Error"

**Cause:** Database not initialized

**Fix:**
- Run migrations: `cd apps/backend && alembic upgrade head`
- Check Render logs for database connection errors

### Error: "Service Unavailable" or slow first load

**Cause:** Render free tier sleeps after 15 minutes

**Fix:**
- Wait 30-60 seconds for service to wake up
- Consider upgrading to Starter plan ($7/month) for no sleep time

---

## 🎉 What's Next?

After your deployment is working:

### Immediate (Today)
- [ ] Create your admin account
- [ ] Test all major features
- [ ] Check for any errors in logs

### Short-term (This Week)
- [ ] Configure custom domains (moviemadders.com, moviemadders.in)
- [ ] Add TMDB API key for movie data
- [ ] Add Gemini API key for AI features
- [ ] Set up monitoring/alerts

### Medium-term (This Month)
- [ ] Upgrade from free tier if needed
- [ ] Set up automated backups
- [ ] Configure analytics
- [ ] Invite beta testers

---

## 📋 Environment Variables Checklist

### Frontend (Vercel) - Required

```bash
NEXT_PUBLIC_API_BASE_URL=https://iwm-python.onrender.com  # ⚠️ CRITICAL
NEXT_PUBLIC_APP_NAME=Movie Madders
NEXT_PUBLIC_APP_URL=https://iwm-python.vercel.app
NEXT_PUBLIC_BETA_VERSION=true
NEXT_PUBLIC_VERSION=0.1.0-beta
```

### Backend (Render) - Required

```bash
ENV=production
DATABASE_URL=<auto-set-by-render>
JWT_SECRET_KEY=<generate-with-command-below>
CORS_ORIGINS=["https://iwm-python.vercel.app"]  # ⚠️ CRITICAL
```

**Generate JWT Secret:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## 🔗 Quick Links

- **Frontend:** https://iwm-python.vercel.app/
- **Backend:** https://iwm-python.onrender.com
- **Backend Health:** https://iwm-python.onrender.com/api/v1/health
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com

---

## 📞 Need Help?

See the full guide: `docs/PRODUCTION_SETUP_GUIDE.md`

---

**Status:** Ready to Configure  
**Time to Complete:** ~15 minutes  
**Difficulty:** Easy

