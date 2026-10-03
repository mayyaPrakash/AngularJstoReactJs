# AngularJS to React Migration: RealWorld Conduit

This repository contains the complete migration of the [RealWorld Conduit](https://github.com/gothinkster/realworld) application from legacy **AngularJS 1.5.x** to modern **React 19 + Vite**.

## Repository Overview

- **`angularjs-realworld-example-app-master/`** — The baseline legacy AngularJS 1.5.x application using UI-Router, Browserify, and Gulp.
- **`react-conduit/`** — The modern migrated React 19 application built with Vite, React Router v7, Axios, and Vitest.
- **`docs/react-migration/`** — Formal migration records and verification documents:
  - `STATE.md` — Migration audit state and progress tracking.
  - `INVENTORY.md` — Complete inventory of routes, services, components, and templates.
  - `BEHAVIOR.md` — Source-derived business rules, permission checks, and behavior specifications.
  - `PLAN.md` — Target architecture and execution phases.
  - `PARITY.md` — 1:1 behavioral parity mapping (AngularJS source → React implementation).
  - `VERIFICATION.md` — Executed test results, build outputs, and evidence.

---

## Migrated React Application (`react-conduit`)

### Features Implemented
- **Authentication**: JWT token management, login/registration forms, session restore, 401 interceptor handling.
- **Global & Personal Feeds**: Public articles, user feed, tag-filtered feed, and popular tag sidebar.
- **Article Details & Comments**: Markdown parsing (`marked`) with XSS sanitization (`dompurify`), comment author delete permissions.
- **Article Editor**: Create and edit modes with tag list pills and author permission protection.
- **User Profile**: Nested tabs for user articles and favorited articles, profile follow/unfollow toggle.
- **Settings**: Profile information management, password update, logout.
- **Route Guards**: `<RequireAuth>` and `<RequireGuest>` route protection.

---

## Getting Started

### Running the React Application
```bash
cd react-conduit
npm install
npm run dev
```
The application will start on `http://localhost:4000/` (or default Vite port).

### Running Tests
```bash
cd react-conduit
npm test
```
Runs the full Vitest suite covering authentication, permissions, buttons, and navigation (18/18 tests passing).

### Building for Production
```bash
cd react-conduit
npm run build
```

### Running Linter
```bash
cd react-conduit
npm run lint
```
Runs `oxlint` with 0 warnings and 0 errors.

---

## License
MIT
