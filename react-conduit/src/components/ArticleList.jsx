import { useState, useEffect } from 'react';
import ArticlePreview from './ArticlePreview';

const ArticleList = ({ queryFn, queryKey, limit = 10 }) => {
  const [articles, setArticles] = useState([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [prevQueryKey, setPrevQueryKey] = useState(queryKey);
  const [loading, setLoading] = useState(true);

  if (prevQueryKey !== queryKey) {
    setPrevQueryKey(queryKey);
    setCurrentPage(0);
  }

  useEffect(() => {
    let cancelled = false;
    queryFn(currentPage)
      .then((data) => {
        if (!cancelled) {
          setArticles(data.articles || []);
          setArticlesCount(data.articlesCount || 0);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setArticles([]);
          setArticlesCount(0);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [queryFn, currentPage]);

  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  const totalPages = Math.ceil(articlesCount / limit);

  return (
    <>
      {articles.map((article) => (
        <ArticlePreview key={article.slug} article={article} />
      ))}

      {totalPages > 1 && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                className={`page-item${currentPage === i ? ' active' : ''}`}
                key={i}
                onClick={() => handlePageChange(i)}
              >
                <a className="page-link" href="" onClick={(e) => e.preventDefault()}>
                  {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
};

export default ArticleList;
