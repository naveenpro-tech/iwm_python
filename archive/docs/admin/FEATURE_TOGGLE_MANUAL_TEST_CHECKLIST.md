# 🧪 Feature Toggle System - Manual Testing Checklist

**Date**: 2025-01-15  
**Tester**: _______________  
**Browser**: _______________  
**Status**: 🟡 IN PROGRESS

---

## 📋 Pre-Test Setup

### ✅ Verify Servers Are Running

**Backend Server**:
```
URL: http://localhost:8000
Health Check: http://localhost:8000/api/v1/health
Expected: {"status": "healthy"}
```

**Frontend Server**:
```
URL: http://localhost:3000
Expected: Homepage loads successfully
```

**Status**: 
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Both servers accessible

---

## 🎯 TEST 1: Verify Default State (Before Login)

**Objective**: Confirm that default movie features are visible

### Steps:

1. **Open Homepage**
   - [ ] Navigate to `http://localhost:3000`
   - [ ] Page loads without errors
   - [ ] Homepage displays movie sections

2. **Check Mobile Navigation (Resize to <768px)**
   - [ ] Bottom navigation visible
   - [ ] 4 main items visible: Home, Explore, Movies, More
   - [ ] Click "More" button
   - [ ] Menu overlay opens with grid of features

3. **Check Desktop Navigation (Resize to >768px)**
   - [ ] Top navigation bar visible
   - [ ] Navigation links visible: Movies, TV Shows, People, Critics, Pulse, Cricket
   - [ ] All links are clickable

4. **Test Core Pages**
   - [ ] Click "Home" - loads successfully
   - [ ] Click "Explore" - loads successfully
   - [ ] Click "Movies" - loads successfully
   - [ ] Click "Search" (if visible) - loads successfully

**Expected Results**:
- ✅ All default movie features are visible
- ✅ Navigation works correctly
- ✅ No broken links or errors

**Actual Results**:
```
[Write your observations here]
```

---

## 🔐 TEST 2: Login as Admin

**Objective**: Authenticate as admin user

### Steps:

1. **Navigate to Login Page**
   - [ ] Click on profile icon or navigate to `/login`
   - [ ] Login form appears

2. **Enter Admin Credentials**
   - [ ] Enter username/email: _______________
   - [ ] Enter password: _______________
   - [ ] Click "Login" button

3. **Verify Successful Login**
   - [ ] Redirected to homepage or dashboard
   - [ ] Profile icon shows logged-in state
   - [ ] Admin menu items visible (if applicable)

**Expected Results**:
- ✅ Login successful
- ✅ Admin access granted
- ✅ Can access admin pages

**Actual Results**:
```
[Write your observations here]
```

---

## ⚙️ TEST 3: Access Feature Toggle Admin Panel

**Objective**: Navigate to feature management interface

### Steps:

1. **Navigate to Admin System Page**
   - [ ] Go to `/admin/system`
   - [ ] Page loads successfully
   - [ ] "Feature Management" section visible at top

2. **Verify Category Tabs**
   - [ ] "Core Navigation" tab visible
   - [ ] "Content Features" tab visible
   - [ ] "Community Features" tab visible
   - [ ] "Personal Features" tab visible
   - [ ] "Critic Features" tab visible
   - [ ] "Discovery Features" tab visible
   - [ ] "Settings Features" tab visible
   - [ ] "Support Features" tab visible
   - [ ] "Review Features" tab visible

3. **Click Through Each Tab**
   - [ ] Core Navigation (4 features)
   - [ ] Content Features (10 features)
   - [ ] Community Features (3 features)
   - [ ] Personal Features (5 features)
   - [ ] Critic Features (4 features)
   - [ ] Discovery Features (4 features)
   - [ ] Settings Features (10 features)
   - [ ] Support Features (2 features)
   - [ ] Review Features (2 features)

**Expected Results**:
- ✅ All 9 tabs load correctly
- ✅ Total of 44 features visible
- ✅ Each feature has a toggle switch
- ✅ Current state (ON/OFF) is visible

**Actual Results**:
```
[Write your observations here]
```

---

## 🔄 TEST 4: Toggle Single Feature OFF

**Objective**: Disable a feature and verify it disappears from navigation

### Steps:

1. **Select Feature to Disable**
   - [ ] Click "Community Features" tab
   - [ ] Find "Pulse" feature
   - [ ] Note current state: ON ✅ / OFF ❌

2. **Toggle Feature OFF**
   - [ ] Click toggle switch to turn OFF
   - [ ] Toggle turns gray/red
   - [ ] Yellow highlight appears (pending change)
   - [ ] "Save Changes" button becomes active

3. **Save Changes**
   - [ ] Click "Save Changes" button
   - [ ] Wait for notification
   - [ ] Success message appears: "Feature flags updated successfully"

4. **Verify Change in Navigation**
   - [ ] Navigate to homepage (`/`)
   - [ ] Refresh the page (F5 or Ctrl+R)
   - [ ] Check mobile navigation (bottom nav + More menu)
   - [ ] Check desktop navigation (top nav)
   - [ ] Confirm "Pulse" is NOT visible

5. **Test Direct Access**
   - [ ] Try to navigate to `/pulse` directly
   - [ ] Page should still load (feature hidden, not blocked)

**Expected Results**:
- ✅ Toggle switch changes state
- ✅ Pending change highlighted
- ✅ Save succeeds with notification
- ✅ "Pulse" disappears from navigation
- ✅ No errors or broken links

**Actual Results**:
```
Feature: Pulse
Initial State: ON / OFF
After Toggle: ON / OFF
Navigation Updated: YES / NO
Errors: YES / NO
Notes: [Write any observations]
```

---

## 🔄 TEST 5: Toggle Feature Back ON

**Objective**: Re-enable the feature and verify it reappears

### Steps:

1. **Return to Admin Panel**
   - [ ] Navigate to `/admin/system`
   - [ ] Click "Community Features" tab
   - [ ] Find "Pulse" feature

2. **Toggle Feature ON**
   - [ ] Click toggle switch to turn ON
   - [ ] Toggle turns green/blue
   - [ ] Yellow highlight appears
   - [ ] Click "Save Changes"

3. **Verify Change**
   - [ ] Navigate to homepage
   - [ ] Refresh the page
   - [ ] Check navigation menus
   - [ ] Confirm "Pulse" IS visible again

**Expected Results**:
- ✅ Feature re-enabled successfully
- ✅ "Pulse" reappears in navigation
- ✅ Everything works as before

**Actual Results**:
```
[Write your observations here]
```

---

## 🔄 TEST 6: Toggle Multiple Features (Bulk Update)

**Objective**: Test bulk update functionality

### Steps:

1. **Select Multiple Features to Toggle**
   - [ ] Click "Content Features" tab
   - [ ] Toggle "Cricket" OFF
   - [ ] Toggle "Visual Treats" OFF
   - [ ] Toggle "Scene Explorer" OFF
   - [ ] Verify 3 yellow highlights appear

2. **Save All Changes**
   - [ ] Click "Save Changes" button
   - [ ] Wait for success notification
   - [ ] All highlights should disappear

3. **Verify All Changes**
   - [ ] Refresh homepage
   - [ ] Check navigation
   - [ ] Confirm all 3 features are hidden

4. **Re-enable All Features**
   - [ ] Return to admin panel
   - [ ] Toggle all 3 features back ON
   - [ ] Save changes
   - [ ] Verify all reappear

**Expected Results**:
- ✅ Multiple toggles tracked correctly
- ✅ Bulk save succeeds
- ✅ All changes persist
- ✅ Navigation updates correctly

**Actual Results**:
```
Features Toggled: Cricket, Visual Treats, Scene Explorer
All Saved: YES / NO
All Hidden: YES / NO
All Restored: YES / NO
Notes: [Write any observations]
```

---

## 🔄 TEST 7: Test Settings Tabs Filtering

**Objective**: Verify settings tabs show/hide based on flags

### Steps:

1. **Check Current Settings Page**
   - [ ] Navigate to `/settings`
   - [ ] Count visible tabs
   - [ ] Note which tabs are visible

2. **Disable "Roles" Tab**
   - [ ] Go to `/admin/system`
   - [ ] Click "Settings Features" tab
   - [ ] Find "Settings - Roles" feature
   - [ ] Toggle OFF
   - [ ] Save changes

3. **Verify Tab Hidden**
   - [ ] Navigate to `/settings`
   - [ ] Refresh page
   - [ ] Confirm "Roles" tab is NOT visible
   - [ ] Count tabs (should be 1 less)

4. **Re-enable Tab**
   - [ ] Return to admin panel
   - [ ] Toggle "Settings - Roles" back ON
   - [ ] Save changes
   - [ ] Verify "Roles" tab reappears

**Expected Results**:
- ✅ Roles tab disappears when disabled
- ✅ Roles tab reappears when enabled
- ✅ Other tabs unaffected

**Actual Results**:
```
[Write your observations here]
```

---

## 🔄 TEST 8: Test Refresh Functionality

**Objective**: Verify "Refresh" button reloads data from server

### Steps:

1. **Make Changes Without Saving**
   - [ ] Toggle 2-3 features
   - [ ] Do NOT click "Save Changes"
   - [ ] Note pending changes (yellow highlights)

2. **Click Refresh Button**
   - [ ] Click "Refresh" button
   - [ ] Wait for data to reload
   - [ ] Verify pending changes are discarded
   - [ ] Toggles return to saved state

**Expected Results**:
- ✅ Refresh discards unsaved changes
- ✅ Toggles reset to database state
- ✅ No errors

**Actual Results**:
```
[Write your observations here]
```

---

## 🔄 TEST 9: Test Cache Behavior

**Objective**: Verify localStorage caching works

### Steps:

1. **Check Initial Load**
   - [ ] Open DevTools (F12)
   - [ ] Go to Application → Local Storage
   - [ ] Find key: `feature_flags_cache`
   - [ ] Note timestamp

2. **Refresh Within 5 Minutes**
   - [ ] Refresh the page
   - [ ] Go to Network tab
   - [ ] Check if `/api/v1/feature-flags` is called
   - [ ] Should NOT be called (using cache)

3. **Clear Cache and Refresh**
   - [ ] Delete `feature_flags_cache` from localStorage
   - [ ] Refresh page
   - [ ] Check Network tab
   - [ ] Should see API call to `/api/v1/feature-flags`

**Expected Results**:
- ✅ Cache created on first load
- ✅ Cache used for 5 minutes
- ✅ API called when cache cleared

**Actual Results**:
```
[Write your observations here]
```

---

## 🔄 TEST 10: Test Error Handling

**Objective**: Verify graceful error handling

### Steps:

1. **Stop Backend Server**
   - [ ] Go to terminal running backend
   - [ ] Press Ctrl+C to stop server

2. **Try to Save Changes**
   - [ ] Toggle a feature in admin panel
   - [ ] Click "Save Changes"
   - [ ] Wait for response

3. **Verify Error Message**
   - [ ] Error notification appears
   - [ ] Message is clear and helpful
   - [ ] UI doesn't break

4. **Restart Server and Retry**
   - [ ] Restart backend server
   - [ ] Try saving again
   - [ ] Verify success

**Expected Results**:
- ✅ Clear error message on failure
- ✅ UI remains functional
- ✅ Success after server restart

**Actual Results**:
```
[Write your observations here]
```

---

## 📊 Final Summary

### Test Results

| Test | Status | Notes |
|------|--------|-------|
| 1. Default State | ✅ / ❌ | |
| 2. Admin Login | ✅ / ❌ | |
| 3. Access Admin Panel | ✅ / ❌ | |
| 4. Toggle Feature OFF | ✅ / ❌ | |
| 5. Toggle Feature ON | ✅ / ❌ | |
| 6. Bulk Update | ✅ / ❌ | |
| 7. Settings Tabs | ✅ / ❌ | |
| 8. Refresh Functionality | ✅ / ❌ | |
| 9. Cache Behavior | ✅ / ❌ | |
| 10. Error Handling | ✅ / ❌ | |

### Overall Status
- [ ] All tests passed ✅
- [ ] Some tests failed ⚠️
- [ ] Major issues found ❌

### Issues Found
```
[List any bugs, errors, or unexpected behavior]
```

### Recommendations
```
[Any suggestions for improvements]
```

---

**Testing Completed**: _______________  
**Signature**: _______________


