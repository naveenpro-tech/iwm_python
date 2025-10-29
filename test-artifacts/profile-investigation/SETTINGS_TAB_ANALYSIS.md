# SETTINGS TAB - STEP 1: DEEP CODE ANALYSIS

**Date:** 2025-10-29  
**Tab:** Settings Tab (User Settings)  
**Status:** Analysis Complete

---

## ROOT CAUSE IDENTIFICATION

### Current Implementation (Broken)

**File:** `components/profile/sections/profile-settings.tsx` (lines 21-63)

```typescript
export function ProfileSettings({ userId }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    displayName: "Siddu Kumar",        // Mock data
    username: "siddu-kumar",           // Mock data
    bio: "Film enthusiast...",         // Mock data
    location: "Bangalore, India",      // Mock data
    email: "siddu@example.com",        // Mock data
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,          // Mock data
    pushNotifications: true,           // Mock data
    reviewComments: true,              // Mock data
    newReleases: true,                 // Mock data
    watchlistReleases: true,           // Mock data
    darkMode: true,                    // Mock data
    autoplayTrailers: false,           // Mock data
    language: "english",               // Mock data
    region: "us",                      // Mock data
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted", formData)
    // In a real app, this would send the data to an API
  }
}
```

**Problems:**
1. ❌ All form data is hardcoded mock data
2. ❌ `userId` parameter passed but NOT USED
3. ❌ No API call to fetch settings
4. ❌ No API call to save settings
5. ❌ No error handling
6. ❌ No loading states
7. ❌ No success/failure feedback
8. ❌ Backend endpoints NOT protected with authentication

---

## EXISTING API INFRASTRUCTURE

### Backend Endpoints

**File:** `apps/backend/src/routers/settings.py`

**Endpoints Available:**
- ✅ `GET /api/v1/settings/` - Get all settings
- ✅ `PUT /api/v1/settings/` - Update all settings
- ✅ `GET /api/v1/settings/profile` - Get profile settings
- ✅ `PUT /api/v1/settings/profile` - Update profile settings
- ✅ `GET /api/v1/settings/account` - Get account settings
- ✅ `PUT /api/v1/settings/account` - Update account settings
- ✅ `GET /api/v1/settings/preferences` - Get preferences
- ✅ `PUT /api/v1/settings/preferences` - Update preferences

**Status:** ✅ Endpoints exist but NOT PROTECTED with authentication!

**Security Issue:** All endpoints accept `userId` as query parameter instead of using authenticated user

### Backend Repository

**File:** `apps/backend/src/repositories/settings.py`

**Methods Available:**
- ✅ `get_all(user_external_id)` - Get all settings
- ✅ `update_all(user_external_id, payload)` - Update all settings
- ✅ `get_section(user_external_id, section)` - Get specific section
- ✅ `update_section(user_external_id, section, data)` - Update specific section

**Status:** ✅ Repository methods exist and work!

### Frontend API Client

**File:** `lib/api/profile.ts`

**Status:** ❌ NO settings API functions exist!

---

## DATA STRUCTURE ANALYSIS

### Settings Sections

```typescript
{
  account: {
    name: string
    email: string
    phone: string | null
    avatar: string | null
    bio: string | null
  }
  profile: {
    username: string
    fullName: string
    avatarUrl: string | null
    bio: string
  }
  privacy: {
    profileVisibility: "public" | "private"
    activitySharing: boolean
    messageRequests: "everyone" | "friends" | "none"
    dataDownloadRequested: boolean
  }
  display: {
    theme: "dark" | "light"
    fontSize: "small" | "medium" | "large"
    highContrastMode: boolean
    reduceMotion: boolean
  }
  preferences: {
    language: string
    region: string
    hideSpoilers: boolean
    excludedGenres: string[]
    contentRating: string
  }
  security: {
    twoFactorEnabled: boolean
    loginNotifications: boolean
  }
}
```

---

## IMPLEMENTATION PLAN

### What Needs to Change

#### 1. Backend: Add Authentication to Settings Endpoints

**File:** `apps/backend/src/routers/settings.py`

**Changes:**
- Add `current_user: User = Depends(get_current_user)` to all endpoints
- Remove `userId` query parameter
- Use `current_user.external_id` instead of query parameter

#### 2. Frontend: Create Settings API Client

**File:** `lib/api/settings.ts` (NEW FILE)

**Functions to Create:**
- `getProfileSettings(userId)` - Fetch profile settings
- `updateProfileSettings(userId, data)` - Update profile settings
- `getPreferences(userId)` - Fetch preferences
- `updatePreferences(userId, data)` - Update preferences
- `getAccountSettings(userId)` - Fetch account settings
- `updateAccountSettings(userId, data)` - Update account settings

#### 3. Frontend: Update ProfileSettings Component

**File:** `components/profile/sections/profile-settings.tsx`

**Changes:**
- Add `useEffect` to fetch settings on mount
- Replace mock data with real API data
- Add loading state
- Add error state
- Add success/failure feedback
- Update `handleSubmit` to call API
- Add error handling

---

## FILES TO MODIFY

### Backend

**File:** `apps/backend/src/routers/settings.py`
- **Lines to change:** All endpoints (18-112)
- **Changes:** Add authentication, remove userId parameter
- **Imports to add:** `from ..auth import get_current_user`

### Frontend

**File:** `lib/api/settings.ts` (NEW FILE)
- **Create:** New API client file
- **Functions:** 6 functions (get/update for profile, preferences, account)

**File:** `components/profile/sections/profile-settings.tsx`
- **Lines to change:** 21-63 (state initialization), 59-63 (handleSubmit)
- **Changes:** Add API calls, error handling, loading states
- **Imports to add:** Settings API functions

---

## SUMMARY

**Root Cause:** Component uses hardcoded mock data, backend endpoints not protected

**Solution:** 
1. Fix backend authentication
2. Create frontend API client
3. Update component to use real API

**Complexity:** MEDIUM
- Backend changes needed (add authentication)
- New API client file needed
- Component update needed

**Risk:** MEDIUM
- Backend changes could affect other code
- Need to ensure authentication works
- Need to test all settings sections

**Estimated Time:** 30 minutes (implementation + testing)

---

## NEXT STEP

Proceed to **Step 2: Implement Complete End-to-End Fix**

