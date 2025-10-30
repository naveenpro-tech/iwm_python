# Epic E-3 Phase 3 - Quick Start Guide

## What Was Implemented

### ✅ Role-Specific Settings (Priority 1)
Users can now manage role-specific profiles through dedicated settings tabs:

**Critic Settings Tab:**
- Bio, Twitter URL, Letterboxd URL, Personal Website
- Review visibility (public/private/followers_only)
- Allow comments toggle

**Talent Settings Tab:**
- Stage name, Bio, Headshot URL, Demo Reel URL
- IMDb URL, Agent name, Agent contact
- Years of experience, Availability status

**Industry Pro Settings Tab:**
- Company name, Job title, Bio
- Website URL, IMDb URL, LinkedIn URL
- Years of experience, Accepting projects toggle

### ✅ Role-Based Profile Routing (Priority 2)
Profile navigation now automatically routes to the correct profile based on active role:

- **Movie Lover** → `/profile/{username}`
- **Critic** → `/critic/{username}`
- **Talent** → `/talent-hub/profile/me`
- **Industry Pro** → `/people` (temporary placeholder)

---

## How to Test

### Manual Testing

1. **Start the servers:**
   ```bash
   # Terminal 1: Backend
   cd apps/backend
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   hypercorn src.main:app --reload --bind 127.0.0.1:8000

   # Terminal 2: Frontend
   cd apps/frontend
   bun run dev
   ```

2. **Login and navigate to settings:**
   - Go to http://localhost:3001/login
   - Login with your test account
   - Click profile dropdown → Settings

3. **Test role-specific tabs:**
   - You should see tabs for each role you have (Critic, Talent, Industry)
   - Click each tab to load the form
   - Fill in some data and click Save
   - You should see a success toast notification

4. **Test role-based routing:**
   - Click profile dropdown → Profile
   - You should be routed to the correct profile based on your active role
   - Switch roles and click Profile again
   - You should be routed to the new role's profile

### Automated Testing

**Backend API Tests:**
```bash
cd apps/backend
pytest tests/test_role_settings.py -v
```

**Frontend E2E Tests:**
```bash
cd apps/frontend
npx playwright test tests/e2e/role-settings.spec.ts
npx playwright test tests/e2e/role-based-routing.spec.ts
```

---

## Files Created

### Components (3 files)
- `components/settings/CriticSettings.tsx`
- `components/settings/TalentSettings.tsx`
- `components/settings/IndustryProSettings.tsx`

### Utilities (3 files)
- `utils/api/roles.ts` - API client functions
- `utils/validation/role-settings.ts` - Zod validation schemas
- `utils/routing/role-routing.ts` - Role-based routing utility

### Tests (3 files)
- `apps/backend/tests/test_role_settings.py` - Backend API tests
- `tests/e2e/role-settings.spec.ts` - Frontend settings UI tests
- `tests/e2e/role-based-routing.spec.ts` - Frontend routing tests

---

## Files Modified

### Frontend
- `app/settings/page.tsx` - Added role-specific tabs
- `components/navigation/profile-dropdown.tsx` - Added role-based routing

---

## Key Features

✅ **Conditional Tab Rendering**
- Only shows tabs for roles user has access to
- Reduces UI clutter

✅ **Form Validation**
- Zod schemas for all role types
- Real-time validation feedback
- URL validation for links

✅ **Error Handling**
- Toast notifications for success/error
- Loading states during API calls
- Graceful error messages

✅ **Centralized Routing**
- Single source of truth for profile routes
- Easy to maintain and update
- Reusable across components

✅ **Full Test Coverage**
- Backend API tests
- Frontend E2E tests
- Form validation tests
- Routing tests

---

## Architecture

### Component Structure
```
app/settings/page.tsx
├── CriticSettings.tsx
├── TalentSettings.tsx
└── IndustryProSettings.tsx
```

### API Flow
```
Component → utils/api/roles.ts → Backend API
                ↓
         utils/validation/role-settings.ts (Zod)
```

### Routing Flow
```
Profile Dropdown → handleProfileClick()
                ↓
         getProfileRouteForRole(activeRole, username)
                ↓
         router.push(profileRoute)
```

---

## Next Steps (Phase 4)

1. **Industry Profile Route Enhancement**
   - Replace `/people` placeholder with `/industry/profile/me`
   - Create dedicated industry profile page

2. **Profile Visibility Settings**
   - Add privacy controls for each role profile
   - Allow users to hide/show specific roles

3. **Profile Completion Indicators**
   - Show progress bars for profile completion
   - Suggest missing fields

4. **Profile Preview**
   - Add preview of how profile looks to others
   - Show public vs. private fields

---

## Troubleshooting

**Issue: Role-specific tabs not showing**
- Verify user has roles assigned (check RoleContext)
- Check browser console for errors
- Verify backend endpoints are working

**Issue: Form not saving**
- Check network tab for API errors
- Verify authentication token is valid
- Check backend logs for validation errors

**Issue: Profile routing not working**
- Verify activeRole is set in RoleContext
- Check browser console for routing errors
- Verify profile pages exist for each role

---

## Documentation

- Full implementation report: `E3_PHASE3_IMPLEMENTATION_REPORT.md`
- This quick start guide: `E3_PHASE3_QUICK_START.md`

---

**Status:** ✅ Ready for testing and deployment

