# Quick Start Guide - React SMS

Get the Bridges Academy School Management System running in minutes!

## 5-Minute Setup

### Step 1: Install Node.js (if not already installed)
- Download from [nodejs.org](https://nodejs.org)
- Install the LTS version
- Verify installation: `node --version` and `npm --version`

### Step 2: Install Dependencies
```bash
npm install
```

This installs all required packages from package.json.

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
- Automatically opens at `http://localhost:3000`
- If not, manually navigate to that URL

## 🎯 What You Can Do Now

**Admin Portal:**
- ✅ View Dashboard with KPIs and analytics
- ✅ Search and manage students
- ✅ View recent activity feed
- ✅ Monitor system health

**Student Registration:**
- ✅ Complete 3-step registration form
- ✅ Upload documents
- ✅ Review and submit application

**Navigation:**
- Click any admin link in the sidebar
- Placeholder pages for upcoming features

## 📁 Key Directories

```
app/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components (Dashboard, Registration, etc.)
│   ├── App.jsx         # Main app with routing
│   └── index.css       # Global styles
├── package.json        # Dependencies
└── README.md          # Full documentation
```

## 🔧 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📖 Next Steps

1. **Explore the Code**
   - Check `src/components/` for reusable UI components
   - Check `src/pages/` for page implementations
   - Review `src/App.jsx` for routing setup

2. **Customize Colors**
   - Edit `tailwind.config.js`
   - Change primary, secondary colors
   - Refresh browser to see changes

3. **Add New Pages**
   - Create component in `src/pages/`
   - Add route in `src/App.jsx`
   - Add navigation link in `src/components/Layout.jsx`

4. **Connect to Backend**
   - Create API service in `src/services/api.js`
   - Replace mock data with API calls
   - Set environment variables in `.env`

## 🚀 Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Deploy the 'dist' folder to your hosting platform
```

## 📚 Component Examples

### Using Button Component
```jsx
import { Button } from './components';

<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

### Using Card Component
```jsx
import { Card, CardHeader, CardContent } from './components';

<Card>
  <CardHeader title="My Card" />
  <CardContent>Content goes here</CardContent>
</Card>
```

### Using Form Inputs
```jsx
import { Input, Textarea, Select } from './components';

<Input label="Email" type="email" placeholder="Enter email" />
<Textarea label="Message" placeholder="Your message" />
<Select 
  label="Grade" 
  options={[
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' }
  ]}
/>
```

## 🎨 Available Colors

Edit in `tailwind.config.js`:

```javascript
colors: {
  primary: "#000666",          // Indigo Navy
  secondary: "#4a626d",        // Bridge Steel
  surface: "#f4faff",          // Light Blue
  background: "#f4faff",       // Background
  error: "#ba1a1a",            // Red
  // ... more colors
}
```

## 🆘 Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- --port 3001
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Styles not showing?**
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server
- Check browser console for errors (F12)

**Hot reload not working?**
- Restart dev server
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📖 Full Documentation

See `README.md` for:
- Complete feature overview
- All component documentation
- API integration guide
- Deployment instructions
- Testing setup

## 💡 Tips

- **Components folder** has pre-built UI components ready to use
- **Pages folder** has example pages you can modify
- **Tailwind CSS** for all styling (no separate CSS files needed)
- **React Router** for navigation and routing
- **Session storage** for form data persistence

## 🎉 You're Ready!

Start building your school management system. Happy coding!

---

**Need help?** Check the README.md for comprehensive documentation.

**Found a bug?** Create an issue or contact the dev team.
