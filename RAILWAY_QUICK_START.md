# 🚀 Railway Deployment - Quick Start Guide

**Your Token:** `e5a9ea87-eba5-4247-bcf5-8456681b66e3`

---

## ⚡ 2-Minute Setup

### Option 1: Automated (Recommended) 🎯

**Windows Users:**
```bash
cd "D:\School Management System V2\SMS\app"
deploy-railway.bat
```

**Mac/Linux Users:**
```bash
cd D:/School\ Management\ System\ V2/SMS/app
chmod +x deploy-railway.sh
./deploy-railway.sh
```

### Option 2: Manual Setup

**Step 1: Install Railway CLI**
```bash
npm install -g railway
```

**Step 2: Navigate to app folder**
```bash
cd "D:\School Management System V2\SMS\app"
```

**Step 3: Build & Deploy**
```bash
npm run build
railway up --token e5a9ea87-eba5-4247-bcf5-8456681b66e3
```

---

## 📊 What Gets Deployed

✅ **4 Complete Portals**
- Admin Portal (User Management, Settings)
- Teacher Portal
- Student Portal  
- Parent Portal (6 pages fully functional)

✅ **Advanced Features**
- User registration system
- Beautiful animated login
- Cross-portal authentication
- School settings with logo upload
- Real-time data persistence

---

## 🔑 Demo Credentials (Post-Deployment)

After deployment, access with:

```
URL: https://your-app.railway.app

Admin:   admin@school.edu / demo123
Teacher: teacher@school.edu / demo123
Student: student@school.edu / demo123
Parent:  parent@school.edu / demo123
```

---

## 📁 Deployment Files

Created in `SMS/app/`:
- ✅ `railway.json` - Railway configuration
- ✅ `.railwayignore` - Files to exclude
- ✅ `deploy-railway.sh` - Linux/Mac deploy script
- ✅ `deploy-railway.bat` - Windows deploy script

---

## ⏱️ Expected Timeline

| Step | Time |
|------|------|
| Install dependencies | 2-3 min |
| Build app | 5-10 min |
| Upload to Railway | 1-2 min |
| Start container | 2-3 min |
| **Total** | **~15 min** |

---

## 🔍 Monitor Deployment

```bash
# Watch deployment logs in real-time
railway logs --follow

# Check project status
railway status

# View metrics
railway metrics
```

---

## ✅ Post-Deployment Checklist

- [ ] App loads at your Railway URL
- [ ] Login page displays with animations
- [ ] Demo credentials work
- [ ] Admin portal accessible
- [ ] User registration functional
- [ ] Parent portal pages load
- [ ] Cross-portal authentication works
- [ ] No console errors

---

## 🎯 Next: Connect Custom Domain (Optional)

```bash
railway domain
```

Then update your DNS CNAME to point to Railway's domain.

---

## 🆘 Troubleshooting

**Build fails?**
```bash
npm run build  # Test locally first
```

**Slow deployment?**
```bash
railway logs --follow  # Watch the logs
```

**Need to redeploy?**
```bash
railway up
```

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Token: `e5a9ea87-eba5-4247-bcf5-8456681b66e3`
- Project ID in Railway Dashboard

---

## 🎉 You're Ready!

Your School Management System is production-ready and configured for Railway deployment.

**Just run the deployment script and your app will be live in ~15 minutes!** 🚀

---

See `RAILWAY_DEPLOYMENT_GUIDE.md` for detailed information.
