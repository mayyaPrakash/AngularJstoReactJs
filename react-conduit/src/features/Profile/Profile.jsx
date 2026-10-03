import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import agent from '../../api/agent';
import FollowButton from '../../components/FollowButton';
import ArticleList from '../../components/ArticleList';

// ── Profile layout (wraps My Articles / Favorited tabs) ──────
const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    agent.Profile.get(username)
      .then((data) => setProfile(data.profile))
      .catch(() => navigate('/'));
  }, [username, navigate]);

  if (!profile) return null;

  const isUser = currentUser && currentUser.username === profile.username;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image} className="user-img" alt={profile.username} />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>

              {isUser ? (
                <NavLink
                  className="btn btn-sm btn-outline-secondary action-btn"
                  to="/settings"
                >
                  <i className="ion-gear-a"></i> Edit Profile Settings
                </NavLink>
              ) : (
                <FollowButton user={profile} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <NavLink className="nav-link" to={`/@${profile.username}`} end>
                    My Articles
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to={`/@${profile.username}/favorites`}>
                    Favorited Articles
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Nested route outlet for My Articles / Favorites */}
            <Outlet context={{ profile }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── My Articles tab ──────────────────────────────────────────
export const ProfileArticles = () => {
  const { username } = useParams();
  const queryFn = useCallback((page) => agent.Articles.byAuthor(username, page), [username]);
  const queryKey = useMemo(() => `author-${username}`, [username]);
  return <ArticleList queryFn={queryFn} queryKey={queryKey} limit={5} />;
};

// ── Favorited Articles tab ───────────────────────────────────
export const ProfileFavorites = () => {
  const { username } = useParams();
  const queryFn = useCallback((page) => agent.Articles.favoritedBy(username, page), [username]);
  const queryKey = useMemo(() => `favorites-${username}`, [username]);
  return <ArticleList queryFn={queryFn} queryKey={queryKey} limit={5} />;
};

export default Profile;
