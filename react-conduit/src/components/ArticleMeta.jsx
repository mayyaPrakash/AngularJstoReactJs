import { Link } from 'react-router-dom';

const ArticleMeta = ({ article, children }) => {
  return (
    <div className="article-meta">
      <Link to={`/@${article.author.username}`}>
        <img src={article.author.image} alt={article.author.username} />
      </Link>
      <div className="info">
        <Link className="author" to={`/@${article.author.username}`}>
          {article.author.username}
        </Link>
        <span className="date">
          {new Date(article.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
      {children}
    </div>
  );
};

export default ArticleMeta;
