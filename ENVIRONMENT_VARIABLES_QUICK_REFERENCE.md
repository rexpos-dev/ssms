# Environment Variables - Quick Reference

## 📁 Files

| File | Purpose | When Used |
|------|---------|-----------|
| `.env.example` | Template for all variables | Reference |
| `.env.local` | Local development | `npm run dev` |
| `.env.railway` | Railway production | Railway Dashboard |

---

## 🚀 5-Minute Setup

### Step 1: Copy Template
```bash
cd "D:\School Management System V2\SMS\app"
copy .env.example .env.local
```

### Step 2: Set Local API (if you have a backend)
Edit `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Step 3: Run Locally
```bash
npm run dev
# App runs at http://localhost:5173
```

### Step 4: For Railway → Set Tunnel URL
```bash
# Start ngrok
ngrok http 3000

# Copy URL: https://abcd1234.ngrok.io

# Railway Dashboard → Variables:
# VITE_API_BASE_URL=https://abcd1234.ngrok.io
```

---

## 📋 Key Variables

### API Configuration
```env
VITE_API_BASE_URL=http://localhost:3000  # Local
VITE_API_BASE_URL=https://your-api.com    # Production
VITE_API_TIMEOUT=30000                     # 30 seconds
VITE_API_KEY=your_api_key_here            # For API authentication
```

### Authentication
```env
VITE_JWT_SECRET=your_secret_key           # For JWT tokens
VITE_SESSION_SECRET=your_session_key      # For sessions
```

### School Settings
```env
VITE_SCHOOL_NAME=Bridges Academy
VITE_SCHOOL_EMAIL=admin@example.edu
VITE_SCHOOL_PHONE=+1 (555) 012-3456
VITE_SCHOOL_ADDRESS=123 Main St, City, State
```

### Feature Flags
```env
VITE_ENABLE_ANALYTICS=false          # Local: false
VITE_ENABLE_USER_REGISTRATION=true   # Allow registration
VITE_ENABLE_EMAIL_VERIFICATION=false # Local: false, Prod: true
```

### Development
```env
VITE_DEBUG_MODE=true                 # Local: true, Prod: false
VITE_LOG_LEVEL=debug                 # Local: debug, Prod: error
VITE_MOCK_DATA=true                  # Use fake data in dev
```

---

## 🔌 Accessing Variables in Code

### Vite Environment Variables
```jsx
// Prefix: VITE_* (exposed to frontend)
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const debugMode = import.meta.env.VITE_DEBUG_MODE;

// Non-VITE_ variables (NOT exposed to frontend)
const jwtSecret = import.meta.env.JWT_SECRET; // undefined!
```

### Config File Pattern
```jsx
// src/config/api.js
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
    key: import.meta.env.VITE_API_KEY,
  },
  school: {
    name: import.meta.env.VITE_SCHOOL_NAME,
    email: import.meta.env.VITE_SCHOOL_EMAIL,
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    registration: import.meta.env.VITE_ENABLE_USER_REGISTRATION === 'true',
  },
  debug: {
    mode: import.meta.env.VITE_DEBUG_MODE === 'true',
    level: import.meta.env.VITE_LOG_LEVEL || 'error',
  },
};
```

### Using in Components
```jsx
import { config } from '../config/api';

export const useApi = () => {
  const fetch = async (endpoint) => {
    const response = await fetch(
      `${config.api.baseUrl}${endpoint}`,
      {
        headers: {
          'Authorization': `Bearer ${config.api.key}`,
        },
      }
    );
    return response.json();
  };

  return { fetch };
};
```

---

## 🌐 Environment Presets

### Local Development
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
VITE_MOCK_DATA=true
VITE_ENABLE_EMAIL_VERIFICATION=false
```

### Testing/Staging
```env
VITE_API_BASE_URL=https://staging-api.example.com
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
VITE_MOCK_DATA=false
VITE_ENABLE_EMAIL_VERIFICATION=false
```

### Production (Railway)
```env
VITE_API_BASE_URL=https://api.example.com
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
VITE_MOCK_DATA=false
VITE_ENABLE_EMAIL_VERIFICATION=true
```

---

## 🔐 Security

### ❌ DON'T
```env
# Don't hardcode secrets
VITE_API_KEY=sk_live_abc123def456  # BAD: exposed in frontend

# Don't commit .env files
# (Already in .gitignore)

# Don't use same secrets everywhere
# Use unique values per environment
```

### ✅ DO
```env
# Use different keys per environment
# Local: dev_key_12345
# Railway: production_key_xyz789

# Store sensitive data in Railway Dashboard
# Not in code or .env files

# Use strong, random secrets
# Use password generator for JWT/Session secrets
```

---

## 🚀 Deploy to Railway

### Via Railway Dashboard

1. **Go to Project Settings**
2. **Click "Variables"**
3. **Add New Variable:**
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-api-domain.com` or your ngrok URL
4. **Add More Variables:**
   - `VITE_SCHOOL_NAME`
   - `VITE_ENABLE_ANALYTICS`
   - etc.
5. **Save & Redeploy**

### Via Railway CLI

```bash
railway variable set VITE_API_BASE_URL=https://your-api.com
railway variable set VITE_ENABLE_ANALYTICS=true
railway up --redeploy
```

---

## 🧪 Verify Variables

### Check Locally
```bash
# Print all VITE variables
node -e "console.log(Object.keys(process.env).filter(k => k.startsWith('VITE_')).forEach(k => console.log(`${k}=${process.env[k]}`))"
```

### Check on Railway
```bash
# SSH into container
railway shell

# Print variables
env | grep VITE_
```

---

## 📞 Common Issues

### API Not Connecting
```
Check:
1. VITE_API_BASE_URL is correct
2. Backend is running
3. CORS is configured on backend
4. Tunnel is active (if using ngrok)
```

### Variables Not Loading
```
Check:
1. File is named .env.local (not .env)
2. Vite is restarted after changes
3. Variables are prefixed with VITE_
4. No spaces around = sign
```

### Railway Can't Access Local API
```
Check:
1. ngrok/Cloudflare tunnel is running
2. VITE_API_BASE_URL = tunnel URL
3. Backend responds to tunnel URL
4. No firewall blocking
```

---

## 📚 References

- **Vite Env Variables:** https://vitejs.dev/guide/env-and-mode
- **Railway Variables:** https://docs.railway.app/guides/environment
- **ngrok Setup:** https://ngrok.com/docs/ngrok-agent/
- **Cloudflare Tunnel:** https://developers.cloudflare.com/cloudflare-one/connections/

---

## ✅ Checklist

- [ ] `.env.local` created
- [ ] `VITE_API_BASE_URL` set correctly
- [ ] No `.env` files in git
- [ ] Variables load in `import.meta.env`
- [ ] Local dev works
- [ ] Railway variables set
- [ ] Tunnel URL in Railway
- [ ] Production deployed

---

**Status:** ✅ Ready to Use  
**Last Updated:** June 25, 2026
