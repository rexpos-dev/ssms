# Install Railway CLI on Windows

**Error:** `railway is not recognized as a command`

**Solution:** Install Railway CLI globally via npm

---

## ✅ Quick Install (2 Minutes)

### Step 1: Open PowerShell as Administrator
1. Press `Windows Key + R`
2. Type: `powershell`
3. Press `Ctrl + Shift + Enter` (Run as Administrator)
4. Click "Yes" when prompted

### Step 2: Install Railway CLI
```powershell
npm install -g @railway/cli
```

**Wait for installation to complete** (takes 1-2 minutes)

### Step 3: Verify Installation
```powershell
railway --version
```

Should output something like: `3.x.x`

---

## 🚀 Deploy After Installation

### Step 1: Navigate to Project
```powershell
cd "D:\School Management System V2\SMS\app"
```

### Step 2: Login to Railway
```powershell
railway login
```

This opens a browser window to authenticate with Railway.

### Step 3: Deploy
```powershell
railway up
```

Or if you want to force a clean rebuild:
```powershell
railway build --clean
```

---

## 🆘 Alternative: Use npm Scripts Directly

If `railway` command still doesn't work after installation, you can deploy via Railway Dashboard:

### Option 1: Web Dashboard
1. Go to https://railway.app
2. Sign in
3. Select your project
4. Click "Deployments"
5. Click "Redeploy"

### Option 2: Check npm Global Packages
```powershell
npm list -g --depth=0
```

Look for `@railway/cli` in the list.

---

## 🔧 If Installation Fails

### Issue: Permission Denied
**Solution:** Run PowerShell as Administrator

### Issue: npm command not found
**Solution:** Restart PowerShell or your computer

### Issue: Still can't find railway command
**Solution:** Check npm bin path
```powershell
npm bin -g
```

Add this path to Windows PATH environment variable:
1. Press `Windows Key + Pause`
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Edit `PATH` variable
5. Add the output from `npm bin -g`

---

## 📋 Complete Installation Steps

```powershell
# Step 1: Open PowerShell as Administrator
# (Right-click PowerShell → Run as Administrator)

# Step 2: Install Railway
npm install -g @railway/cli

# Step 3: Verify
railway --version

# Step 4: Navigate to project
cd "D:\School Management System V2\SMS\app"

# Step 5: Login to Railway
railway login

# Step 6: Deploy
railway up

# That's it! ✅
```

---

## ✨ After Deployment

Once `railway up` completes:

1. **Get your project URL:**
   ```powershell
   railway open
   ```
   This opens your deployed app in browser

2. **View logs:**
   ```powershell
   railway logs --follow
   ```

3. **Check status:**
   ```powershell
   railway status
   ```

---

## 🎯 What `railway up` Does

1. Reads `railway.json` & `railway.toml` configurations
2. Builds your React app: `npm install && npm run build`
3. Uploads build to Railway
4. Starts the preview server on port 5173
5. Makes it available at `https://your-project.railway.app`

**Total time:** ~10-15 minutes

---

## 📞 Troubleshooting

### Railway command still not found after restart?

Try the full path:
```powershell
$env:APPDATA\npm\railway up
```

Or reinstall:
```powershell
npm uninstall -g @railway/cli
npm install -g @railway/cli
```

### Still seeing errors?

Check that npm is working:
```powershell
npm --version
node --version
```

Both should return version numbers.

---

## ✅ Success Checklist

- [ ] PowerShell opened as Administrator
- [ ] `npm install -g @railway/cli` completed
- [ ] `railway --version` shows version number
- [ ] Logged in: `railway login`
- [ ] Deployed: `railway up`
- [ ] App accessible at Railway URL

---

**After these steps, your app should deploy successfully!** 🚀

See `RAILWAY_BUILD_FIX.md` for more deployment details.
