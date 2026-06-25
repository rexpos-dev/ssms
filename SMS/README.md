# Bridges Academy School Management System

A full-stack school management platform: a React + Tailwind frontend, an Express +
MySQL REST API, and a Material Design 3 inspired design system. It provides
administrative dashboards, student registration workflows, and institutional
management tools.

## Project Structure

```
SMS/
├── README.md                 # This file
├── CODE_CONVENTIONS.md       # Coding standards & folder rules — read before contributing
│
├── docs/                     # Documentation
│   ├── GETTING_STARTED.md
│   ├── DEVELOPMENT.md
│   └── DESIGN_SYSTEM.md      # Colors, spacing, typography (source of truth)
│
├── app/                      # React frontend (the product)
│   └── src/{components/ui, layouts, pages/{admin,registration}}
│
├── backend/                  # Express REST API
│   └── {config, middleware, routes}
│
├── database/
│   └── schema.sql            # MySQL schema
│
└── reference/                # Static HTML mockups (design reference only)
    └── {index.html, admin/, registration/, assets/}
```

> **`app/` is the active product.** `reference/` holds the original static HTML
> mockups, kept only for visual reference — don't build features there.

## Tech Stack

| Layer    | Stack                                                |
| -------- | ---------------------------------------------------- |
| Frontend | React 18, Vite, React Router 6, Tailwind CSS 3       |
| Backend  | Node.js, Express 4, MySQL2, JWT, bcrypt, Joi, Helmet |
| Database | MySQL 5.7+                                           |

## Getting Started

### Frontend (`app/`)

```bash
cd app
npm install
npm run dev        # Vite dev server on http://localhost:3000
```

### Backend (`backend/`)

```bash
cd backend
npm install
cp .env.example .env   # then fill in DB credentials & JWT secret
npm run dev            # nodemon on http://localhost:8080
```

### Database (`database/`)

```bash
mysql -u root -p < database/schema.sql
```

## Documentation

- [CODE_CONVENTIONS.md](CODE_CONVENTIONS.md) — coding standards & where things go
- [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) — orientation guide
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) — development patterns
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — design tokens

---

**Version**: 1.0 · **Status**: In development
