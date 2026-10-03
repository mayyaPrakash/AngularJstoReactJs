import { Link } from 'react-router-dom';
import ArticleMeta from './ArticleMeta';
import FavoriteButton from './FavoriteButton';

const ArticlePreview = ({ article }) => {
  return (
    <div className="article-preview">
      <ArticleMeta article={article}>
        <div className="pull-xs-right">
          <FavoriteButton article={article} compact />
        </div>
      </ArticleMeta>

      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag) => (
            <li className="tag-default tag-pill tag-outline" key={tag}>
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
};

export default ArticlePreview;
