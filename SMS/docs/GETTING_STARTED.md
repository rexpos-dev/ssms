# Getting Started with Bridges Academy SMS

Welcome to the complete Bridges Academy School Management System project. This guide will help you navigate the project structure and get started with development.

## 📦 What You Have

You have a complete, production-ready UI implementation of a school management system with:

- **11 Portal Pages**: Fully functional HTML pages with embedded styles and scripts
- **Design System**: Complete Material Design 3 inspired documentation
- **UI Mockups**: High-fidelity mockup screenshots for reference
- **Zero Dependencies**: No npm install or build process needed
- **Fully Responsive**: Works on mobile, tablet, and desktop

## 🚀 Quick Start (5 minutes)

### 1. Open the Welcome Page

Simply open `index.html` in your web browser:

```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html

# Or just drag and drop into your browser
```

This page provides navigation to all portals and sections.

### 2. Explore the Admin Portal

Click on any admin page to see fully functional interfaces:

- **Dashboard** - Main admin overview with KPIs and analytics
- **Student Directory** - Student search and management
- **Faculty Management** - Staff records and performance
- **Academic Calendar** - Schedule and event management
- **Financial Reports** - Financial analytics and dashboards
- **Reports Hub** - Comprehensive reporting interface
- **System Settings** - Admin configuration panel
- **Student Requirements** - Prerequisite tracking

### 3. Preview the Registration Flow

Walk through the student registration process:

1. Academic History - Student background information
2. Document Upload - Required document submission
3. Review & Submit - Final confirmation

### 4. Review Design System

Open `design/DESIGN_SYSTEM.md` to understand:
- Color palette and usage
- Typography hierarchy
- Component specifications
- Responsive design breakpoints
- Spacing and layout rules

## 📁 Project Structure

```
SMS/
├── index.html                  # Main welcome & navigation page
├── README.md                   # Complete documentation
├── GETTING_STARTED.md         # This file
├── admin/                      # Admin Portal Pages
│   ├── dashboard.html
│   ├── student-directory.html
│   ├── faculty-management.html
│   ├── academic-calendar.html
│   ├── financial-reports.html
│   ├── reports-hub.html
│   ├── system-settings.html
│   └── student-requirements.html
├── registration/              # Student Registration Flow
│   ├── academic-history.html
│   ├── document-upload.html
│   └── review-submit.html
├── design/                    # Design Resources
│   └── DESIGN_SYSTEM.md      # Design system documentation
├── assets/                    # Media and Resources
│   ├── mockups/              # UI mockup screenshots
│   │   ├── admin-dashboard.png
│   │   ├── student-directory.png
│   │   ├── faculty-management.png
│   │   ├── academic-calendar.png
│   │   ├── financial-reports.png
│   │   ├── reports-hub.png
│   │   ├── system-settings.png
│   │   ├── student-requirements.png
│   │   ├── registration-academic-history.png
│   │   ├── registration-document-upload.png
│   │   └── registration-review-submit.png
│   └── images/               # Additional assets (empty - ready for images)
└── Bridges-Academy-SMS.zip   # Complete project archive
```

## 💻 Development Guide

### Understanding the Code Structure

Each HTML page has this structure:

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Meta tags -->
    <!-- Tailwind CSS from CDN -->
    <!-- Fonts & Icons from Google -->
    <!-- Tailwind Config -->
    <!-- Custom Styles -->
  </head>
  <body>
    <!-- Navigation & Layout -->
    <!-- Page Content -->
    <!-- JavaScript for interactivity -->
  </body>
</html>
```

### Key Technologies

- **Tailwind CSS**: Utility-first CSS framework (no build needed, using CDN)
- **Material Symbols**: Google's icon library for icons
- **Inter Font**: Modern, accessible typography
- **Vanilla JavaScript**: No frameworks, pure JS for interactivity

### Customizing Colors

To change the color scheme, edit the Tailwind config in any HTML file:

```javascript
// In the <script id="tailwind-config"> section
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: "#000666",        // Change this
                secondary: "#4a626d",      // Change this
                // ... other colors
            }
        }
    }
}
```

Then refresh the page to see changes immediately.

### Adding New Content

1. **Edit Text**: Modify HTML directly
2. **Change Icons**: Update the Material Symbol name
3. **Adjust Spacing**: Modify Tailwind classes (p-lg, m-xl, etc.)
4. **Update Data**: Edit table rows and content

Example - Change a student name:

```html
<!-- Before -->
<td>Elena Sterling</td>

<!-- After -->
<td>Your Student Name</td>
```

### Adding a New Page

1. Copy an existing page with similar structure
2. Update the title and content
3. Link it from index.html or navigation
4. All styles are already configured

### Common Tailwind Classes

```html
<!-- Spacing -->
<div class="p-lg">Padding large</div>
<div class="m-md">Margin medium</div>

<!-- Colors -->
<div class="bg-primary text-on-primary">Primary button</div>
<div class="bg-secondary-container">Secondary container</div>

<!-- Layout -->
<div class="flex gap-md">Flex container with gap</div>
<div class="grid grid-cols-4 gap-lg">4 column grid</div>

<!-- Typography -->
<h1 class="font-headline-lg text-headline-lg">Large headline</h1>
<p class="font-body-md text-body-md">Regular body text</p>

<!-- Responsive -->
<div class="hidden lg:block">Only on desktop</div>
<div class="lg:col-span-8">8 columns on desktop</div>
```

## 🎯 Common Tasks

### Change the Primary Color

1. Open any HTML file in a text editor
2. Find the `tailwind.config` section
3. Update `"primary": "#000666"` to your color
4. Save and refresh

### Add a New Navigation Link

In the sidebar or header HTML, add:

```html
<a href="path/to/page.html" class="flex items-center gap-md px-md py-sm">
  <span class="material-symbols-outlined">icon_name</span>
  <span>Label</span>
</a>
```

### Create a New Form

Use the input field pattern:

```html
<label class="font-label-md text-label-md mb-sm">Label</label>
<input 
  type="text" 
  class="w-full border border-outline-variant rounded-lg px-md py-sm"
  placeholder="Placeholder text"
>
```

### Add a Data Table

Copy the existing table structure and update:
- Table headers in `<thead>`
- Table rows in `<tbody>`
- Update column styling as needed

### Create a Modal/Dialog

```html
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div class="bg-white rounded-xl p-xl max-w-md">
    <h2 class="font-headline-sm text-headline-sm mb-lg">Title</h2>
    <p class="font-body-md text-body-md mb-lg">Content</p>
    <button class="bg-primary text-on-primary px-lg py-sm rounded-lg">
      Action
    </button>
  </div>
</div>
```

## 🔧 Troubleshooting

### Page Doesn't Load Styles

- Ensure you're opening the HTML in a browser (not just viewing source)
- Check that Tailwind CDN is accessible (you need internet connection initially)
- Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)

### Icons Not Showing

- Material Symbols font must load (requires internet connection)
- Check the icon name is correct at https://fonts.google.com/icons
- Use exact spelling (e.g., `dashboard` not `Dashboard`)

### Responsive Design Not Working

- Test in browser's responsive mode (F12 → Device Toolbar)
- Common breakpoints: 768px (tablet), 1024px (desktop)
- Tailwind uses `md:`, `lg:` prefixes for responsive

### Colors Look Different

- Different monitors display colors differently
- Check browser's color accuracy (usually 100% zoom)
- Verify the hex color code in the Tailwind config matches your design

## 📊 Design System Reference

### Color Usage

| Name | Hex | Usage |
|------|-----|-------|
| Primary | #000666 | Main branding, primary buttons |
| Secondary | #4a626d | Secondary actions, accents |
| Error | #ba1a1a | Error states, alerts |
| Success | (See DESIGN_SYSTEM.md) | Success indicators |
| Surface | #f4faff | Backgrounds, containers |

### Typography Hierarchy

```
Headline XL (40px) - Page titles
Headline LG (32px) - Section titles
Headline MD (24px) - Card titles
Headline SM (20px) - Subsection titles
Body LG (18px) - Long-form content
Body MD (16px) - Standard body text
Body SM (14px) - Secondary text
Label MD (14px) - Form labels
Label SM (12px) - Metadata
```

### Spacing Unit

All spacing is based on 4px units:
- xs = 4px
- sm = 8px
- md = 16px
- lg = 24px
- xl = 32px
- xxl = 48px

### Border Radius

- sm = 2px (smallest elements)
- DEFAULT = 4px (buttons, inputs)
- md = 6px (cards)
- lg = 8px (large cards, dialogs)
- xl = 12px (dashboard widgets)

## 🚀 Next Steps

### For Designers

1. Review DESIGN_SYSTEM.md for complete specifications
2. Use mockup images as reference
3. Propose changes to the design team
4. Export assets for development

### For Developers

1. Set up your code editor (VS Code recommended)
2. Start with the dashboard.html to understand structure
3. Create a local development server (optional):
   ```bash
   python -m http.server 8000
   # Then open http://localhost:8000
   ```
4. Modify and test changes in real-time

### For Project Managers

1. Review all pages in index.html
2. Test functionality on different devices
3. Gather feedback from stakeholders
4. Plan development timeline

### For Integration

1. Identify backend API endpoints needed
2. Create API integration layer
3. Replace mock data with live data
4. Add authentication and security

## 📞 Support

For questions about:
- **Design System**: See design/DESIGN_SYSTEM.md
- **Component Usage**: Review similar components in existing pages
- **Tailwind CSS**: Visit https://tailwindcss.com
- **Material Design**: Visit https://m3.material.io

## 📝 Version History

- **v1.0** (June 2026): Initial release
  - 8 admin portal pages
  - 3-step registration flow
  - Complete design system
  - 11 UI mockups
  - Zero dependencies setup

## ✅ Checklist for Getting Started

- [ ] Open index.html in browser
- [ ] Explore all admin pages
- [ ] Walk through registration flow
- [ ] Review design/DESIGN_SYSTEM.md
- [ ] Check mockups in assets/mockups/
- [ ] Identify customization needs
- [ ] Plan development timeline
- [ ] Set up code editor
- [ ] Create local development server (optional)
- [ ] Start implementing features

---

**Happy coding! 🎉**

The Bridges Academy SMS is ready for development. Start with the index.html page and explore the system to understand the current design and structure.
