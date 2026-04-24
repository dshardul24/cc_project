import { useEffect, useState } from 'react';
import { CloseIcon, StarIcon, ImageOffIcon } from './Icons.jsx';
import { getSimilarMovies } from '../api.js';

export default function MovieModal({ movie, details, loading, onClose, onMovieClick }) {
  const [similarMovies, setSimilarMovies] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Fetch similar movies when details load
  useEffect(() => {
    if (!details) {
      setSimilarMovies([]);
      return;
    }

    let cancelled = false;
    setSimilarLoading(true);

    getSimilarMovies(details).then((results) => {
      if (!cancelled) {
        setSimilarMovies(results);
        setSimilarLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setSimilarMovies([]);
        setSimilarLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [details]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSimilarClick = (similarMovie) => {
    // Close current modal and open the clicked movie
    if (onMovieClick) {
      onMovieClick(similarMovie);
    }
  };

  const hasPoster = (img) => img && img !== 'N/A';
  const displayData = details || movie;
  const posterSrc = hasPoster(displayData.Poster) ? displayData.Poster : null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} id="movie-modal-overlay">
      <div className="modal" role="dialog" aria-modal="true" id="movie-modal">
        <button className="modal__close" onClick={onClose} aria-label="Close modal" id="modal-close-btn">
          <CloseIcon size={16} />
        </button>

        {loading ? (
          <div className="modal__loading">
            <div className="loading__spinner"></div>
            <span className="loading__text">Loading movie details...</span>
          </div>
        ) : (
          <>
            <div className="modal__header">
              <div className="modal__poster">
                {posterSrc ? (
                  <img src={posterSrc} alt={`${displayData.Title} poster`} />
                ) : (
                  <div className="modal__poster-placeholder">
                    <ImageOffIcon size={40} />
                  </div>
                )}
              </div>
              <div className="modal__title-area">
                <h2 className="modal__title">{displayData.Title}</h2>
                <p className="modal__subtitle">
                  {[details?.Year, details?.Rated, details?.Runtime].filter(v => v && v !== 'N/A').join(' · ') || movie.Year}
                </p>
                {details?.Ratings && details.Ratings.length > 0 && (
                  <div className="modal__ratings">
                    {details.Ratings.map((r, i) => (
                      <span key={i} className="modal__rating-badge">
                        <StarIcon size={12} />
                        {r.Source === 'Internet Movie Database' ? 'IMDb' : r.Source}: {r.Value}
                      </span>
                    ))}
                  </div>
                )}
                {!details?.Ratings && details?.imdbRating && details.imdbRating !== 'N/A' && (
                  <div className="modal__ratings">
                    <span className="modal__rating-badge">
                      <StarIcon size={12} />
                      IMDb: {details.imdbRating}/10
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal__body">
              {details?.Plot && details.Plot !== 'N/A' && (
                <p className="modal__plot">{details.Plot}</p>
              )}

              <div className="modal__details-grid">
                {details?.Genre && details.Genre !== 'N/A' && (
                  <div className="modal__detail">
                    <div className="modal__detail-label">Genre</div>
                    <div className="modal__detail-value">{details.Genre}</div>
                  </div>
                )}
                {details?.Director && details.Director !== 'N/A' && (
                  <div className="modal__detail">
                    <div className="modal__detail-label">Director</div>
                    <div className="modal__detail-value">{details.Director}</div>
                  </div>
                )}
                {details?.Actors && details.Actors !== 'N/A' && (
                  <div className="modal__detail">
                    <div className="modal__detail-label">Cast</div>
                    <div className="modal__detail-value">{details.Actors}</div>
                  </div>
                )}
                {details?.Writer && details.Writer !== 'N/A' && (
                  <div className="modal__detail">
                    <div className="modal__detail-label">Writer</div>
                    <div className="modal__detail-value">{details.Writer}</div>
                  </div>
                )}
                {details?.Language && details.Language !== 'N/A' && (
                  <div className="modal__detail">
                    <div className="modal__detail-label">Language</div>
                    <div className="modal__detail-value">{details.Language}</div>
                  </div>
                )}
                {details?.Country && details.Country !== 'N/A' && (
                  <div className="modal__detail">
                    <div className="modal__detail-label">Country</div>
                    <div className="modal__detail-value">{details.Country}</div>
                  </div>
                )}
                {details?.Awards && details.Awards !== 'N/A' && (
                  <div className="modal__detail">
                    <div className="modal__detail-label">Awards</div>
                    <div className="modal__detail-value">{details.Awards}</div>
                  </div>
                )}
                {details?.BoxOffice && details.BoxOffice !== 'N/A' && (
                  <div className="modal__detail">
                    <div className="modal__detail-label">Box Office</div>
                    <div className="modal__detail-value">{details.BoxOffice}</div>
                  </div>
                )}
              </div>

              {/* Similar Movies Section */}
              {(similarLoading || similarMovies.length > 0) && (
                <div className="modal__similar">
                  <h3 className="modal__similar-title">Similar Movies</h3>
                  {similarLoading ? (
                    <div className="modal__similar-loading">
                      <div className="modal__similar-skeleton" />
                      <div className="modal__similar-skeleton" />
                      <div className="modal__similar-skeleton" />
                      <div className="modal__similar-skeleton" />
                      <div className="modal__similar-skeleton" />
                    </div>
                  ) : (
                    <div className="modal__similar-row">
                      {similarMovies.map((m) => {
                        const hasPosterImg = m.Poster && m.Poster !== 'N/A';
                        return (
                          <div
                            key={m.imdbID}
                            className="modal__similar-card"
                            onClick={() => handleSimilarClick(m)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSimilarClick(m); }}
                          >
                            <div className="modal__similar-poster">
                              {hasPosterImg ? (
                                <img src={m.Poster} alt={m.Title} loading="lazy" />
                              ) : (
                                <div className="modal__similar-poster-ph">
                                  <ImageOffIcon size={20} />
                                </div>
                              )}
                              {m._reason && (
                                <span className="modal__similar-reason">{m._reason}</span>
                              )}
                            </div>
                            <div className="modal__similar-info">
                              <span className="modal__similar-name">{m.Title}</span>
                              <span className="modal__similar-year">{m.Year}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
