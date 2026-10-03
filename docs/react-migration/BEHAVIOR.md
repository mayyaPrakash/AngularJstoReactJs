# Source-Derived Behavior Contract: Conduit Application

All behavior specifications are derived directly from the source AngularJS code in `angularjs-realworld-example-app-master/src/js/`.

| Rule ID | Module | Source Line / Reference | Behavior Specification | Target Implementation |
| --- | --- | --- | --- | --- |
| **RULE-AUTH-001** | Auth | `services/jwt.service.js:10-18` | JWT token must be stored under localStorage key `jwtToken`, and destroyed on logout/401. | `api/agent.js:token` |
| **RULE-AUTH-002** | Auth | `config/auth.interceptor.js:10-14` | When token exists, HTTP request header `Authorization: Token <jwtToken>` must be attached. | `api/agent.js:api.interceptors` |
| **RULE-AUTH-003** | Auth | `config/auth.interceptor.js:18-24` | 401 response from server triggers token destruction and reload/reset. | `api/agent.js:api.interceptors` |
| **RULE-AUTH-004** | Route | `config/app.run.js:14-25` | Routes with `auth: true` redirect unauthenticated visitors to `/login`. Routes with `auth: false` redirect authenticated visitors to `/`. | `App.jsx:RequireAuth` & `RequireGuest` |
| **RULE-EDITOR-001** | Editor | `editor/editor.config.js:18-24` | When editing an existing article, only the author is permitted. Non-authors are redirected away (`$state.go('app.home')`). | `features/Editor/Editor.jsx` (verified in `editor.test.jsx`) |
| **RULE-ARTICLE-001** | Article | `article/article-actions.component.js:12-18` | Edit and Delete controls are rendered if and only if `currentUser.username === article.author.username`. | `features/Article/Article.jsx` (verified in `article.test.jsx`) |
| **RULE-ARTICLE-002** | Article | `article/article-actions.component.js:12-18` | Follow and Favorite buttons are rendered if and only if viewer is not the article author. | `features/Article/Article.jsx` (verified in `article.test.jsx`) |
| **RULE-ARTICLE-003** | Article | `article/comment.component.js:11-13` | Delete comment trash icon is displayed if and only if `currentUser.username === comment.author.username`. | `features/Article/Article.jsx` (verified in `article.test.jsx`) |
| **RULE-ARTICLE-004** | Article | `article/article.controller.js:20-22` | Article markdown body must be parsed and sanitized before rendering in DOM. | `features/Article/Article.jsx` (`marked` + `DOMPurify`) |
| **RULE-BTN-001** | Buttons | `components/buttons/favorite-btn.component.js:14-17` | If an unauthenticated user clicks favorite, they must be redirected to `/register`. | `components/FavoriteButton.jsx` (verified in `buttons.test.jsx`) |
| **RULE-BTN-002** | Buttons | `components/buttons/follow-btn.component.js:14-17` | If an unauthenticated user clicks follow, they must be redirected to `/register`. | `components/FollowButton.jsx` (verified in `buttons.test.jsx`) |
| **RULE-PAG-001** | ArticleList | `components/article-helpers/article-list.component.js:69` | `totalPages` is calculated as `Math.ceil(articlesCount / limit)`. | `components/ArticleList.jsx` |
| **RULE-PAG-002** | ArticleList | `components/article-helpers/article-list.component.js:57` | Query offset is `limit * (currentPage - 1)` (1-indexed in UI, 0-indexed in API parameter). | `api/agent.js:limit` |
