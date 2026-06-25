# Development Guide - Bridges Academy SMS

This guide provides detailed information for developers working on the Bridges Academy School Management System.

## 🛠️ Development Setup

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)
- Optional: Node.js for local development server
- Optional: Git for version control

### Local Development Server

For testing AJAX requests and advanced features, set up a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (http-server)
npm install -g http-server
http-server

# Then open: http://localhost:8000
```

## 🎨 Working with Tailwind CSS

### Understanding Tailwind in This Project

All pages use Tailwind CSS via CDN (no build process required). The configuration is embedded in each HTML file:

```javascript
<script id="tailwind-config">
    tailwind.config = {
        // Custom configuration
    }
</script>
```

### Available Color Variables

All colors are defined in the Tailwind config:

```javascript
colors: {
    primary: "#000666",
    secondary: "#4a626d",
    surface: "#f4faff",
    background: "#f4faff",
    error: "#ba1a1a",
    // ... 40+ color variables
}
```

### Using Custom Colors

In your HTML, use Tailwind's class system:

```html
<!-- Background colors -->
<div class="bg-primary">Primary background</div>
<div class="bg-secondary-container">Secondary container</div>

<!-- Text colors -->
<span class="text-on-primary">White text</span>
<span class="text-on-surface-variant">Variant text</span>

<!-- Border colors -->
<div class="border border-outline-variant">Bordered</div>
```

### Responsive Prefixes

```html
<!-- Hidden by default, shown on medium screens and up -->
<div class="hidden md:block">Desktop only</div>

<!-- Different layouts for different screen sizes -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
  4 columns on desktop, 2 on tablet, 1 on mobile
</div>
```

### Spacing System

All spacing uses a 4px base unit:

```html
<!-- Padding -->
<div class="p-xs">4px padding</div>
<div class="p-sm">8px padding</div>
<div class="p-md">16px padding</div>
<div class="p-lg">24px padding</div>
<div class="p-xl">32px padding</div>
<div class="p-xxl">48px padding</div>

<!-- Margin -->
<div class="m-sm">8px margin</div>
<div class="mx-lg">24px horizontal margin</div>
<div class="py-md">16px vertical padding</div>

<!-- Gap (in flex/grid) -->
<div class="flex gap-sm">8px gap between items</div>
<div class="grid gap-lg">24px gap</div>
```

## 📱 Responsive Design

### Breakpoints

```css
/* Defined in Tailwind config */
sm: 640px   /* Tablets */
md: 768px   /* Tablets to Desktop */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
```

### Responsive Patterns

```html
<!-- Hide/Show based on screen size -->
<div class="hidden md:block">Desktop only</div>
<div class="block lg:hidden">Mobile/Tablet only</div>

<!-- Change grid columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  Responsive grid
</div>

<!-- Change text size -->
<h1 class="text-headline-lg-mobile md:text-headline-lg">
  Responsive headline
</h1>

<!-- Change spacing -->
<div class="p-margin-mobile md:p-margin-desktop">
  Responsive padding
</div>
```

### Testing Responsive Design

1. Open browser DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M / Cmd+Shift+M)
3. Select device or drag to resize
4. Test at: 375px (mobile), 768px (tablet), 1024px+ (desktop)

## 🔄 State Management & Interactivity

### Adding Click Handlers

```html
<button onclick="handleClick()">Click me</button>

<script>
function handleClick() {
    console.log('Button clicked');
    // Update UI
    document.querySelector('.target').classList.add('active');
}
</script>
```

### Toggle Classes

```javascript
// Add class
element.classList.add('active');

// Remove class
element.classList.remove('active');

// Toggle class
element.classList.toggle('active');

// Check if has class
if (element.classList.contains('active')) {
    console.log('Element is active');
}
```

### Modifying Content

```javascript
// Update text
element.textContent = 'New text';

// Update HTML
element.innerHTML = '<strong>Bold text</strong>';

// Update attributes
element.setAttribute('href', '/new-url');
element.dataset.value = 'new-value';

// Update styles
element.style.color = 'red';
element.style.display = 'none';
```

### Event Listeners

```javascript
// Click event
element.addEventListener('click', function(event) {
    console.log('Clicked');
});

// Form submission
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop default submit
    console.log('Form submitted');
});

// Input change
input.addEventListener('change', function(event) {
    console.log('Value changed to:', event.target.value);
});

// Key press
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        console.log('Enter pressed');
    }
});
```

## 🗂️ Component Patterns

### Card Component

```html
<div class="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
    <h3 class="font-headline-sm text-headline-sm mb-md">Card Title</h3>
    <p class="font-body-md text-body-md">Card content</p>
</div>
```

### Button Component

```html
<!-- Primary Button -->
<button class="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:bg-primary-container active:scale-95">
    Primary Action
</button>

<!-- Secondary Button -->
<button class="border border-secondary text-secondary px-lg py-sm rounded-lg font-label-md hover:bg-secondary-container">
    Secondary Action
</button>

<!-- Text Button -->
<button class="text-primary font-label-md hover:underline">
    Text Action
</button>
```

### Input Field

```html
<div class="mb-lg">
    <label class="font-label-md text-label-md text-on-surface mb-sm block">Email</label>
    <input 
        type="email" 
        class="w-full border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-primary focus:outline-none"
        placeholder="Enter email"
    >
</div>
```

### Data Table

```html
<table class="w-full border-collapse">
    <thead class="bg-surface-container-low">
        <tr>
            <th class="px-lg py-md font-label-sm text-label-sm uppercase text-on-surface-variant text-left">
                Column 1
            </th>
            <th class="px-lg py-md font-label-sm text-label-sm uppercase text-on-surface-variant text-left">
                Column 2
            </th>
        </tr>
    </thead>
    <tbody class="divide-y divide-surface-variant">
        <tr class="hover:bg-tertiary/5 transition-colors">
            <td class="px-lg py-md font-body-md text-body-md">Data 1</td>
            <td class="px-lg py-md font-body-md text-body-md">Data 2</td>
        </tr>
        <tr class="bg-tertiary/[0.02] hover:bg-tertiary/5 transition-colors">
            <td class="px-lg py-md font-body-md text-body-md">Data 3</td>
            <td class="px-lg py-md font-body-md text-body-md">Data 4</td>
        </tr>
    </tbody>
</table>
```

### Status Badge

```html
<span class="px-sm py-1 bg-primary-fixed text-on-primary-fixed-variant rounded text-label-sm font-label-md">
    Active
</span>
```

### Modal Dialog

```html
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" id="modal">
    <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl max-w-md">
        <h2 class="font-headline-sm text-headline-sm mb-lg">Confirm Action</h2>
        <p class="font-body-md text-body-md mb-lg">Are you sure?</p>
        <div class="flex gap-md justify-end">
            <button class="border border-outline-variant px-lg py-sm rounded-lg" onclick="closeModal()">
                Cancel
            </button>
            <button class="bg-primary text-on-primary px-lg py-sm rounded-lg" onclick="confirmAction()">
                Confirm
            </button>
        </div>
    </div>
</div>

<script>
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function confirmAction() {
    console.log('Action confirmed');
    closeModal();
}
</script>
```

## 📊 Working with Data

### Mock Data Patterns

```javascript
// Array of objects
const students = [
    { id: 1, name: 'John Doe', gpa: 3.8 },
    { id: 2, name: 'Jane Smith', gpa: 3.9 }
];

// Accessing data
students.forEach(student => {
    console.log(student.name, student.gpa);
});
```

### Fetching Data from API

```javascript
// GET request
fetch('/api/students')
    .then(response => response.json())
    .then(data => {
        console.log('Students:', data);
        renderStudents(data);
    })
    .catch(error => console.error('Error:', error));

// POST request
fetch('/api/students', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com'
    })
})
.then(response => response.json())
.then(data => console.log('Created:', data));
```

### Rendering Dynamic Content

```javascript
function renderStudents(students) {
    const container = document.getElementById('students-table');
    const rows = students.map(student => `
        <tr>
            <td class="px-lg py-md">${student.name}</td>
            <td class="px-lg py-md">${student.gpa}</td>
        </tr>
    `).join('');
    
    container.innerHTML = rows;
}
```

## 🔐 Security Considerations

### Input Validation

```javascript
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhoneNumber(phone) {
    const regex = /^[\d\-\(\)\s]+$/;
    return regex.test(phone) && phone.length >= 10;
}
```

### Preventing XSS

```javascript
// ❌ WRONG - Vulnerable to XSS
element.innerHTML = userInput;

// ✅ CORRECT - Safe
element.textContent = userInput;

// ✅ CORRECT - For HTML content, sanitize first
function sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}
```

### Form Validation

```javascript
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim() === '') {
        errors.push('Name is required');
    }
    
    if (!formData.email || !validateEmail(formData.email)) {
        errors.push('Valid email is required');
    }
    
    return errors;
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] All links work correctly
- [ ] Forms submit without errors
- [ ] Data displays correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] All icons display properly
- [ ] Colors match design system
- [ ] Text is readable (contrast, font size)
- [ ] No console errors (F12)
- [ ] Performance is acceptable (< 2s load time)

### Browser Compatibility

Test on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## 🚀 Deployment

### Local Deployment

```bash
# 1. Ensure all files are in the SMS folder
# 2. Start a local server
python -m http.server 8000

# 3. Open in browser
# http://localhost:8000
```

### Production Deployment

1. **Choose hosting platform** (Vercel, Netlify, AWS, etc.)
2. **Upload all files** maintaining the folder structure
3. **Configure routing** for single-page navigation
4. **Enable HTTPS** for security
5. **Set up caching** for performance
6. **Configure CORS** if using external APIs

### Pre-deployment Checklist

- [ ] All links work correctly
- [ ] No 404 errors
- [ ] No console errors
- [ ] Images load properly
- [ ] Responsive design tested
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Backup created
- [ ] Documentation updated

## 📈 Performance Optimization

### Measuring Performance

```javascript
// Measure page load time
window.addEventListener('load', function() {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page load time:', pageLoadTime, 'ms');
});
```

### Optimization Tips

1. **Lazy load images**: Use `loading="lazy"`
2. **Cache static assets**: Configure server caching
3. **Minify CSS/JS**: Use build tools if needed
4. **Use CDN**: Serve from edge locations
5. **Compress images**: Optimize file sizes
6. **Defer JavaScript**: Load non-critical JS later

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [MDN Web Docs](https://developer.mozilla.org)
- [Material Design 3](https://m3.material.io)
- [Material Symbols](https://fonts.google.com/icons)
- [JavaScript.info](https://javascript.info)

## 🐛 Debugging

### Browser DevTools

```javascript
// Console logging
console.log('Normal log');
console.warn('Warning message');
console.error('Error message');
console.table(arrayOfObjects); // Display as table

// Debugging
debugger; // Execution pauses here (F12 must be open)

// Timing
console.time('myTimer');
// ... code to time
console.timeEnd('myTimer');
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Styles not loading | Check Tailwind CDN connection |
| Icons not showing | Verify Material Symbols font loaded |
| JavaScript not working | Check console for errors (F12) |
| Page doesn't respond | Check for infinite loops |
| Data not updating | Verify fetch calls and error handling |

## 🔄 Version Control (Git)

### Basic Git Workflow

```bash
# Initialize repository
git init

# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push origin main

# Pull updates
git pull origin main
```

### .gitignore Template

```
# Dependencies
node_modules/
package-lock.json

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/

# Logs
*.log
```

---

**Need help?** Check the README.md and GETTING_STARTED.md files for additional guidance.

**Happy developing!** 🚀
