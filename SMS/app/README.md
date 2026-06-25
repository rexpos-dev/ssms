# Bridges Academy School Management System - React Edition

A modern, production-ready React application for managing school operations, student registrations, and administrative functions. Built with React 18, React Router, and Tailwind CSS.

## 📋 Features

- **Admin Portal**: Comprehensive dashboard with student management, faculty oversight, and analytics
- **Student Registration**: 3-step registration workflow with document management
- **Responsive Design**: Fully responsive on mobile, tablet, and desktop
- **Component-Based Architecture**: Reusable UI components for easy customization
- **State Management**: Built-in form state management with session storage
- **Material Design 3**: Consistent design system throughout the application

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## 📁 Project Structure

```
app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.jsx      # Button component
│   │   ├── Card.jsx        # Card component family
│   │   ├── Input.jsx       # Form input components
│   │   ├── Table.jsx       # Table components
│   │   ├── Layout.jsx      # Layout with sidebar and header
│   │   ├── Badge.jsx       # Status badge component
│   │   ├── Modal.jsx       # Modal dialog component
│   │   └── index.js        # Component exports
│   ├── pages/              # Page components
│   │   ├── AdminDashboard.jsx      # Main admin dashboard
│   │   ├── StudentDirectory.jsx    # Student search and management
│   │   ├── RegistrationStep1.jsx   # Registration form step 1
│   │   ├── RegistrationStep2.jsx   # Document upload step 2
│   │   └── RegistrationStep3.jsx   # Review and submit step 3
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles and Tailwind imports
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── .gitignore             # Git ignore rules
```

## 🎨 Components

### Button
```jsx
import { Button } from './components';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

Variants: `primary`, `secondary`, `text`, `danger`  
Sizes: `sm`, `md`, `lg`

### Card
```jsx
import { Card, CardHeader, CardContent, CardFooter } from './components';

<Card>
  <CardHeader title="Title" action={<button>Action</button>} />
  <CardContent>Content here</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Input
```jsx
import { Input, Textarea, Select } from './components';

<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  error={errorMessage}
  helperText="Helper text"
/>
```

### Table
```jsx
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from './components';

<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Column 1</TableHeader>
      <TableHeader>Column 2</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Layout
```jsx
import { Layout } from './components';

<Layout>
  <h1>Page Content</h1>
</Layout>
```

Provides sidebar navigation and header with all admin pages.

## 🔄 Routing

Routes are defined in `App.jsx`:

| Route | Page |
|-------|------|
| `/` | Home / Welcome |
| `/admin` | Admin Dashboard |
| `/admin/students` | Student Directory |
| `/admin/faculty` | Faculty Management |
| `/admin/calendar` | Academic Calendar |
| `/admin/financial` | Financial Reports |
| `/admin/reports` | Reports Hub |
| `/admin/requirements` | Student Requirements |
| `/admin/settings` | System Settings |
| `/registration/step1` | Registration Form - Step 1 |
| `/registration/step2` | Registration Form - Step 2 |
| `/registration/step3` | Registration Form - Step 3 |

## 📝 Form State Management

Forms use React hooks (`useState`) for state management. Data is persisted in `sessionStorage` for multi-step forms:

```jsx
// Save data to session storage
sessionStorage.setItem('registrationStep1', JSON.stringify(formData));

// Retrieve data from session storage
const data = JSON.parse(sessionStorage.getItem('registrationStep1'));

// Clear all data
sessionStorage.clear();
```

## 🎨 Tailwind CSS

The project uses Tailwind CSS with a custom configuration for the Bridges Academy design system. Key color variables and spacing are defined in `tailwind.config.js`:

### Color System

**Primary Colors:**
- `primary`: #000666 (Indigo Navy)
- `secondary`: #4a626d (Bridge Steel)
- `surface`: #f4faff (Light Blue)

**State Colors:**
- `error`: #ba1a1a (Red)
- `success`: Green (custom)
- `warning`: Amber (custom)

### Spacing System

All spacing uses 4px base units:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

### Typography

All text uses the **Inter** font family:
- `headline-xl`: 40px (page titles)
- `headline-lg`: 32px (section titles)
- `headline-md`: 24px (card titles)
- `body-md`: 16px (standard body text)
- `label-md`: 14px (form labels)

## 🔧 Customization

### Changing Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: "#YOUR_COLOR",
  secondary: "#YOUR_COLOR",
  // ... other colors
}
```

Then rebuild the CSS.

### Adding a New Page

1. Create a new component in `src/pages/YourPage.jsx`
2. Import it in `App.jsx`
3. Add a new route:

```jsx
<Route path="/your-path" element={<Layout><YourPage /></Layout>} />
```

4. Add navigation link in `Layout.jsx` sidebar

### Adding a New Component

1. Create `src/components/YourComponent.jsx`
2. Export it in `src/components/index.js`
3. Use it in your pages:

```jsx
import { YourComponent } from '../components';
```

## 📊 Data Management

The application currently uses mock data. To connect to a real backend:

1. Create an API service file:

```javascript
// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const getStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/students`);
  return response.json();
};
```

2. Use in components:

```jsx
import { getStudents } from '../services/api';

useEffect(() => {
  getStudents().then(setStudents);
}, []);
```

3. Set environment variables in `.env`:

```
VITE_API_URL=http://localhost:3001/api
```

## 🧪 Testing

Add testing libraries for unit and integration tests:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

Create test files alongside components:

```javascript
// Button.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
});
```

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables if needed
4. Vercel automatically builds and deploys

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

### Deploy to Other Platforms

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder to your hosting provider

## 🔐 Security Best Practices

- Validate all form inputs before submission
- Sanitize user data to prevent XSS
- Use HTTPS for all API communications
- Store sensitive data in backend, not localStorage
- Implement proper authentication and authorization
- Add CSRF protection for state-changing requests

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
npm run dev -- --port 3001
```

### Dependencies not installing

```bash
rm -rf node_modules package-lock.json
npm install
```

### Styles not loading

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Hot module replacement not working

Restart the dev server and clear browser cache.

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [Material Design 3](https://m3.material.io)

## 🤝 Contributing

When adding new features:

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a pull request

## 📄 License

Proprietary - Bridges Academy School Management System

## 👥 Support

For questions or issues, please contact the development team or create an issue in the project repository.

---

**Version**: 1.0.0  
**Last Updated**: June 2026  
**Built with**: React 18 + Vite + Tailwind CSS
