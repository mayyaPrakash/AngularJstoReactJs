import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePage } from '../context/PageContext';
import { getShow, getCast } from '../services/showService';
import dayjs from 'dayjs';

function ShowView() {
  const { id } = useParams();
  const { setPage, setLoading } = usePage();
  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    setLoading(true);
    getShow(id)
      .then((data) => {
        setShow(data);
        setPage('VIEW', `Overview, seasons & info for '${data.original_name}'.`);
        // Fetch cast after show loads — same as original ViewController
        return getCast(data.id);
      })
      .then((response) => {
        if (response?.cast) {
          setCast(response.cast);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, setPage, setLoading]);

  if (!show) {
    return <div className="throbber" style={{ marginTop: 50 }}></div>;
  }

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/original/${show.backdrop_path}`
    : '/images/shattered.png';

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w342/${show.poster_path}`
    : '/images/fallback-thin.jpg';

  const year = show.first_air_date
    ? dayjs(show.first_air_date).format('YYYY')
    : 'N/A';

  return (
    <>
      <div
        className="view-banner"
        style={{
          backgroundImage: `url(${backdropUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100%',
          backgroundPosition: '100% 0%',
        }}
      ></div>
      <div className="view-title">
        <div className="container">
          {show.original_name} ({year})
          <ul className="pull-right">
            <li>
              <span className="icon icon-heart3"></span> {show.vote_average}
            </li>
            <li>
              <span className="icon icon-tags"></span>{' '}
              {show.genres?.map((genre, i) => (
                <span key={genre.id}>
                  {genre.name}
                  {i < show.genres.length - 1 ? ', ' : ''}
                </span>
              ))}
            </li>
            <li>
              <span className="icon icon-info2"></span> {show.status}
            </li>
          </ul>
        </div>
      </div>
      <div className="view-container">
        <h2>Show Summary</h2>
        <div className="view-section view-top">
          <div className="poster">
            <img
              src={posterUrl}
              alt={show.original_name}
              onError={(e) => { e.target.src = '/images/fallback-thin.jpg'; }}
            />
          </div>
          {show.overview ? (
            <p>{show.overview}</p>
          ) : (
            <p className="no-overview">No overview is available for this show</p>
          )}
          <div className="buttons">
            {show.homepage && (
              <a
                href={show.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg btn-info"
              >
                <span className="icon icon-home"></span> Homepage
              </a>
            )}
          </div>
          <div className="clearfix"></div>
        </div>

        <h2>Seasons</h2>
        <div className="view-section">
          {show.seasons && show.seasons.length > 0 ? (
            <ul className="view-list">
              {show.seasons
                .filter((season) => season.episode_count > 0)
                .map((season) => (
                  <li key={season.id || season.season_number}>
                    <img
                      src={
                        season.poster_path
                          ? `https://image.tmdb.org/t/p/w185/${season.poster_path}`
                          : '/images/fallback-thin.jpg'
                      }
                      alt={`Season ${season.season_number}`}
                      onError={(e) => { e.target.src = '/images/fallback-thin.jpg'; }}
                    />
                    <div className="item-info">
                      <div className="col-md-2">#{season.season_number}</div>
                      <div className="col-md-10">
                        Episode Count: {season.episode_count}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="no-data">No season information available</p>
          )}
        </div>

        <h2>Cast</h2>
        <div className="view-section cast-container">
          {cast.length > 0 ? (
            <ul className="view-list">
              {cast.map((actor) => (
                <li key={actor.credit_id || actor.id}>
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185/${actor.profile_path}`
                        : '/images/fallback-thin.jpg'
                    }
                    alt={actor.name}
                    onError={(e) => { e.target.src = '/images/fallback-thin.jpg'; }}
                  />
                  <div className="item-info">
                    {actor.name} as <br />
                    <strong>{actor.character}</strong>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No cast information available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ShowView;
