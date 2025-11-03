# 📱 Mobile Testing Guide - IWM Application

## ✅ SERVERS ARE READY!

Both servers are running with the correct configuration:

- **Backend**: `http://192.168.0.194:8000` ✅
- **Frontend**: `http://192.168.0.194:3000` ✅
- **Health Check**: Working ✅

---

## 🔥 STEP 1: Configure Windows Firewall (REQUIRED)

**Open PowerShell as Administrator** and run:

```powershell
netsh advfirewall firewall add rule name="IWM Python Backend" dir=in action=allow program="C:\iwm\v142\apps\backend\.venv\Scripts\python.exe" enable=yes
```

**Verify it worked**:
```powershell
netsh advfirewall firewall show rule name="IWM Python Backend"
```

---

## 📱 STEP 2: Test on Your Mobile Phone

### Prerequisites:
1. ✅ Mobile phone is on the **same WiFi network** as your computer
2. ✅ Firewall rule has been added (Step 1)
3. ✅ Both servers are running

### Test Backend API:
1. Open mobile browser (Chrome, Safari, etc.)
2. Navigate to: `http://192.168.0.194:8000/api/v1/health`
3. **Expected**: You should see `{"ok":true}`

### Test Frontend App:
1. Open mobile browser
2. Navigate to: `http://192.168.0.194:3000`
3. **Expected**: App loads successfully

### Test API Integration:
1. Try to login or browse movies
2. **Expected**: No "Failed to fetch" errors
3. **Expected**: API calls work smoothly

---

## 🐛 STEP 3: Report Mobile UI Bugs

As you test the app on mobile, note any issues with this format:

### Bug Report Template:
```
Page: [page name]
Issue: [description of the problem]
Expected: [what should happen]
Screenshot: [if possible]
```

### Examples of Issues to Look For:

#### Layout Issues:
- Text overflow or cut-off
- Elements overlapping
- Horizontal scrolling
- Images not fitting screen
- Buttons too small to tap

#### Navigation Issues:
- Menu not opening
- Back button not working
- Links not clickable
- Tabs not switching

#### Form Issues:
- Input fields too small
- Keyboard covering inputs
- Submit buttons not working
- Validation errors not showing

#### Performance Issues:
- Slow loading
- Images not loading
- Infinite loading spinners
- App freezing

#### Functionality Issues:
- Login not working
- Search not working
- Filters not applying
- Data not displaying

---

## 📋 TESTING CHECKLIST

Test these key pages and features:

### Public Pages:
- [ ] Landing page (`/`)
- [ ] Movie detail page (`/movies/[id]`)
- [ ] Movie awards page (`/movies/[id]/awards`)
- [ ] Search functionality
- [ ] Movie filters

### Authentication:
- [ ] Login page (`/login`)
- [ ] Signup page (`/signup`)
- [ ] Logout functionality

### User Features:
- [ ] User profile
- [ ] Watchlist
- [ ] Favorites
- [ ] Reviews

### Admin Features (if you have admin access):
- [ ] Admin dashboard (`/admin`)
- [ ] Movie management (`/admin/movies`)
- [ ] Movie detail edit (`/admin/movies/[id]`)
- [ ] Awards management

---

## 🔍 TROUBLESHOOTING

### Issue: Can't access `http://192.168.0.194:3000`
**Solutions**:
1. Verify both devices are on same WiFi
2. Check IP hasn't changed: `ipconfig | findstr /i "IPv4"`
3. Restart frontend: Kill and run `bun run dev` again

### Issue: "Failed to fetch" errors
**Solutions**:
1. Check firewall rule is added (Step 1)
2. Verify backend is running: `http://192.168.0.194:8000/api/v1/health`
3. Clear mobile browser cache
4. Hard refresh page

### Issue: App loads but looks broken
**Solutions**:
1. Clear mobile browser cache
2. Check browser console for errors (if using Chrome mobile)
3. Try different mobile browser

### Issue: IP address changed
**Solutions**:
1. Check new IP: `ipconfig | findstr /i "IPv4"`
2. Update `.env.local`: `NEXT_PUBLIC_API_BASE_URL=http://[NEW_IP]:8000`
3. Update `apps/backend/.env` CORS_ORIGINS with new IP
4. Restart both servers

---

## 📊 WHAT TO TEST

### Priority 1 (Critical):
1. **Login/Signup** - Can you create account and login?
2. **Movie Browsing** - Can you view movie list and details?
3. **Search** - Does search work?
4. **Navigation** - Can you navigate between pages?

### Priority 2 (Important):
1. **Movie Details** - All tabs working (Overview, Awards, Cast, etc.)?
2. **Filters** - Can you filter movies by genre, year, etc.?
3. **User Profile** - Can you view and edit profile?
4. **Watchlist/Favorites** - Can you add/remove items?

### Priority 3 (Nice to Have):
1. **Reviews** - Can you write and view reviews?
2. **Admin Panel** - All admin features working?
3. **Awards Page** - Filters and statistics working?
4. **Responsive Design** - Everything looks good on mobile?

---

## ✅ CURRENT STATUS

**What's Fixed**:
- ✅ Frontend API base URL updated to network IP
- ✅ CORS configured for mobile access
- ✅ Backend binds to 0.0.0.0 for network access
- ✅ Both servers running successfully
- ✅ Health check verified

**What You Need to Do**:
1. ⏳ Add Windows Firewall rule (Step 1)
2. ⏳ Test on mobile phone (Step 2)
3. ⏳ Report UI bugs (Step 3)

**What I'll Do Next**:
- ⏳ Fix any mobile UI bugs you report
- ⏳ Optimize for mobile responsiveness
- ⏳ Prepare for production deployment

---

## 🚀 READY TO TEST!

Everything is configured and ready. Follow the steps above and let me know what bugs you find!

**Quick Start**:
1. Run firewall command (PowerShell as Admin)
2. Open mobile browser
3. Go to `http://192.168.0.194:3000`
4. Test and report bugs!

Good luck! 🎉

