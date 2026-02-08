# Error Fix: ReferenceError: process is not defined

## Problem Description

```
ReferenceError: process is not defined
    at https://d55437638dae41bc8ed1a83d89a6bc02-br-7ce4d4a2e7b1477c99eaea860.fly.dev/src/lib/api.js:4:22
```

## Root Cause

The frontend code was using **Node.js syntax** (`process.env`) in a **browser environment**. The `process` object only exists in Node.js, not in the browser.

### What Was Wrong
```javascript
// ❌ WRONG - This is Node.js syntax, not available in browsers
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

## Solution Applied

### 1. Updated Frontend API Client

**File:** `src/lib/api.js`

```javascript
// ✅ CORRECT - Vite syntax for browser environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

**Why This Works:**
- `import.meta.env` is the **Vite way** to access environment variables in the browser
- Vite automatically injects these during build time
- Variables must start with `VITE_` prefix to be exposed

### 2. Updated Environment Variable Names

**File:** `.env.local` (Frontend)

```env
# OLD (React/CRA syntax - doesn't work with Vite)
REACT_APP_API_URL=http://localhost:5000/api

# NEW (Vite syntax - correct for this project)
VITE_API_URL=http://localhost:5000/api
```

**File:** `.env.example`

Updated all environment variables to use `VITE_` prefix instead of `REACT_APP_`.

### 3. Created Environment Files

**Frontend:**
- ✅ `.env.local` - Pre-configured with correct values
- ✅ `.env.example` - Template with VITE_ prefix

**Backend:**
- ✅ `backend/.env` - Pre-configured with MongoDB and JWT secrets

## Verification Steps

### 1. Check Environment Files

Frontend (`.env.local`):
```bash
# Should exist and contain:
VITE_API_URL=http://localhost:5000/api
```

Backend (`backend/.env`):
```bash
# Should contain:
MONGODB_URI=mongodb+srv://virajprabhu47:...
JWT_SECRET=...
ADMIN_JWT_SECRET=...
```

### 2. Clear Cache and Restart

```bash
# Frontend
rm -rf node_modules/.vite
npm run dev

# Backend (separate terminal)
cd backend
npm run dev
```

### 3. Verify API Connection

Open browser DevTools (F12) and check:
1. **Console tab**: No errors about `process is not defined`
2. **Network tab**: API requests should go to `http://localhost:5000/api`
3. Check first API call shows `200 OK` status

### 4. Test Critical Flows

- [ ] Homepage loads without console errors
- [ ] Can login/signup
- [ ] Products load from API
- [ ] Admin dashboard connects to backend
- [ ] Checkout form works

## Key Differences: React vs Vite

| Feature | React (CRA) | Vite |
|---------|-----|------|
| Env Syntax | `process.env` | `import.meta.env` |
| Variable Prefix | `REACT_APP_` | `VITE_` |
| Usage | SSR friendly | Browser only |
| Build Time | Slower | Fast |

## Environment Variable Reference

### Frontend (.env.local)
```env
# Required for API connection
VITE_API_URL=http://localhost:5000/api

# Optional - for future use
VITE_RAZORPAY_KEY_ID=
VITE_WHATSAPP_NUMBER=+919930709557
```

### Backend (.env)
```env
# Database (REQUIRED)
MONGODB_URI=mongodb+srv://...

# JWT Secrets (REQUIRED - change in production)
JWT_SECRET=random_string
ADMIN_JWT_SECRET=random_string

# Razorpay (Optional - needed for payments)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Server Config
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
WHATSAPP_NUMBER=+919930709557
```

## Accessing Environment Variables in Code

### Frontend (React/Vite)
```javascript
// ✅ Correct - use import.meta.env
const apiUrl = import.meta.env.VITE_API_URL;
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

// ❌ Wrong - process doesn't exist in browser
const apiUrl = process.env.VITE_API_URL; // ReferenceError!
```

### Backend (Node.js/Express)
```javascript
// ✅ Correct - use process.env in Node.js
const mongoUrl = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
```

## Troubleshooting

### Still Getting "process is not defined"?

1. **Check file location**
   - Error should only happen in frontend code
   - Backend code can safely use `process.env`

2. **Verify .env.local exists**
   ```bash
   ls -la .env.local
   # Should exist in project root
   ```

3. **Clear Vite cache**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

4. **Check for typos**
   - Variable must start with `VITE_`
   - No `REACT_APP_` in this project
   - Check `.env.local` matches usage in code

5. **Restart dev server**
   ```bash
   # Stop dev server (Ctrl+C)
   # Then restart
   npm run dev
   ```

### API Still Not Connecting?

1. **Verify backend is running**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status":"Server is running"...}
   ```

2. **Check browser console** (F12)
   - Look for network tab
   - Check if requests go to `http://localhost:5000/api`
   - Check for CORS errors

3. **Verify VITE_API_URL value**
   ```bash
   # Check what's actually set
   grep VITE_API_URL .env.local
   ```

4. **Check for typos in api.js**
   ```javascript
   // Should be:
   import.meta.env.VITE_API_URL
   // Not:
   import.meta.env.REACT_APP_API_URL // ❌ Wrong!
   ```

## Files Modified

✅ **Fixed:**
- `src/lib/api.js` - Changed to use `import.meta.env`
- `.env.example` - Updated variable names to VITE_
- `.env.local` - Created with proper configuration
- `backend/.env` - Created with MongoDB and JWT config

✅ **Documentation Updated:**
- `SETUP.md` - Updated env variable references
- This debug guide - Complete explanation

## Prevention

For future development:
1. Always use `import.meta.env.VITE_*` in frontend code
2. Always use `process.env.*` in backend code
3. Never share or use `process` in browser/frontend code
4. Keep environment variables clearly documented

## Status

✅ **FIXED** - All errors should be resolved. 

Next steps:
1. Ensure both `.env.local` (frontend) and `backend/.env` are in place
2. Restart both dev servers
3. Test that API calls work in browser DevTools

---

**If you still encounter errors, check:**
1. Console logs in browser (F12)
2. Terminal output from `npm run dev`
3. MongoDB Atlas dashboard for connection status
4. All environment files are properly configured
