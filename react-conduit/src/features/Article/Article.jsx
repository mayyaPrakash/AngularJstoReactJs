import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useAuth } from '../../context/AuthContext';
import agent from '../../api/agent';
import ArticleMeta from '../../components/ArticleMeta';
import FollowButton from '../../components/FollowButton';
import FavoriteButton from '../../components/FavoriteButton';
import ListErrors from '../../components/ListErrors';

const ArticleActions = ({ article, canModify, isDeleting, onDelete }) => (
  <ArticleMeta article={article}>
    {canModify ? (
      <span>
        <Link
          className="btn btn-sm btn-outline-secondary"
          to={`/editor/${article.slug}`}
        >
          <i className="ion-edit"></i> Edit Article
        </Link>
        <button
          className={`btn btn-sm btn-outline-danger${isDeleting ? ' disabled' : ''}`}
          onClick={onDelete}
          disabled={isDeleting}
        >
          <i className="ion-trash-a"></i> Delete Article
        </button>
      </span>
    ) : (
      <span>
        <FollowButton user={article.author} />
        <FavoriteButton article={article} />
      </span>
    )}
  </ArticleMeta>
);

const Article = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [commentErrors, setCommentErrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load article
  useEffect(() => {
    agent.Articles.get(slug)
      .then((data) => setArticle(data.article))
      .catch(() => navigate('/'));
  }, [slug, navigate]);

  // Load comments
  useEffect(() => {
    agent.Comments.forArticle(slug)
      .then((data) => setComments(data.comments))
      .catch(() => {});
  }, [slug]);

  const canModify =
    article && currentUser && currentUser.username === article.author.username;

  const handleDeleteArticle = async () => {
    setIsDeleting(true);
    try {
      await agent.Articles.del(slug);
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCommentErrors(null);
    try {
      const data = await agent.Comments.create(slug, commentBody);
      setComments((prev) => [data.comment, ...prev]);
      setCommentBody('');
    } catch (err) {
      if (err.response?.data?.errors) {
        setCommentErrors(err.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await agent.Comments.del(slug, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      // silently fail
    }
  };

  if (!article) return <div className="article-page">Loading...</div>;

  const markup = DOMPurify.sanitize(marked(article.body || ''));

  return (
    <div className="article-page">
      {/* Banner */}
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleActions
            article={article}
            canModify={canModify}
            isDeleting={isDeleting}
            onDelete={handleDeleteArticle}
          />
        </div>
      </div>

      {/* Article body & tags */}
      <div className="container page">
        <div className="row article-content">
          <div className="col-xs-12">
            <div dangerouslySetInnerHTML={{ __html: markup }} />
            <ul className="tag-list">
              {article.tagList.map((tag) => (
                <li className="tag-default tag-pill tag-outline" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleActions
            article={article}
            canModify={canModify}
            isDeleting={isDeleting}
            onDelete={handleDeleteArticle}
          />
        </div>

        {/* Comments */}
        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <>
                <ListErrors errors={commentErrors} />
                <form className="card comment-form" onSubmit={handleAddComment}>
                  <fieldset disabled={isSubmitting}>
                    <div className="card-block">
                      <textarea
                        className="form-control"
                        placeholder="Write a comment..."
                        rows="3"
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                      />
                    </div>
                    <div className="card-footer">
                      <img
                        src={currentUser.image}
                        className="comment-author-img"
                        alt={currentUser.username}
                      />
                      <button className="btn btn-sm btn-primary" type="submit">
                        Post Comment
                      </button>
                    </div>
                  </fieldset>
                </form>
              </>
            ) : (
              <p>
                <Link to="/login">Sign in</Link> or{' '}
                <Link to="/register">sign up</Link> to add comments on this
                article.
              </p>
            )}

            {comments.map((comment) => {
              const canDelete =
                currentUser &&
                currentUser.username === comment.author.username;
              return (
                <div className="card" key={comment.id}>
                  <div className="card-block">
                    <p className="card-text">{comment.body}</p>
                  </div>
                  <div className="card-footer">
                    <Link
                      className="comment-author"
                      to={`/@${comment.author.username}`}
                    >
                      <img
                        src={comment.author.image}
                        className="comment-author-img"
                        alt={comment.author.username}
                      />
                    </Link>
                    &nbsp;
                    <Link
                      className="comment-author"
                      to={`/@${comment.author.username}`}
                    >
                      {comment.author.username}
                    </Link>
                    <span className="date-posted">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    {canDelete && (
                      <span className="mod-options">
                        <i
                          className="ion-trash-a"
                          onClick={() => handleDeleteComment(comment.id)}
                        ></i>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
