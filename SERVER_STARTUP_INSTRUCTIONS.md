# 🚀 SERVER STARTUP INSTRUCTIONS

## ⚠️ CURRENT STATUS

**Backend Server:** ❌ NOT RUNNING  
**Frontend Server:** ❌ NOT RUNNING

I attempted to start the servers automatically but encountered issues with terminal output capture. Please follow the manual startup instructions below.

---

## 📋 MANUAL STARTUP INSTRUCTIONS

### **STEP 1: Start Backend Server**

Open a **NEW terminal window** and run:

```bash
cd c:\iwm\v142\apps\backend
.venv\Scripts\activate
uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

**Expected Output:**
```
INFO:     Will watch for changes in these directories: ['C:\\iwm\\v142\\apps\\backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [XXXXX] using WatchFiles
INFO:     Started server process [XXXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Verify Backend is Running:**
- Open browser: http://localhost:8000/docs
- You should see the FastAPI Swagger UI

---

### **STEP 2: Start Frontend Server**

Open **ANOTHER NEW terminal window** and run:

```bash
cd c:\iwm\v142
bun run dev
```

**Expected Output:**
```
  ▲ Next.js 15.2.4
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Starting...
 ✓ Ready in 2.3s
```

**Verify Frontend is Running:**
- Open browser: http://localhost:3000
- You should see the IWM homepage

---

## 🧪 STEP 3: Test Watchlist Status Feature

Once both servers are running, follow these steps:

### **Option A: Manual GUI Testing**

1. **Login:**
   - Go to http://localhost:3000/login
   - Email: `user1@iwm.com`
   - Password: `rmrnn0077`

2. **Navigate to Watchlist:**
   - Go to http://localhost:3000/profile/user1?section=watchlist
   - OR click your profile → Watchlist tab

3. **Test Status Updates:**
   - Hover over any movie card
   - Click the **status dropdown** (appears on hover)
   - Select "Watching"
   - Verify toast notification appears
   - Change to "Watched"
   - Refresh page (F5)
   - Verify status persisted

4. **Test Remove:**
   - Hover over a movie card
   - Click the **red X button**
   - Confirm removal
   - Verify movie removed from list

### **Option B: Automated E2E Testing**

Open a **THIRD terminal window** and run:

```bash
cd c:\iwm\v142
npx playwright test tests/e2e/watchlist-status-update.spec.ts --headed
```

This will:
- Open a browser automatically
- Login as user1
- Navigate to watchlist
- Test status changes (Plan to Watch → Watching → Watched)
- Test removal
- Capture 13 screenshots in `test-artifacts/watchlist-status/`
- Report results

---

## 🔍 TROUBLESHOOTING

### Backend Won't Start

**Error: "Address already in use"**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace XXXX with PID)
taskkill /PID XXXX /F

# Restart backend
cd c:\iwm\v142\apps\backend
.venv\Scripts\activate
uvicorn src.main:app --reload
```

**Error: "ModuleNotFoundError"**
```bash
# Reinstall dependencies
cd c:\iwm\v142\apps\backend
.venv\Scripts\activate
pip install -r requirements.txt
```

**Error: "Database connection failed"**
```bash
# Check if PostgreSQL is running
# Default port: 5433 (as per .env file)
# Start PostgreSQL service if needed
```

### Frontend Won't Start

**Error: "Port 3000 already in use"**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace XXXX with PID)
taskkill /PID XXXX /F

# Restart frontend
cd c:\iwm\v142
bun run dev
```

**Error: "Module not found"**
```bash
# Reinstall dependencies
cd c:\iwm\v142
bun install
```

### E2E Tests Fail

**Error: "Playwright not installed"**
```bash
npx playwright install
```

**Error: "Connection refused"**
- Make sure BOTH backend and frontend are running
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

---

## 📊 EXPECTED TEST RESULTS

### Successful Test Output:
```
Running 2 tests using 1 worker

  ✓  1 watchlist-status-update.spec.ts:26:3 › update watchlist item status (15s)
  ✓  2 watchlist-status-update.spec.ts:95:3 › remove movie from watchlist (8s)

  2 passed (23s)
```

### Screenshots Generated:
```
test-artifacts/watchlist-status/
├── 01-watchlist-page.png
├── 02-watchlist-loaded.png
├── 03-hover-revealed.png
├── 04-dropdown-opened.png
├── 05-status-changed-to-watching.png
├── 06-verify-status-changed.png
├── 07-status-changed-to-watched.png
├── 08-after-reload.png
├── 09-status-persisted.png
├── remove-01-initial.png
├── remove-02-hover.png
├── remove-03-after-remove.png
└── remove-04-final.png
```

---

## ✅ SUCCESS CRITERIA

You'll know everything is working when:

1. ✅ Backend shows "Application startup complete" in terminal
2. ✅ Frontend shows "Ready in X.Xs" in terminal
3. ✅ http://localhost:8000/docs loads (Swagger UI)
4. ✅ http://localhost:3000 loads (IWM homepage)
5. ✅ You can login with user1@iwm.com
6. ✅ Watchlist page loads with movies
7. ✅ Status dropdown appears on hover
8. ✅ Status changes work and persist
9. ✅ Toast notifications appear
10. ✅ E2E tests pass with 2/2 tests

---

## 📝 NEXT STEPS AFTER VERIFICATION

Once you've verified the watchlist status feature works:

1. **Report Results:**
   - Take screenshots of the working feature
   - Note any issues or bugs
   - Check console for errors

2. **Review Audit Report:**
   - See `COMPREHENSIVE_MOVIE_FEATURE_AUDIT.md`
   - Review all movie-related features
   - Identify missing E2E tests

3. **Plan Next Features:**
   - Collections CRUD testing
   - Favorites testing
   - Review edit/delete testing
   - Additional E2E coverage

---

## 🆘 NEED HELP?

If you encounter issues:

1. Check terminal output for error messages
2. Check browser console (F12) for JavaScript errors
3. Verify database is running (PostgreSQL on port 5433)
4. Verify .env files exist and are correct
5. Try restarting both servers

**Common Issues:**
- Database not running → Start PostgreSQL
- Port conflicts → Kill processes using ports 3000/8000
- Missing dependencies → Run `pip install -r requirements.txt` and `bun install`
- Environment variables → Check `apps/backend/.env` exists

---

**Generated By:** Augment Agent  
**Date:** 2025-10-27  
**Status:** Awaiting Manual Server Startup

