import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getShow } from '../services/showService';
import dayjs from 'dayjs';

function ShowCard({ show }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (show?.id) {
      getShow(show.id).then((response) => {
        if (response?.genres) {
          setGenres(response.genres);
        }
      }).catch(() => {});
    }
  }, [show?.id]);

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w780/${show.backdrop_path}`
    : '/images/fallback.jpg';

  const formattedDate = show.first_air_date
    ? dayjs(show.first_air_date).format('DD-MM-YYYY')
    : 'N/A';

  const truncatedName = show.original_name?.length > 40
    ? show.original_name.substring(0, 40) + '…'
    : show.original_name;

  return (
    <div className="show-frame">
      <ul className="genres">
        {genres.map((genre, index) => (
          <li
            key={genre.id}
            className="animate-repeat"
            style={{
              backgroundColor: `rgba(59, 185, 187, ${genres.length / (index + 1) / 5})`,
            }}
          >
            {genre.name}
          </li>
        ))}
      </ul>
      <img
        src={backdropUrl}
        alt={show.original_name}
        onError={(e) => { e.target.src = '/images/fallback.jpg'; }}
      />
      <div className="date label label-dark">
        <span className="icon icon-calendar"></span> {formattedDate}
      </div>
      <h2>{truncatedName}</h2>
      <div className="inner">
        <ul className="info">
          <li className="rating">
            <span className="icon icon-heart3"></span> {show.vote_average}
          </li>
          <li className="country">
            <span className="icon icon-earth"></span>{' '}
            {show.origin_country && show.origin_country.length > 0
              ? show.origin_country.join(', ')
              : '--'}
          </li>
          <div className="clearfix"></div>
        </ul>
        <div className="buttons">
          <Link to={`/view/${show.id}`} className="btn btn-info">
            <span className="icon icon-arrow-right7"></span> View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShowCard;
