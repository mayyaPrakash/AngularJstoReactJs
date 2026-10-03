# Migration State

## Active Project: AngularJS RealWorld Example App → React (Vite + Modern React 19)

- **Date:** 2026-10-03 UTC
- **Source Application:** `angularjs-realworld-example-app-master` (AngularJS 1.5.x, UI-Router, Browserify)
- **Target Application:** `react-conduit` (React 19, React Router v7, Axios, DOMPurify, Marked, Vitest)
- **Status:** **MIGRATED & VERIFIED**
- **Vite Dev Server:** Running on `http://localhost:4000/`
- **Build Verification:** `vite build` completed successfully (97 modules transformed, 0 errors)
- **Lint Verification:** `oxlint` completed with 0 errors and 0 warnings across all 20 files
- **Automated Test Suite:** Vitest test suite with 5 test files, 18 automated tests passing (100% pass rate)

## Verified Feature Modules
1. **Authentication & Session (`/login`, `/register`, JWT Lifecycle)**:
   - Full JWT token persistence in `localStorage`
   - Dynamic user login/registration API requests
   - Context-level session verification on initial load
   - Automatic logout and token destruction on 401 response or explicit user logout
2. **Article Browsing & Feeds (`/`, Global Feed, Your Feed, Tag Filter)**:
   - Active tab switching (Your Feed vs Global Feed vs Tag)
   - Popular tag list loading and tag filtering
   - Pagination calculation matching original Conduit specification (`limit`, `offset`, `totalPages`)
3. **Article Detail & Markdown Sanitization (`/article/:slug`)**:
   - Article fetching by slug
   - Marked markdown rendering sanitized with DOMPurify
   - Author permissions: only article author sees "Edit Article" and "Delete Article"
   - Viewer actions: non-authors see "Follow {author}" and "Favorite Article ({count})"
   - Comments thread with delete capability restricted strictly to comment author
4. **Editor (`/editor`, `/editor/:slug`)**:
   - Create mode and edit mode
   - Strict author permission guard: non-author navigating to `/editor/:slug` redirected to `/`
   - Tag addition (Enter key) and removal
   - Article update or create API dispatch
5. **Profile & User Favorites (`/@:username`, `/@:username/favorites`)**:
   - Profile bio, user picture, Follow / Edit Settings button
   - Nested tabs for My Articles and Favorited Articles
   - Independent pagination with author/favorite filters (limit 5)
6. **Settings (`/settings`)**:
   - Update user profile fields (image, username, bio, email, password)
   - Logout button with session clearance and redirect to Home
7. **Route Guards**:
   - `RequireAuth`: redirects unauthenticated users to `/login`
   - `RequireGuest`: redirects authenticated users to `/`
   - Action buttons (Favorite / Follow): redirects unauthenticated guests to `/register`

## Test Execution Evidence
- `src/test/auth.test.jsx`: 5/5 passed
- `src/test/editor.test.jsx`: 3/3 passed
- `src/test/article.test.jsx`: 3/3 passed
- `src/test/buttons.test.jsx`: 5/5 passed
- `src/test/navigation.test.jsx`: 2/2 passed
- **Total:** 18 passed tests in 5 test files.
