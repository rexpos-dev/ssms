# Railway Environment Variables Setup

**Status:** No variables set yet  
**Action:** Add variables via Railway Dashboard

---

## 🚀 Quick Setup (2 Minutes)

### Step 1: In Railway Dashboard
1. Click **"Variables"** tab
2. Click **"+ New Variable"** button

### Step 2: Add Each Variable

Add these variables one by one:

#### **Variable 1: NODE_ENV**
```
Name:  NODE_ENV
Value: production
```
Click "Save"

#### **Variable 2: VITE_API_BASE_URL**
```
Name:  VITE_API_BASE_URL
Value: http://localhost:3000
```
(Or your production API URL)
Click "Save"

#### **Variable 3: VITE_SCHOOL_NAME**
```
Name:  VITE_SCHOOL_NAME
Value: Bridges Academy
```
Click "Save"

#### **Variable 4: VITE_SCHOOL_EMAIL**
```
Name:  VITE_SCHOOL_EMAIL
Value: admin@bridgesacademy.edu
```
Click "Save"

#### **Variable 5: VITE_DEBUG_MODE**
```
Name:  VITE_DEBUG_MODE
Value: false
```
Click "Save"

#### **Variable 6: VITE_MOCK_DATA**
```
Name:  VITE_MOCK_DATA
Value: false
```
Click "Save"

---

## 📋 All Variables (Copy-Paste)

**Required Variables:**
```
NODE_ENV=production
VITE_API_BASE_URL=http://localhost:3000
VITE_SCHOOL_NAME=Bridges Academy
VITE_SCHOOL_EMAIL=admin@bridgesacademy.edu
VITE_DEBUG_MODE=false
VITE_MOCK_DATA=false
```

**Optional Variables (Add if needed):**
```
VITE_API_KEY=your_api_key_here
VITE_JWT_SECRET=your_secret_key
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_USER_REGISTRATION=true
VITE_ENABLE_EMAIL_VERIFICATION=false
```

---

## 🔄 Using "Raw Editor"

For faster setup, use the Raw Editor:

1. Click **"Raw Editor"** button
2. Paste this:

```
NODE_ENV=production
VITE_API_BASE_URL=http://localhost:3000
VITE_SCHOOL_NAME=Bridges Academy
VITE_SCHOOL_EMAIL=admin@bridgesacademy.edu
VITE_DEBUG_MODE=false
VITE_MOCK_DATA=false
```

3. Click **"Save"**

All variables added at once! ✅

---

## 🔐 Security: Keep Secret Values

**Don't add these yet** (only if you have a real API):
- API keys
- JWT secrets
- Database URLs
- Payment credentials

For now, stick with the basic setup above.

---

## 🎯 After Adding Variables

### Step 1: Redeploy
1. Go to **"Deployments"** tab
2. Click **"Redeploy"**

Railway will rebuild and deploy with the new variables.

### Step 2: Monitor
1. Go to **"Console"** tab
2. Watch the logs build and deploy

### Step 3: Test
1. Once deployed, visit your Railway URL
2. Log in with demo credentials:
   - Email: `admin@school.edu`
   - Password: `demo123`

---

## 📝 Variable Explanations

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Tells app to run in prod mode |
| `VITE_API_BASE_URL` | Your API URL | Where app fetches data |
| `VITE_SCHOOL_NAME` | `Bridges Academy` | School name in app |
| `VITE_SCHOOL_EMAIL` | Admin email | Contact info |
| `VITE_DEBUG_MODE` | `false` | Disable debug logs in prod |
| `VITE_MOCK_DATA` | `false` | Use real data (not fake) |

---

## ✅ Checklist

- [ ] Navigated to Variables tab in Railway Dashboard
- [ ] Added NODE_ENV = production
- [ ] Added VITE_API_BASE_URL = http://localhost:3000
- [ ] Added VITE_SCHOOL_NAME = Bridges Academy
- [ ] Added VITE_SCHOOL_EMAIL = admin@bridgesacademy.edu
- [ ] Added VITE_DEBUG_MODE = false
- [ ] Added VITE_MOCK_DATA = false
- [ ] Clicked "Redeploy"
- [ ] Waited for deployment to complete
- [ ] Tested at your Railway URL

---

## 🎉 Next Steps

1. **Add variables above**
2. **Click Redeploy**
3. **Wait 5-10 minutes**
4. **Visit your app URL** when deployment shows "Success"
5. **Test login** with demo credentials

---

**The app will work even with just these basic variables!** 🚀
