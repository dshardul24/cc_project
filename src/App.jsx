import { useState, useCallback, useEffect } from 'react';
import SearchBar from './components/SearchBar.jsx';
import MovieGrid from './components/MovieGrid.jsx';
import MovieModal from './components/MovieModal.jsx';
import HomePage from './components/HomePage.jsx';
import ErrorState from './components/ErrorState.jsx';
import LoadingSkeleton from './components/LoadingSkeleton.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import { LogoIcon, ArrowLeftIcon } from './components/Icons.jsx';
import { searchMovies, getMovieDetails, getFeaturedMovies } from './api.js';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Featured movies for homepage
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  // Modal state
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('cinesearch-theme');
    return saved || 'dark';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cinesearch-theme', theme);
  }, [theme]);

  // Load featured movies on mount
  useEffect(() => {
    let cancelled = false;
    async function loadFeatured() {
      try {
        const data = await getFeaturedMovies();
        if (!cancelled) {
          setFeaturedMovies(data);
        }
      } catch (err) {
        // silently fail - homepage just won't show featured
      } finally {
        if (!cancelled) setFeaturedLoading(false);
      }
    }
    loadFeatured();
    return () => { cancelled = true; };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return;

    setSearchQuery(query.trim());
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await searchMovies(query.trim());
      setMovies(result.movies);
      setTotalResults(result.totalResults);
    } catch (err) {
      setError(err.message);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMovieClick = useCallback(async (movie) => {
    const id = movie.imdbID;
    setSelectedMovie(movie);
    setDetailsLoading(true);
    setMovieDetails(null);

    try {
      const details = await getMovieDetails(id);
      setMovieDetails(details);
    } catch (err) {
      setMovieDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
    setMovieDetails(null);
  }, []);

  const handleBackHome = useCallback(() => {
    setHasSearched(false);
    setMovies([]);
    setError(null);
    setSearchQuery('');
    setTotalResults(0);
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header__top-bar">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <div className="header__logo" onClick={handleBackHome} style={{ cursor: 'pointer' }}>
          <LogoIcon size={32} className="header__icon" />
          <h1 className="header__title">CineSearch</h1>
        </div>
        <p className="header__subtitle">Discover movies, explore ratings, find your next watch</p>
      </header>

      {/* Search */}
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Content */}
      {loading && <LoadingSkeleton />}

      {!loading && error && <ErrorState message={error} />}

      {!loading && !error && hasSearched && movies.length > 0 && (
        <>
          <div className="results-info">
            <span className="results-info__count">
              Showing <strong>{movies.length}</strong> of{' '}
              <strong>{totalResults.toLocaleString()}</strong> results for{' '}
              <span className="results-info__query">"{searchQuery}"</span>
            </span>
            <button className="results-info__back" onClick={handleBackHome}>
              <ArrowLeftIcon size={14} />
              Back to Home
            </button>
          </div>
          <MovieGrid movies={movies} onMovieClick={handleMovieClick} />
        </>
      )}

      {/* Homepage — shown when user hasn't searched */}
      {!loading && !error && !hasSearched && (
        <HomePage
          movies={featuredMovies}
          loading={featuredLoading}
          onMovieClick={handleMovieClick}
        />
      )}

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          details={movieDetails}
          loading={detailsLoading}
          onClose={handleCloseModal}
          onMovieClick={handleMovieClick}
        />
      )}
    </div>
  );
}
