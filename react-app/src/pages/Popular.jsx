import { useEffect, useState } from 'react';
import { usePage } from '../context/PageContext';
import { getPopular } from '../services/showService';
import ShowCard from '../components/ShowCard';

function Popular() {
  const { setPage, setLoading } = usePage();
  const [shows, setShows] = useState([]);

  useEffect(() => {
    setPage('POPULAR', 'The most popular TV shows.');
    setLoading(true);
    getPopular()
      .then((results) => {
        setShows(results || []);
      })
      .catch(() => setShows([]))
      .finally(() => setLoading(false));
  }, [setPage, setLoading]);

  return (
    <div className="trending-results">
      {shows.length === 0 && (
        <div className="no-data">There are no popular shows available to display</div>
      )}
      <ul className="list-of-shows">
        {shows.map((show) => (
          <li key={show.id} className="col-xs-6 col-md-4 repeat-animation">
            <ShowCard show={show} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Popular;
