# Migration Architecture & Execution Plan: RealWorld Conduit

## Target Architecture
- **Framework:** React 19 + Vite 8
- **Routing:** React Router v7 (`BrowserRouter`, `Routes`, `Route`, `Navigate`, `Outlet`, `useParams`, `useNavigate`)
- **State Management:** React Context API (`AuthContext`, `useAuth`) for authentication state, user identity, and token storage
- **API Layer:** Axios HTTP client with centralized endpoints (`src/api/agent.js`), request token interceptor, and 401 response handling
- **Markdown & Sanitization:** `marked` for CommonMark parsing + `dompurify` for XSS protection
- **Styles:** Retains authentic Conduit RealWorld CSS & Ionicons CDN stylesheets in `index.html` to guarantee 100% visual parity
- **Testing:** Vitest 5 + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`

## Execution Phases Completed
1. **Foundation & Scaffolding:**
   - Initialized Vite + React template
   - Configured `index.html` with external Conduit stylesheets, Ionicons, and Google Fonts
   - Built centralized Axios client `src/api/agent.js` with auth interceptors
2. **State & Providers:**
   - Implemented `AuthContext` and `useAuth` hook with localStorage JWT persistence
   - Implemented session auto-restore on mount
3. **Core Shared Components:**
   - `Header` and `Footer` with conditional auth state links
   - `ArticleList`, `ArticlePreview`, `ArticleMeta`
   - `FavoriteButton` and `FollowButton` with guest redirect
   - `ListErrors` for backend validation errors
4. **Feature Pages:**
   - `Home`: Global Feed, Personal Feed, and Tag filtering
   - `Auth`: Single component handling both Sign In and Sign Up modes
   - `Article`: Full article detail view, markdown rendering, comment feed, comment creation/deletion, author controls
   - `Editor`: Create and edit modes with tag list pills and author permission check
   - `Profile`: Nested routes for author articles and favorited articles
   - `Settings`: User profile editor and logout trigger
5. **Quality & Verification:**
   - Zero lint errors with `oxlint`
   - Production bundle build validated with `vite build`
   - Automated unit & integration test suite (18 tests) covering auth, permissions, buttons, and navigation
   - Dev server running on `http://localhost:4000/`
