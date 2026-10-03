import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './features/Home/Home';
import Auth from './features/Auth/Auth';
import Article from './features/Article/Article';
import Editor from './features/Editor/Editor';
import Settings from './features/Settings/Settings';
import Profile, { ProfileArticles, ProfileFavorites } from './features/Profile/Profile';

// ── Route guards (replaces UI Router resolve + ensureAuthIs) ──
const RequireAuth = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const RequireGuest = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container page" style={{ textAlign: 'center', padding: '4rem' }}>
          Loading...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <RequireGuest>
              <Auth />
            </RequireGuest>
          }
        />
        <Route
          path="/register"
          element={
            <RequireGuest>
              <Auth />
            </RequireGuest>
          }
        />
        <Route path="/article/:slug" element={<Article />} />

        {/* Profile routes (public, nested for tabs) */}
        <Route path="/@:username" element={<Profile />}>
          <Route index element={<ProfileArticles />} />
          <Route path="favorites" element={<ProfileFavorites />} />
        </Route>

        {/* Auth-required routes */}
        <Route
          path="/editor"
          element={
            <RequireAuth>
              <Editor />
            </RequireAuth>
          }
        />
        <Route
          path="/editor/:slug"
          element={
            <RequireAuth>
              <Editor />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
