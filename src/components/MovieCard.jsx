import { ImageOffIcon, CalendarIcon } from './Icons.jsx';

export default function MovieCard({ movie, index, onClick }) {
  const hasPoster = movie.Poster && movie.Poster !== 'N/A';
  const typeLabel = movie.Type ? movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1) : '';

  return (
    <article
      className="movie-card"
      id={`movie-card-${movie.imdbID}`}
      onClick={onClick}
      style={{ animationDelay: `${index * 0.05}s` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
      aria-label={`View details for ${movie.Title}`}
    >
      <div className="movie-card__poster-wrap">
        {hasPoster ? (
          <img
            className="movie-card__poster"
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            loading="lazy"
          />
        ) : (
          <div className="movie-card__poster-placeholder">
            <ImageOffIcon size={32} />
            <span>No Poster</span>
          </div>
        )}
        {movie.Year && (
          <span className="movie-card__year-badge">{movie.Year}</span>
        )}
        {typeLabel && (
          <span className="movie-card__type-badge">{typeLabel}</span>
        )}
        <div className="movie-card__overlay">
          <span className="movie-card__overlay-text">View Details</span>
        </div>
      </div>
      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.Title}</h3>
        <div className="movie-card__meta">
          <span className="movie-card__meta-item">
            <CalendarIcon size={12} />
            {movie.Year}
          </span>
          {typeLabel && <span className="movie-card__meta-divider" />}
          {typeLabel && <span className="movie-card__meta-item">{typeLabel}</span>}
        </div>
      </div>
    </article>
  );
}
