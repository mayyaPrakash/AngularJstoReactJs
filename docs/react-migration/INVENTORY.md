# Migration Inventory

## Source Application: AngularJS RealWorld Example App (`angularjs-realworld-example-app-master`)
## Target Application: React Conduit (`react-conduit`)

### 1. Routes & Pages

| AngularJS Route / State | Target Route | Target Component | Auth Guard | Status |
| --- | --- | --- | --- | --- |
| `app.home` (`/`) | `/` | `features/Home/Home.jsx` | Public | ✅ Migrated |
| `app.login` (`/login`) | `/login` | `features/Auth/Auth.jsx` | Guest only (`RequireGuest`) | ✅ Migrated |
| `app.register` (`/register`) | `/register` | `features/Auth/Auth.jsx` | Guest only (`RequireGuest`) | ✅ Migrated |
| `app.article` (`/article/:slug`) | `/article/:slug` | `features/Article/Article.jsx` | Public (author actions protected) | ✅ Migrated |
| `app.editor` (`/editor`) | `/editor` | `features/Editor/Editor.jsx` | Auth only (`RequireAuth`) | ✅ Migrated |
| `app.editor` (`/editor/:slug`) | `/editor/:slug` | `features/Editor/Editor.jsx` | Auth + Author only | ✅ Migrated |
| `app.settings` (`/settings`) | `/settings` | `features/Settings/Settings.jsx` | Auth only (`RequireAuth`) | ✅ Migrated |
| `app.profile.main` (`/@:username`) | `/@:username` | `features/Profile/Profile.jsx` (`ProfileArticles`) | Public | ✅ Migrated |
| `app.profile.favorites` (`/@:username/favorites`) | `/@:username/favorites` | `features/Profile/Profile.jsx` (`ProfileFavorites`) | Public | ✅ Migrated |

### 2. Services & Utilities

| AngularJS Service / Config | Target Module | Replacement Description | Status |
| --- | --- | --- | --- |
| `services/user.service.js` | `api/agent.js` + `context/AuthContext.jsx` | Axios Auth methods + React AuthContext state provider | ✅ Migrated |
| `services/jwt.service.js` | `api/agent.js` (`token`) | `localStorage` token helper (`get`, `save`, `destroy`) | ✅ Migrated |
| `services/articles.service.js` | `api/agent.js` (`Articles`) | Axios Articles client (`all`, `feed`, `get`, `create`, `update`, `del`, `favorite`, `unfavorite`, `byAuthor`, `byTag`, `favoritedBy`) | ✅ Migrated |
| `services/comments.service.js` | `api/agent.js` (`Comments`) | Axios Comments client (`forArticle`, `create`, `del`) | ✅ Migrated |
| `services/profile.service.js` | `api/agent.js` (`Profile`) | Axios Profile client (`get`, `follow`, `unfollow`) | ✅ Migrated |
| `services/tags.service.js` | `api/agent.js` (`Tags`) | Axios Tags client (`getAll`) | ✅ Migrated |
| `config/auth.interceptor.js` | `api/agent.js` | Axios request/response interceptors (Bearer/Token header, 401 handling) | ✅ Migrated |
| `config/app.constants.js` | `api/agent.js` | `API_ROOT` and `APP_NAME` configuration | ✅ Migrated |

### 3. Components & Directives

| AngularJS Component / Directive | Target React Component | Description | Status |
| --- | --- | --- | --- |
| `layout/header.component.js` + `.html` | `components/Layout/Header.jsx` | Navigation bar with dynamic auth links & profile pill | ✅ Migrated |
| `layout/footer.component.js` + `.html` | `components/Layout/Footer.jsx` | Conduit footer attribution with dynamic current year | ✅ Migrated |
| `components/article-helpers/article-list.component.js` | `components/ArticleList.jsx` | Reusable paginated article list with limit prop | ✅ Migrated |
| `components/article-helpers/article-preview.component.js` | `components/ArticlePreview.jsx` | Article card preview with author meta, tags, and favorite count | ✅ Migrated |
| `components/article-helpers/article-meta.component.js` | `components/ArticleMeta.jsx` | Author avatar, username link, publication date, action slot | ✅ Migrated |
| `components/buttons/favorite-btn.component.js` | `components/FavoriteButton.jsx` | Favorite toggle button with counter and guest redirect | ✅ Migrated |
| `components/buttons/follow-btn.component.js` | `components/FollowButton.jsx` | Follow / Unfollow user button with guest redirect | ✅ Migrated |
| `components/list-errors.component.js` | `components/ListErrors.jsx` | Conduit error list formatting server validation messages | ✅ Migrated |
| `components/show-authed.directive.js` | `context/useAuth.js` (`isAuthenticated`) | Conditional rendering based on auth context | ✅ Migrated |
