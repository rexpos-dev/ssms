# Local Tunnel Setup - Connect Railway to Your Local Machine

**Goal:** Allow Railway deployment to communicate with services running on your local machine.

---

## 🎯 3 Methods to Connect Railway → Local Machine

### Method 1: ngrok (Easiest) ⭐ Recommended

**Best for:** Quick testing, temporary connections

#### Step 1: Download & Install ngrok
```bash
# Visit: https://ngrok.com/download
# Or install via npm:
npm install -g ngrok
```

#### Step 2: Create Free Account
1. Go to https://ngrok.com
2. Sign up (free account)
3. Copy your auth token

#### Step 3: Add Auth Token
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

#### Step 4: Start Local Backend (Example)
```bash
# Terminal 1: Start your local backend on port 3000
npm run dev
# or
node server.js
# or
python app.py
```

#### Step 5: Create Public Tunnel
```bash
# Terminal 2: Expose your local service
ngrok http 3000
```

**Output:**
```
Session Status: online
Session Expires: 1h 59m 35s
Version: 3.3.5

Web Interface: http://127.0.0.1:4040
Forwarding: https://abcd1234-5678-90ef-gh.ngrok.io -> http://localhost:3000
```

#### Step 6: Update Railway Environment Variable
In Railway Dashboard → Project Settings → Variables:
```
VITE_API_BASE_URL=https://abcd1234-5678-90ef-gh.ngrok.io
```

✅ **Done!** Railway can now access your local machine.

---

### Method 2: Cloudflare Tunnel (More Stable)

**Best for:** Permanent connections, production use

#### Step 1: Install Cloudflare Tunnel
```bash
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/local-management/windows/

# Or via Homebrew (Mac):
brew install cloudflare/cloudflare/cloudflared

# Or via Scoop (Windows):
scoop install cloudflare/bucket/cloudflared
```

#### Step 2: Authenticate
```bash
cloudflared login
```

This opens a browser to authenticate with your Cloudflare account.

#### Step 3: Create Tunnel
```bash
cloudflared tunnel create sms-local-tunnel
```

Output shows tunnel ID and credentials file.

#### Step 4: Route Traffic
```bash
cloudflared tunnel route dns sms-local-tunnel api.yourdomain.com
```

#### Step 5: Create Config File
Create `~/.cloudflared/config.yml`:

```yaml
tunnel: sms-local-tunnel
credentials-file: /path/to/credentials/file.json

ingress:
  - hostname: api.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
```

#### Step 6: Run Tunnel
```bash
cloudflared tunnel run sms-local-tunnel
```

#### Step 7: Update Railway
```
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

### Method 3: Docker + Docker Compose (Most Complex)

**Best for:** Full local environment, database included

#### Step 1: Create docker-compose.yml
```yaml
version: '3.8'

services:
  # Backend API
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/sms
      - NODE_ENV=development
    depends_on:
      - db

  # Database
  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=sms
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Frontend (Optional)
  frontend:
    build: ./app
    ports:
      - "5173:5173"

volumes:
  postgres_data:
```

#### Step 2: Start Services
```bash
docker-compose up -d
```

#### Step 3: Access Services
```
Frontend:  http://localhost:5173
API:       http://localhost:3000
Database:  localhost:5432
```

#### Step 4: For Railway to Access
Use ngrok on Docker API:
```bash
ngrok http 3000
```

Then set in Railway:
```
VITE_API_BASE_URL=https://your-ngrok-url.ngrok.io
```

---

## 🔌 Using Environment Variables in Vite/React

### Load API URL from Environment
```jsx
// src/config/api.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = {
  auth: `${API_BASE_URL}/api/auth`,
  users: `${API_BASE_URL}/api/users`,
  students: `${API_BASE_URL}/api/students`,
  teachers: `${API_BASE_URL}/api/teachers`,
};
```

### Use in Components
```jsx
// src/context/AuthContext.jsx
import { API_BASE_URL } from '../config/api';

const handleLogin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  // ... handle auth
};
```

---

## 📊 Connection Flow

### Local Development
```
Your Computer:
┌─────────────────────────────┐
│  React App (5173)           │
├─────────────────────────────┤
│  Backend API (3000)         │
├─────────────────────────────┤
│  Database (5432)            │
└─────────────────────────────┘
       (all localhost)
```

### Railway → Local (via Tunnel)
```
Railway Cloud:
┌────────────────────────────────────┐
│  Your Deployed React App           │
└────────────────────────────────────┘
            ↓ https://tunnel-url
        
        ngrok/Cloudflare Tunnel
            ↓
        
Your Local Machine:
┌────────────────────────────────────┐
│  Backend API (3000)                │
├────────────────────────────────────┤
│  Database (5432)                   │
└────────────────────────────────────┘
```

---

## 🔐 Security Considerations

⚠️ **Important:**

1. **Never expose sensitive ports** (database, admin panels)
2. **Use strong auth tokens** for ngrok/Cloudflare
3. **Restrict tunnel access** to specific IPs if possible
4. **Don't hardcode tunnel URLs** in code - use environment variables
5. **Rotate auth tokens** regularly
6. **Use HTTPS only** (tunnels provide this automatically)

---

## 🧪 Test Connection

### Test from Railway Terminal
```bash
# SSH into Railway container
railway shell

# Test local API
curl https://your-tunnel-url.ngrok.io/api/health

# Check environment variables
echo $VITE_API_BASE_URL
```

### Test from Local Terminal
```bash
# Check tunnel is running
curl https://your-tunnel-url.ngrok.io/api/health

# Should return 200 OK if backend is working
```

---

## 📋 Setup Checklist

### ngrok Setup
- [ ] ngrok installed globally
- [ ] Free account created at ngrok.com
- [ ] Auth token configured
- [ ] Local service running (port 3000)
- [ ] ngrok tunnel started: `ngrok http 3000`
- [ ] Public URL copied
- [ ] Railway env variable updated
- [ ] Tested connection

### Cloudflare Tunnel Setup
- [ ] cloudflared installed
- [ ] Cloudflare account authenticated
- [ ] Tunnel created
- [ ] DNS routed
- [ ] config.yml created
- [ ] Tunnel running: `cloudflared tunnel run`
- [ ] Railway env variable updated
- [ ] Tested connection

### Docker Setup
- [ ] Docker installed
- [ ] docker-compose.yml created
- [ ] Services running: `docker-compose up -d`
- [ ] ngrok exposing API (if needed)
- [ ] Railway env variable updated
- [ ] Tested connection

---

## 🔄 Keeping Tunnel Running

### Option 1: Keep Terminal Open
Simply leave the ngrok/cloudflared terminal running.

### Option 2: Background Service (Mac/Linux)
```bash
# Create systemd service for cloudflared
sudo nano /etc/systemd/system/cloudflared.service

# Content:
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=your_user
ExecStart=/usr/local/bin/cloudflared tunnel run sms-local-tunnel
Restart=always

[Install]
WantedBy=multi-user.target

# Enable
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

### Option 3: PM2 (All Platforms)
```bash
# Install PM2
npm install -g pm2

# Start ngrok with PM2
pm2 start "ngrok http 3000" --name "ngrok-sms"

# Save
pm2 save
pm2 startup
```

---

## 📞 Environment Variables Summary

### Local Development (.env.local)
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Railway Production (.env.railway)
```env
VITE_API_BASE_URL=https://your-tunnel-url.ngrok.io
```

### Set in Railway Dashboard
1. Go to Project Settings
2. Click "Variables"
3. Add new variable
4. Name: `VITE_API_BASE_URL`
5. Value: Your tunnel URL
6. Save

---

## 🚀 Next Steps

1. **Choose a tunnel method** (ngrok recommended for quick start)
2. **Start your local backend** on port 3000
3. **Create public tunnel** to expose your local service
4. **Update Railway environment variables** with tunnel URL
5. **Test connection** from Railway deployment
6. **Deploy to Railway** with updated variables

---

## 💡 Quick Start

**For ngrok (5 minutes):**
```bash
# Terminal 1: Backend
cd your-backend-project
npm start

# Terminal 2: ngrok
ngrok http 3000

# Copy URL from ngrok output
# Set in Railway: VITE_API_BASE_URL=<your-ngrok-url>

# Done! ✅
```

---

See `RAILWAY_DEPLOYMENT_GUIDE.md` for full deployment instructions.
