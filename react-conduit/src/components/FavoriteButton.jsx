import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import agent from '../api/agent';

const FavoriteButton = ({ article, compact, children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(article.favorited);
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    setIsSubmitting(true);
    try {
      if (favorited) {
        await agent.Articles.unfavorite(article.slug);
        setFavorited(false);
        setFavoritesCount((c) => c - 1);
      } else {
        await agent.Articles.favorite(article.slug);
        setFavorited(true);
        setFavoritesCount((c) => c + 1);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const btnClass = `btn btn-sm ${
    favorited ? 'btn-primary' : 'btn-outline-primary'
  }${isSubmitting ? ' disabled' : ''}`;

  return (
    <button className={btnClass} onClick={handleClick} disabled={isSubmitting}>
      <i className="ion-heart"></i>
      {compact ? (
        <span> {favoritesCount}</span>
      ) : (
        <span>
          {' '}
          {children || (
            <>
              {favorited ? 'Unfavorite' : 'Favorite'} Article{' '}
              <span className="counter">({favoritesCount})</span>
            </>
          )}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
