import { SparklesIcon, TrophyIcon, FireIcon, FilmIcon, StarIcon, ImageOffIcon, CrownIcon, PlayIcon } from './Icons.jsx';

export default function HomePage({ movies, loading, onMovieClick }) {
  if (loading) {
    return (
      <section className="homepage" id="homepage">
        <div className="homepage__section">
          <div className="homepage__section-header">
            <h2 className="homepage__section-title">
              <span className="homepage__section-icon">
                <SparklesIcon size={20} />
              </span>
              Featured Movies
            </h2>
            <p className="homepage__section-sub">Handpicked classics & modern masterpieces</p>
          </div>
          <div className="homepage__scroll-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="skeleton-card homepage__scroll-card" key={i}>
                <div className="skeleton-card__poster" />
                <div className="skeleton-card__info">
                  <div className="skeleton-card__title" />
                  <div className="skeleton-card__meta" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) return null;

  // Split into categories for a rich homepage feel
  const topRated = movies
    .filter(m => m.imdbRating && m.imdbRating !== 'N/A')
    .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));

  const recentMovies = movies
    .filter(m => m.Year && parseInt(m.Year) >= 2010)
    .sort((a, b) => parseInt(b.Year) - parseInt(a.Year));

  const classicMovies = movies
    .filter(m => m.Year && parseInt(m.Year) < 2010)
    .sort((a, b) => parseInt(b.Year) - parseInt(a.Year));

  return (
    <section className="homepage" id="homepage">
      {/* Hero Spotlight */}
      {topRated.length > 0 && (
        <div className="homepage__hero" onClick={() => onMovieClick(topRated[0])}>
          <div
            className="homepage__hero-bg"
            style={{
              backgroundImage: topRated[0].Poster && topRated[0].Poster !== 'N/A'
                ? `url(${topRated[0].Poster})`
                : 'none',
            }}
          />
          <div className="homepage__hero-content">
            <span className="homepage__hero-badge">
              <CrownIcon size={12} />
              Highest Rated
            </span>
            <h2 className="homepage__hero-title">{topRated[0].Title}</h2>
            <p className="homepage__hero-meta">
              {topRated[0].Year} · {topRated[0].Genre} · {topRated[0].imdbRating}/10
            </p>
            {topRated[0].Plot && topRated[0].Plot !== 'N/A' && (
              <p className="homepage__hero-plot">{topRated[0].Plot}</p>
            )}
            <button className="homepage__hero-btn">
              <PlayIcon size={14} />
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Top Rated Section */}
      {topRated.length > 1 && (
        <div className="homepage__section">
          <div className="homepage__section-header">
            <h2 className="homepage__section-title">
              <span className="homepage__section-icon">
                <TrophyIcon size={20} />
              </span>
              Top Rated
            </h2>
            <p className="homepage__section-sub">The highest rated films of all time</p>
          </div>
          <div className="homepage__scroll-row">
            {topRated.slice(1, 11).map((movie, idx) => (
              <FeaturedCard key={movie.imdbID} movie={movie} rank={idx + 2} onClick={() => onMovieClick(movie)} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Hits */}
      {recentMovies.length > 0 && (
        <div className="homepage__section">
          <div className="homepage__section-header">
            <h2 className="homepage__section-title">
              <span className="homepage__section-icon">
                <FireIcon size={20} />
              </span>
              Modern Classics
            </h2>
            <p className="homepage__section-sub">The best of the 2010s and beyond</p>
          </div>
          <div className="homepage__scroll-row">
            {recentMovies.map((movie) => (
              <FeaturedCard key={movie.imdbID} movie={movie} onClick={() => onMovieClick(movie)} />
            ))}
          </div>
        </div>
      )}

      {/* Timeless Classics */}
      {classicMovies.length > 0 && (
        <div className="homepage__section">
          <div className="homepage__section-header">
            <h2 className="homepage__section-title">
              <span className="homepage__section-icon">
                <FilmIcon size={20} />
              </span>
              Timeless Classics
            </h2>
            <p className="homepage__section-sub">Films that defined cinema</p>
          </div>
          <div className="homepage__scroll-row">
            {classicMovies.map((movie) => (
              <FeaturedCard key={movie.imdbID} movie={movie} onClick={() => onMovieClick(movie)} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function FeaturedCard({ movie, rank, onClick }) {
  const hasPoster = movie.Poster && movie.Poster !== 'N/A';

  return (
    <article className="featured-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}>
      <div className="featured-card__poster-wrap">
        {hasPoster ? (
          <img className="featured-card__poster" src={movie.Poster} alt={movie.Title} loading="lazy" />
        ) : (
          <div className="featured-card__poster-placeholder">
            <ImageOffIcon size={28} />
          </div>
        )}
        {rank && <span className="featured-card__rank">#{rank}</span>}
        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
          <span className="featured-card__rating">
            <StarIcon size={10} />
            {movie.imdbRating}
          </span>
        )}
      </div>
      <div className="featured-card__info">
        <h3 className="featured-card__title">{movie.Title}</h3>
        <span className="featured-card__year">{movie.Year} {movie.Genre ? `· ${movie.Genre.split(',')[0]}` : ''}</span>
      </div>
    </article>
  );
}
