# 🧪 Feature Toggle System - Testing Guide

**Status**: ✅ READY FOR TESTING  
**Date**: 2025-01-15  
**Servers**: Backend (127.0.0.1:8000) + Frontend (localhost:3000) RUNNING

---

## 🚀 Quick Start

### **1. Access Admin Panel**
```
URL: http://localhost:3000/admin/system
Login: Use your admin credentials
```

### **2. Navigate to Feature Management**
- Scroll to the top of the System Management page
- You'll see "Feature Management" section with category tabs

### **3. Test Basic Toggle**
1. Click on "Content Features" tab
2. Find "Pulse" feature
3. Toggle it OFF
4. Click "Save Changes"
5. Refresh the page
6. Check navigation - Pulse should be hidden

---

## 📋 Comprehensive Test Plan

### **Test 1: Admin UI Functionality**

**Objective**: Verify admin interface works correctly

**Steps**:
1. ✅ Navigate to `/admin/system`
2. ✅ Verify Feature Management section appears at top
3. ✅ Click through all 9 category tabs
4. ✅ Verify all 44 features are listed
5. ✅ Toggle a feature ON/OFF
6. ✅ Verify yellow highlight appears (pending change)
7. ✅ Click "Save Changes"
8. ✅ Verify success message appears
9. ✅ Click "Refresh" button
10. ✅ Verify changes persist

**Expected Results**:
- All tabs load without errors
- Toggles respond immediately
- Pending changes are tracked
- Save operation succeeds
- Changes persist after refresh

---

### **Test 2: Navigation Filtering (Mobile)**

**Objective**: Verify mobile navigation updates based on flags

**Steps**:
1. ✅ Disable "Pulse" feature in admin
2. ✅ Save changes
3. ✅ Open mobile view (resize browser to <768px)
4. ✅ Check bottom navigation - Pulse should be hidden
5. ✅ Click "More" button
6. ✅ Verify Pulse is not in the menu overlay
7. ✅ Re-enable "Pulse" feature
8. ✅ Save and refresh
9. ✅ Verify Pulse reappears in navigation

**Expected Results**:
- Disabled features disappear from bottom nav
- Disabled features disappear from menu overlay
- Re-enabled features reappear immediately

---

### **Test 3: Navigation Filtering (Desktop)**

**Objective**: Verify desktop navigation updates based on flags

**Steps**:
1. ✅ Disable "Cricket" feature in admin
2. ✅ Save changes
3. ✅ Open desktop view (browser width >768px)
4. ✅ Check top navigation - Cricket should be hidden
5. ✅ Re-enable "Cricket" feature
6. ✅ Save and refresh
7. ✅ Verify Cricket reappears in top nav

**Expected Results**:
- Disabled features disappear from top nav
- Re-enabled features reappear immediately
- No broken links or errors

---

### **Test 4: Settings Tabs Filtering**

**Objective**: Verify settings tabs show/hide based on flags

**Steps**:
1. ✅ Navigate to `/settings`
2. ✅ Verify "Roles" tab is visible
3. ✅ Go to admin and disable "settings_roles"
4. ✅ Save changes
5. ✅ Return to `/settings` and refresh
6. ✅ Verify "Roles" tab is hidden
7. ✅ Re-enable "settings_roles"
8. ✅ Refresh `/settings`
9. ✅ Verify "Roles" tab reappears

**Expected Results**:
- Disabled tabs disappear from settings
- Re-enabled tabs reappear
- Tab count updates correctly
- Grid layout adjusts properly

---

### **Test 5: Bulk Update**

**Objective**: Verify bulk update functionality

**Steps**:
1. ✅ Toggle 5+ features in different categories
2. ✅ Verify all pending changes are highlighted
3. ✅ Click "Save Changes"
4. ✅ Verify success message
5. ✅ Refresh page
6. ✅ Verify all changes persisted

**Expected Results**:
- Multiple changes tracked correctly
- Bulk save succeeds
- All changes persist
- No partial updates

---

### **Test 6: API Endpoints**

**Objective**: Verify backend API works correctly

**Public Endpoint**:
```bash
curl http://localhost:8000/api/v1/feature-flags
```

**Expected Response**:
```json
{
  "flags": {
    "home": true,
    "explore": true,
    "movies": true,
    "pulse": false,
    ...
  }
}
```

**Admin Endpoint** (requires auth):
```bash
curl http://localhost:8000/api/v1/admin/feature-flags \
  -H "Cookie: session=YOUR_SESSION_COOKIE"
```

**Expected Response**:
```json
{
  "total": 44,
  "flags": [
    {
      "id": 1,
      "feature_key": "home",
      "feature_name": "Homepage",
      "is_enabled": true,
      "category": "Core Navigation",
      "description": "Main homepage with movie sections",
      "display_order": 1,
      ...
    },
    ...
  ]
}
```

---

### **Test 7: Caching Behavior**

**Objective**: Verify localStorage caching works

**Steps**:
1. ✅ Open browser DevTools → Application → Local Storage
2. ✅ Find key: `feature_flags_cache`
3. ✅ Verify it contains flags and timestamp
4. ✅ Refresh page within 5 minutes
5. ✅ Verify no API call is made (check Network tab)
6. ✅ Wait 5+ minutes
7. ✅ Refresh page
8. ✅ Verify API call is made to refresh cache

**Expected Results**:
- Cache is created on first load
- Cache is used for 5 minutes
- Cache expires after 5 minutes
- Fresh data fetched after expiry

---

### **Test 8: Error Handling**

**Objective**: Verify error handling works

**Steps**:
1. ✅ Stop backend server
2. ✅ Try to save changes in admin
3. ✅ Verify error message appears
4. ✅ Restart backend server
5. ✅ Try to save again
6. ✅ Verify success message appears

**Expected Results**:
- Clear error messages on failure
- Graceful degradation
- Recovery after server restart

---

### **Test 9: Permission Checks**

**Objective**: Verify non-admin users can't modify flags

**Steps**:
1. ✅ Login as non-admin user
2. ✅ Try to access `/admin/system`
3. ✅ Verify access denied or redirect
4. ✅ Try to call admin API directly
5. ✅ Verify 403 Forbidden response

**Expected Results**:
- Non-admin users blocked from admin panel
- API returns 403 for non-admin users
- Public endpoint accessible to all

---

### **Test 10: Feature Combinations**

**Objective**: Test multiple features disabled simultaneously

**Steps**:
1. ✅ Disable all "Content Features" (10 features)
2. ✅ Save changes
3. ✅ Verify navigation updates correctly
4. ✅ Verify no broken links
5. ✅ Re-enable all features
6. ✅ Verify everything works

**Expected Results**:
- Multiple features can be disabled
- Navigation adapts correctly
- No errors or broken links
- Re-enabling works smoothly

---

## 🐛 Known Issues & Limitations

### **Current Limitations**:
1. **Page Refresh Required**: Changes don't apply in real-time; users must refresh the page
2. **No User-Specific Flags**: All users see the same enabled features
3. **No Scheduling**: Can't schedule feature enable/disable for future dates
4. **No A/B Testing**: Can't enable features for specific user segments

### **Future Enhancements**:
- Real-time updates via WebSocket
- Per-user feature flags
- Scheduled feature rollouts
- Usage analytics per feature
- Feature flag history/audit log

---

## ✅ Success Criteria

**All tests pass if**:
- ✅ Admin can toggle any feature on/off
- ✅ Changes persist in database
- ✅ Navigation automatically filters based on flags
- ✅ Settings tabs show/hide correctly
- ✅ No broken links when features disabled
- ✅ API endpoints work correctly
- ✅ Caching improves performance
- ✅ Error handling is graceful
- ✅ Non-admin users blocked from modifications
- ✅ Multiple features can be toggled simultaneously

---

## 📞 Support

**If you encounter issues**:
1. Check browser console for errors
2. Check backend logs for API errors
3. Verify database migration ran successfully
4. Clear localStorage and try again
5. Restart both servers

**Database Verification**:
```sql
-- Check if table exists
SELECT COUNT(*) FROM feature_flags;
-- Should return 44

-- Check enabled features
SELECT feature_key, is_enabled FROM feature_flags WHERE is_enabled = true;
-- Should return 20 enabled features
```

---

**Happy Testing! 🎉**


