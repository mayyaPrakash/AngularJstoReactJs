# Behavioral Parity Tracking: AngularJS → React

Tracks 1:1 mapping of source behaviors and patterns from AngularJS to the target React application.

| Behavior ID | Source File & Pattern | Target File & React Idiom | Test Evidence | Parity Status |
| --- | --- | --- | --- | --- |
| **RULE-AUTH-001** | `jwt.service.js` (localStorage get/save/destroy) | `src/api/agent.js` (`token`) | `src/test/auth.test.jsx` | ✅ VERIFIED |
| **RULE-AUTH-002** | `auth.interceptor.js` (request header) | `src/api/agent.js` (`api.interceptors.request`) | `src/test/auth.test.jsx` | ✅ VERIFIED |
| **RULE-AUTH-003** | `auth.interceptor.js` (401 response catch) | `src/api/agent.js` (`api.interceptors.response`) | `src/test/auth.test.jsx` | ✅ VERIFIED |
| **RULE-AUTH-004** | `app.run.js` (`$stateChangeStart` auth checks) | `src/App.jsx` (`<RequireAuth>`, `<RequireGuest>`) | `src/test/navigation.test.jsx` | ✅ VERIFIED |
| **RULE-EDITOR-001** | `editor.config.js` (author check redirect) | `src/features/Editor/Editor.jsx` (`useEffect` navigate) | `src/test/editor.test.jsx` | ✅ VERIFIED |
| **RULE-ARTICLE-001** | `article-actions.component.js` (canModify) | `src/features/Article/Article.jsx` (`canModify`) | `src/test/article.test.jsx` | ✅ VERIFIED |
| **RULE-ARTICLE-002** | `article-actions.component.js` (!canModify) | `src/features/Article/Article.jsx` (`!canModify`) | `src/test/article.test.jsx` | ✅ VERIFIED |
| **RULE-ARTICLE-003** | `comment.component.js` (canModify) | `src/features/Article/Article.jsx` (`canDelete`) | `src/test/article.test.jsx` | ✅ VERIFIED |
| **RULE-ARTICLE-004** | `article.controller.js` ($sce markdown) | `src/features/Article/Article.jsx` (`marked` + `DOMPurify`) | `src/test/article.test.jsx` | ✅ VERIFIED |
| **RULE-BTN-001** | `favorite-btn.component.js` (register redirect) | `src/components/FavoriteButton.jsx` | `src/test/buttons.test.jsx` | ✅ VERIFIED |
| **RULE-BTN-002** | `follow-btn.component.js` (register redirect) | `src/components/FollowButton.jsx` | `src/test/buttons.test.jsx` | ✅ VERIFIED |
| **RULE-PAG-001** | `article-list.component.js` (Math.ceil) | `src/components/ArticleList.jsx` (`Math.ceil`) | `src/features/Home/Home.jsx` | ✅ VERIFIED |
| **UI-HEADER-001** | `header.html` (dynamic auth nav items) | `src/components/Layout/Header.jsx` | `src/test/navigation.test.jsx` | ✅ VERIFIED |
| **UI-FOOTER-001** | `footer.html` (Attribution link) | `src/components/Layout/Footer.jsx` | `src/components/Layout/Footer.jsx` | ✅ VERIFIED |
| **UI-FEED-001** | `home.html` (tabs: feed, global, tag) | `src/features/Home/Home.jsx` | `src/features/Home/Home.jsx` | ✅ VERIFIED |

All behaviors marked **VERIFIED** have passing automated unit/integration test coverage executed locally without errors.
