# Code Conventions — Bridges Academy SMS

This document defines the coding standards and folder organization for the Bridges
Academy School Management System. Follow it for every new file and when refactoring
existing ones. The goal is a predictable codebase where any contributor can guess
where a thing lives and how it should be written.

The project is **full-stack**:

| Layer        | Location     | Stack                                        |
| ------------ | ------------ | -------------------------------------------- |
| Frontend     | `app/`       | React 18 + Vite + React Router + Tailwind 3  |
| Backend API  | `backend/`   | Node.js + Express 4 + MySQL2 + JWT           |
| Database     | `database/`  | MySQL 5.7+ (schema in `schema.sql`)          |
| Reference UI | `reference/` | Static HTML mockups (read-only, no build)    |
| Docs         | `docs/`      | Markdown guides + design system              |

The **React app (`app/`) is the product going forward.** The static HTML in
`reference/` is kept only as a visual/design reference — do not add features there.

---

## 1. Repository Structure

```
SMS/
├── README.md                 # Project overview + how to run
├── CODE_CONVENTIONS.md       # This file
│
├── docs/                     # All long-form documentation
│   ├── GETTING_STARTED.md
│   ├── DEVELOPMENT.md
│   └── DESIGN_SYSTEM.md      # Source of truth for colors/spacing/typography
│
├── app/                      # React frontend (PRIMARY)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .eslintrc.cjs
│   └── src/
│       ├── main.jsx          # Entry point
│       ├── App.jsx           # Routes
│       ├── index.css         # Tailwind layers + global utilities
│       ├── components/
│       │   ├── ui/           # Reusable, presentational primitives
│       │   └── ProtectedRoute.jsx   # Non-ui shared components live here
│       ├── context/          # React context providers (AuthContext, ...)
│       ├── layouts/          # Page shells (Layout, Sidebar, Header)
│       └── pages/            # Route-level screens, grouped by domain
│           ├── admin/
│           ├── auth/
│           └── registration/
│
├── backend/                  # Express REST API
│   ├── server.js             # App bootstrap + route registration
│   ├── package.json
│   ├── .env.example          # Template for required env vars (never commit .env)
│   ├── config/               # Infra config (database pool, etc.)
│   ├── middleware/           # Cross-cutting request handlers (auth, etc.)
│   └── routes/               # One file per resource (auth, students, ...)
│
├── database/
│   └── schema.sql            # Full MySQL schema (tables, indexes, FKs)
│
└── reference/                # Static HTML mockups — reference only
    ├── index.html
    ├── admin/
    ├── registration/
    └── assets/mockups/
```

### Where does a new file go?

| You are adding…                          | Put it in…                          |
| ---------------------------------------- | ----------------------------------- |
| A reusable button/card/input/etc.        | `app/src/components/ui/`            |
| A non-ui shared component (e.g. a guard) | `app/src/components/`              |
| A React context provider                 | `app/src/context/`                |
| A full page tied to a route              | `app/src/pages/<domain>/`          |
| A page shell / nav / header              | `app/src/layouts/`                 |
| A new API resource                       | `backend/routes/<resource>.js`     |
| Shared request logic (auth, validation)  | `backend/middleware/`              |
| A new DB table                           | `database/schema.sql`              |
| A how-to or reference doc                | `docs/`                            |

---

## 2. Naming Conventions

| Thing                        | Convention             | Example                         |
| ---------------------------- | ---------------------- | ------------------------------- |
| React component file         | `PascalCase.jsx`       | `StudentDirectory.jsx`          |
| React component / hook export| `PascalCase` / `useX`  | `Button`, `useEnrollment`       |
| Non-component JS file        | `camelCase.js`         | `formatDate.js`                 |
| Barrel file                  | `index.js`             | `components/ui/index.js`        |
| Folder                       | `kebab-case` / lower   | `pages/admin/`                  |
| Backend route file           | lowercase, plural noun | `routes/students.js`            |
| Backend function/variable    | `camelCase`            | `generateToken`, `pool`         |
| Env variable                 | `UPPER_SNAKE_CASE`     | `JWT_SECRET`                    |
| SQL table                    | `snake_case`, plural   | `student_enrollments`           |
| SQL column                   | `snake_case`           | `first_name`, `created_at`      |
| Static HTML page             | `kebab-case.html`      | `academic-calendar.html`        |
| Image / mockup asset         | `kebab-case.png`       | `admin-dashboard.png`           |

Avoid abbreviations unless they're domain-standard (`gpa`, `id`, `url`). Names
should read like the surrounding code.

---

## 3. Frontend (React) Conventions

### Components

- **Function components only**, with arrow-function declarations and a named export
  plus a `default` export (matches the existing `ui/` primitives):

  ```jsx
  export const Badge = ({ children, variant = 'primary', size = 'md' }) => {
    // ...
  };

  export default Badge;
  ```

- **Props**: destructure in the signature, give sensible defaults, and spread the
  rest onto the root element when the component wraps a native one:

  ```jsx
  export const Button = ({ variant = 'primary', size = 'md', className = '', ...props }) => (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
  ```

- **Variant/size maps**: express style options as plain objects keyed by prop value
  (see `Button`, `Badge`). Do not build class strings with conditional chains.

- **`className` passthrough**: every reusable component accepts a `className` prop and
  appends it last so callers can extend styles.

### Folder roles

- `components/ui/` — small, **presentational, reusable** primitives. No routing, no
  data fetching, no business logic. Import them via the barrel:
  `import { Card, Button } from '../../components/ui';`
- `layouts/` — structural shells composed of `ui` pieces (`Layout` wraps `Sidebar`
  + `Header`). Import via `import { Layout } from '../layouts';`
- `pages/<domain>/` — one component per route. Pages may hold state, compose `ui`
  components, and (eventually) call the API. Group by domain (`admin`,
  `registration`), not by type.

### Imports

- Prefer the **barrel** (`index.js`) for `ui` and `layouts`, not deep file paths.
- Order: external packages → internal modules → relative files.
- Keep relative depth shallow; if `../../../` appears often, the file is misplaced.

### State & context

- Cross-cutting client state (auth, theme) lives in `context/` as a Provider +
  matching `useX` hook (see `AuthContext` / `useAuth`). Wrap the app with the
  provider in `main.jsx`; consume via the hook, never by importing the raw context.
- Talk to the API with `fetch` against `import.meta.env.VITE_API_URL` (configure it
  in `app/.env`; never hard-code the host). Persist tokens under the `sms_` key
  prefix in `localStorage`.

### Routing

- All routes live in `app/src/App.jsx`. Admin routes are wrapped in `AdminLayout`;
  registration steps render standalone. Use `<Navigate>` for fallbacks.
- Guard authenticated screens with `ProtectedRoute` (optionally `requiredRole`).

### Styling — Tailwind + design tokens

- **Use design-system tokens, never raw hex or arbitrary px.** Colors, spacing,
  typography, and radii are defined in `app/tailwind.config.js` and documented in
  `docs/DESIGN_SYSTEM.md`.
- Spacing scale (4px base): `xs`(4) `sm`(8) `md`(16) `lg`(24) `xl`(32) `xxl`(48).
  Use `p-md`, `gap-lg`, `mb-sm` — not `p-4`, `gap-6`.
- Color usage: `bg-primary text-on-primary`, `border-outline-variant`,
  `text-on-surface-variant`. Always pair a surface color with its `on-*` text color.
- Typography: pair the font + size token, e.g. `font-headline-sm text-headline-sm`.
- Responsive: mobile-first; layer `md:` and `lg:` prefixes.
- Reusable class combos live as component classes in `index.css`
  (`.card`, `.btn-primary`, `.input-field`). Reuse them instead of repeating utility
  strings.

### Icons

- Use `lucide-react` in the React app (`import { Menu } from 'lucide-react'`). The
  static `reference/` site uses Material Symbols — do not mix the two in `app/`.

---

## 4. Backend (Express) Conventions

### Module system

- The backend is **CommonJS** (`require` / `module.exports`), per
  `backend/package.json` (`"type": "commonjs"`). The frontend is ESM. Do not mix.

### File layout

- `config/` — connections and infra (e.g. `database.js` exports a configured pool).
- `middleware/` — reusable `(req, res, next)` handlers and helpers (`auth.js`
  exports `authenticate`, `authorize`, `generateToken`, `hashPassword`, …).
- `routes/` — **one file per resource**, each exporting an `express.Router()`.
  Register every router in `server.js` under `/api/<resource>`.

### Route handlers

- Use `async`/`await`. `express-async-errors` is loaded, so thrown errors reach the
  global error handler — but the existing code also uses explicit `try/catch`; match
  the file you are editing.
- **Always use parameterized queries** (`?` placeholders). Never string-concatenate
  user input into SQL.
- Acquire and **release** pool connections:

  ```js
  const connection = await pool.getConnection();
  const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
  connection.release();
  ```

- **Response shape** — be consistent:
  - Success: `res.json({ success: true, ...data })`
  - Client/auth error: appropriate 4xx + `{ error: 'message' }`
  - Server error: 500 + `{ error: 'Internal server error' }`
- **Status codes**: 400 validation, 401 unauthenticated, 403 unauthorized,
  404 not found, 500 server error.

### Auth & security

- Protect routes with `authenticate`; gate by role with `authorize('admin', ...)`.
- Hash passwords with `hashPassword` (bcrypt, salt rounds 10). Never store or log
  plaintext passwords, tokens, or password hashes.
- Sign tokens via `generateToken`; secrets come from env, never hard-coded.
- `helmet` and `cors` are configured in `server.js` — keep them enabled.

### Configuration

- All config comes from environment variables via `dotenv`. Document every new var
  in `backend/.env.example` with a safe placeholder.
- **Never commit a real `.env`.** No secrets in source — the defaults currently
  inlined in `config/database.js` and `middleware/auth.js` are dev fallbacks only and
  must not be relied on in production.

### Section banners

Existing files use banner comments to separate sections; keep the style consistent:

```js
// ============================================================
// LOGIN
// ============================================================
```

---

## 5. Database (SQL) Conventions

- Tables: `snake_case`, **plural** (`students`, `class_schedules`).
- Columns: `snake_case`. Primary key is `id INT PRIMARY KEY AUTO_INCREMENT`.
- Foreign keys: `<entity>_id` referencing `<entity_plural>(id)`, with an explicit
  `FOREIGN KEY ... ON DELETE` rule.
- Timestamps: `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP` and
  `updated_at ... ON UPDATE CURRENT_TIMESTAMP` on mutable tables.
- Enumerable states use `ENUM(...)` with a `DEFAULT` (e.g. `status`, `role`).
- Index columns you filter/join on: `INDEX idx_<column> (<column>)`.
- Composite uniqueness: `UNIQUE KEY unique_<name> (...)`.
- Use `CREATE TABLE IF NOT EXISTS`. Group related tables under section banners.

> Note: `schema.sql` currently contains a typo — `CREATE TABLE IF NULL NOT EXISTS
> student_grades` should be `CREATE TABLE IF NOT EXISTS`. Fix when next editing.

---

## 6. General

### Formatting

- 2-space indentation across JS/JSX/SQL.
- Semicolons in JS/JSX. Single quotes for strings (double quotes in JSX attributes).
- Run `npm run lint` in `app/` before committing frontend changes.

### Comments

- Comment the *why*, not the *what*. Match the comment density of the file you edit.
- Use the `// ===` section banners only where the file already establishes that style
  (backend, SQL).

### Git

- Branch off the default branch for changes; do not commit straight to it.
- Commit messages: imperative mood, present tense ("Add student search filter").
- **Never commit**: `node_modules/`, `.env`, build output (`dist/`), `*.log`,
  `.DS_Store`/`Thumbs.db`, or distribution `*.zip` archives.

### Documentation

- `docs/DESIGN_SYSTEM.md` is the source of truth for visual tokens — update it when
  tokens change, then mirror into `tailwind.config.js`.
- Update `README.md` when the structure or run steps change.
