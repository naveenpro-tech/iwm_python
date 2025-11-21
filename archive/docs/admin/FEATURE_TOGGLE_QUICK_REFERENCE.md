# 🚀 Feature Toggle System - Quick Reference Card

**Last Updated**: 2025-01-15  
**Version**: 1.0.0

---

## 📍 Quick Access URLs

| Page | URL | Purpose |
|------|-----|---------|
| **Homepage** | `http://localhost:3000` | Test default features |
| **Admin Panel** | `http://localhost:3000/admin/system` | Toggle features |
| **Settings** | `http://localhost:3000/settings` | Test settings tabs |
| **Login** | `http://localhost:3000/login` | Admin authentication |
| **API Health** | `http://localhost:8000/api/v1/health` | Check backend |
| **Feature Flags API** | `http://localhost:8000/api/v1/feature-flags` | Public flags |

---

## 🎯 How to Toggle a Feature (3 Steps)

### **Step 1: Navigate to Admin Panel**
```
URL: http://localhost:3000/admin/system
Scroll to: "Feature Management" section (top of page)
```

### **Step 2: Toggle Feature**
```
1. Click category tab (e.g., "Content Features")
2. Find feature (e.g., "Pulse")
3. Click toggle switch (ON → OFF or OFF → ON)
4. Yellow highlight appears (pending change)
```

### **Step 3: Save Changes**
```
1. Click "Save Changes" button
2. Wait for success notification
3. Refresh any page to see changes
```

---

## 📊 Feature Categories Overview

| Category | Count | Examples |
|----------|-------|----------|
| **Core Navigation** | 4 | Home, Explore, Movies, Search |
| **Content Features** | 10 | Pulse, Cricket, Visual Treats, Awards |
| **Community Features** | 3 | Pulse, Talent Hub, Industry Hub |
| **Personal Features** | 5 | Profile, Watchlist, Favorites |
| **Critic Features** | 4 | Critics Directory, Applications |
| **Discovery Features** | 4 | Compare Movies, Recent Views |
| **Settings Features** | 10 | Profile, Account, Privacy, Roles |
| **Support Features** | 2 | Help Center, Landing Page |
| **Review Features** | 2 | Reviews, Movie Reviews |
| **TOTAL** | **44** | All features toggleable |

---

## 🔍 Default Feature States

### **Enabled by Default (20 features)**:
✅ Core Navigation: Home, Explore, Movies, Search  
✅ Personal: Profile, Watchlist, Favorites, Collections, Notifications  
✅ Settings: Profile, Account, Privacy, Display, Preferences, Notifications  
✅ Content: Awards, Festivals, Box Office  
✅ Support: Help Center, Landing Page  

### **Disabled by Default (24 features)**:
❌ Content: Pulse, Cricket, Visual Treats, Scene Explorer, Movie Calendar, Quiz, People, TV Shows  
❌ Community: Pulse, Talent Hub, Industry Hub  
❌ Critic: All 4 features  
❌ Discovery: All 4 features  
❌ Settings: Roles, Critic, Talent, Industry  
❌ Review: All 2 features  

---

## 🧪 Quick Test Scenarios

### **Scenario 1: Hide Pulse from Navigation**
```
1. Go to /admin/system
2. Click "Community Features" tab
3. Toggle "Pulse" OFF
4. Click "Save Changes"
5. Refresh homepage
6. Result: Pulse disappears from navigation
```

### **Scenario 2: Enable Cricket**
```
1. Go to /admin/system
2. Click "Content Features" tab
3. Toggle "Cricket" ON
4. Click "Save Changes"
5. Refresh homepage
6. Result: Cricket appears in navigation
```

### **Scenario 3: Hide Settings Roles Tab**
```
1. Go to /admin/system
2. Click "Settings Features" tab
3. Toggle "Settings - Roles" OFF
4. Click "Save Changes"
5. Go to /settings and refresh
6. Result: Roles tab disappears
```

### **Scenario 4: Bulk Update (3 features)**
```
1. Go to /admin/system
2. Toggle "Cricket" OFF
3. Toggle "Visual Treats" OFF
4. Toggle "Scene Explorer" OFF
5. Click "Save Changes" (saves all 3)
6. Refresh homepage
7. Result: All 3 features hidden
```

---

## 🔧 Troubleshooting

### **Problem: Changes don't appear**
**Solution**:
1. ✅ Did you click "Save Changes"?
2. ✅ Did you refresh the page (F5)?
3. ✅ Check browser console for errors (F12)
4. ✅ Clear localStorage and try again

### **Problem: Save button doesn't work**
**Solution**:
1. ✅ Check if backend is running (port 8000)
2. ✅ Check browser console for API errors
3. ✅ Verify you're logged in as admin
4. ✅ Try refreshing the admin page

### **Problem: Features still visible after disabling**
**Solution**:
1. ✅ Hard refresh (Ctrl+Shift+R)
2. ✅ Clear browser cache
3. ✅ Clear localStorage (`feature_flags_cache`)
4. ✅ Check database: `SELECT * FROM feature_flags WHERE feature_key='pulse'`

### **Problem: Can't access admin panel**
**Solution**:
1. ✅ Verify you're logged in
2. ✅ Verify your account has admin role
3. ✅ Check URL: `http://localhost:3000/admin/system`
4. ✅ Check browser console for errors

---

## 🗄️ Database Queries

### **Check all features**:
```sql
SELECT feature_key, is_enabled, category 
FROM feature_flags 
ORDER BY category, display_order;
```

### **Check enabled features**:
```sql
SELECT feature_key, feature_name 
FROM feature_flags 
WHERE is_enabled = true;
```

### **Count by category**:
```sql
SELECT category, COUNT(*) as total, 
       SUM(CASE WHEN is_enabled THEN 1 ELSE 0 END) as enabled
FROM feature_flags 
GROUP BY category;
```

### **Manually enable a feature**:
```sql
UPDATE feature_flags 
SET is_enabled = true 
WHERE feature_key = 'pulse';
```

### **Reset all to defaults**:
```sql
-- Run the migration again
-- Or manually update based on FEATURE_INVENTORY.md
```

---

## 🔑 API Endpoints

### **Public Endpoint (No Auth)**:
```bash
curl http://localhost:8000/api/v1/feature-flags
```
**Response**:
```json
{
  "flags": {
    "home": true,
    "explore": true,
    "pulse": false,
    ...
  }
}
```

### **Admin Endpoint (Requires Auth)**:
```bash
curl http://localhost:8000/api/v1/admin/feature-flags \
  -H "Cookie: session=YOUR_SESSION"
```

### **Update Single Feature**:
```bash
curl -X PUT http://localhost:8000/api/v1/admin/feature-flags/pulse \
  -H "Cookie: session=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"is_enabled": true}'
```

### **Bulk Update**:
```bash
curl -X PUT http://localhost:8000/api/v1/admin/feature-flags/bulk \
  -H "Cookie: session=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {"feature_key": "pulse", "is_enabled": true},
      {"feature_key": "cricket", "is_enabled": false}
    ]
  }'
```

---

## 📱 Testing Checklist (Quick)

**Before Testing**:
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Logged in as admin

**Basic Test**:
- [ ] Open `/admin/system`
- [ ] Toggle 1 feature OFF
- [ ] Save changes
- [ ] Refresh homepage
- [ ] Verify feature hidden
- [ ] Toggle feature back ON
- [ ] Verify feature visible

**Advanced Test**:
- [ ] Toggle 3+ features
- [ ] Save all at once
- [ ] Verify all changes
- [ ] Test on mobile view
- [ ] Test on desktop view
- [ ] Test settings tabs

---

## 💡 Pro Tips

1. **Use Refresh Button**: Discard unsaved changes by clicking "Refresh"
2. **Yellow = Pending**: Yellow highlight means change not saved yet
3. **Cache = 5 Minutes**: Feature flags cached for 5 minutes in localStorage
4. **Page Refresh Required**: Changes don't apply in real-time (refresh needed)
5. **Bulk Save**: Toggle multiple features before saving to save time
6. **Test Both Views**: Always test mobile AND desktop navigation
7. **Check Console**: F12 → Console for any errors
8. **Database Direct**: Can manually update database if needed

---

## 📞 Support

**Documentation**:
- Full Guide: `docs/admin/FEATURE_TOGGLE_IMPLEMENTATION_COMPLETE.md`
- Feature List: `docs/admin/FEATURE_INVENTORY.md`
- Testing Guide: `docs/admin/FEATURE_TOGGLE_TESTING_GUIDE.md`
- Manual Checklist: `docs/admin/FEATURE_TOGGLE_MANUAL_TEST_CHECKLIST.md`

**Common Issues**:
- Changes not saving → Check backend logs
- Features still visible → Clear cache and refresh
- Can't access admin → Verify admin role
- API errors → Check network tab in DevTools

---

**Happy Toggling! 🎉**


