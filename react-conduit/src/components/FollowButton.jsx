import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import agent from '../api/agent';

const FollowButton = ({ user }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(user.following);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    setIsSubmitting(true);
    try {
      if (following) {
        await agent.Profile.unfollow(user.username);
        setFollowing(false);
      } else {
        await agent.Profile.follow(user.username);
        setFollowing(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const btnClass = `btn btn-sm action-btn ${
    following ? 'btn-secondary' : 'btn-outline-secondary'
  }${isSubmitting ? ' disabled' : ''}`;

  return (
    <button className={btnClass} onClick={handleClick} disabled={isSubmitting}>
      <i className="ion-plus-round"></i>
      &nbsp;
      {following ? 'Unfollow' : 'Follow'} {user.username}
    </button>
  );
};

export default FollowButton;
