import axios from 'axios';

const API_ROOT = 'https://conduit.productionready.io/api';
const JWT_KEY = 'jwtToken';

// ── Token helpers (replaces JWT service) ──────────────────────
const token = {
  get: () => window.localStorage.getItem(JWT_KEY),
  save: (t) => window.localStorage.setItem(JWT_KEY, t),
  destroy: () => window.localStorage.removeItem(JWT_KEY),
};

// ── Axios instance with interceptor (replaces auth.interceptor) ──
const api = axios.create({ baseURL: API_ROOT });

api.interceptors.request.use((config) => {
  const jwt = token.get();
  if (jwt) {
    config.headers.Authorization = `Token ${jwt}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      token.destroy();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// ── Convenience wrappers ─────────────────────────────────────
const requests = {
  get: (url, params) => api.get(url, { params }).then((r) => r.data),
  post: (url, body) => api.post(url, body).then((r) => r.data),
  put: (url, body) => api.put(url, body).then((r) => r.data),
  del: (url) => api.delete(url).then((r) => r.data),
};

// ── Auth / User (replaces user.service.js) ───────────────────
const Auth = {
  current: () => requests.get('/user'),
  login: (email, password) =>
    requests.post('/users/login', { user: { email, password } }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: (user) => requests.put('/user', { user }),
};

// ── Tags (replaces tags.service.js) ──────────────────────────
const Tags = {
  getAll: () => requests.get('/tags'),
};

// ── Articles (replaces articles.service.js) ──────────────────
const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;

const Articles = {
  all: (page) => requests.get(`/articles?${limit(10, page)}`),
  feed: (page) => requests.get(`/articles/feed?${limit(10, page)}`),
  get: (slug) => requests.get(`/articles/${slug}`),
  del: (slug) => requests.del(`/articles/${slug}`),
  update: (article) =>
    requests.put(`/articles/${article.slug}`, { article }),
  create: (article) => requests.post('/articles', { article }),
  favorite: (slug) => requests.post(`/articles/${slug}/favorite`),
  unfavorite: (slug) => requests.del(`/articles/${slug}/favorite`),
  byAuthor: (author, page) =>
    requests.get(`/articles?author=${encodeURIComponent(author)}&${limit(5, page)}`),
  byTag: (tag, page) =>
    requests.get(`/articles?tag=${encodeURIComponent(tag)}&${limit(10, page)}`),
  favoritedBy: (author, page) =>
    requests.get(`/articles?favorited=${encodeURIComponent(author)}&${limit(5, page)}`),
};

// ── Comments (replaces comments.service.js) ──────────────────
const Comments = {
  forArticle: (slug) => requests.get(`/articles/${slug}/comments`),
  create: (slug, body) =>
    requests.post(`/articles/${slug}/comments`, { comment: { body } }),
  del: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
};

// ── Profile (replaces profile.service.js) ────────────────────
const Profile = {
  get: (username) => requests.get(`/profiles/${username}`),
  follow: (username) => requests.post(`/profiles/${username}/follow`),
  unfollow: (username) => requests.del(`/profiles/${username}/follow`),
};

export default {
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  token,
  API_ROOT,
  APP_NAME: 'Conduit',
};
