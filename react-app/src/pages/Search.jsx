import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePage } from '../context/PageContext';
import { searchShows } from '../services/showService';
import ShowCard from '../components/ShowCard';

function Search() {
  const { setPage } = usePage();
  const { query: routeQuery } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(null); // null = initial, true = loading, false = loaded

  useEffect(() => {
    setPage('SEARCH', 'Search for your favorite TV shows.');
  }, [setPage]);

  const performSearch = useCallback((q) => {
    setLoading(true);
    searchShows(q)
      .then((results) => {
        setShows(results || []);
        setLoading(false);
      })
      .catch(() => {
        setShows([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (routeQuery) {
      performSearch(routeQuery);
      setQuery(decodeURI(routeQuery));
    }
  }, [routeQuery, performSearch]);

  const handleSearch = () => {
    if (query.trim()) {
      const encoded = encodeURI(query.trim());
      navigate(`/search/${encoded}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="search-top">
        <div className="input-group">
          <input
            type="text"
            className="form-control input-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search TV shows..."
            id="search-input"
          />
          <span className="input-group-btn">
            <button
              className="btn btn-info btn-lg search-btn"
              type="button"
              disabled={!query.trim()}
              onClick={handleSearch}
              id="search-button"
            >
              <span className="glyphicon glyphicon-search"></span> Search
            </button>
          </span>
        </div>
      </div>
      <div className="search-results">
        {loading === null && (
          <div className="no-data">Use the search box above to find your favorite TV shows</div>
        )}
        {loading === false && shows.length === 0 && (
          <div className="no-data">Your search did not return any results</div>
        )}
        {loading && <div className="throbber"></div>}
        {loading === false && (
          <ul className="list-of-shows">
            {shows.map((show) => (
              <li key={show.id} className="col-xs-6 col-md-4 repeat-animation">
                <ShowCard show={show} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default Search;
