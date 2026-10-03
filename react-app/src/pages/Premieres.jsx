import { useEffect, useState } from 'react';
import { usePage } from '../context/PageContext';
import { getPremieres } from '../services/showService';
import ShowCard from '../components/ShowCard';

function Premieres() {
  const { setPage, setLoading } = usePage();
  const [shows, setShows] = useState([]);

  useEffect(() => {
    setPage('PREMIERES', 'Brand new shows showing this month.');
    setLoading(true);
    getPremieres()
      .then((results) => {
        setShows(results || []);
      })
      .catch(() => setShows([]))
      .finally(() => setLoading(false));
  }, [setPage, setLoading]);

  return (
    <ul className="list-of-shows">
      {shows.map((show) => (
        <li key={show.id} className="col-xs-6 col-md-4">
          <ShowCard show={show} />
        </li>
      ))}
    </ul>
  );
}

export default Premieres;
