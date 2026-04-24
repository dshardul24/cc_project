import { useState, useEffect, useRef, useCallback } from 'react';
import { searchSuggestions } from '../api.js';
import { SearchIcon, FilmIcon } from './Icons.jsx';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const abortRef = useRef(null);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced fetch suggestions
  const fetchSuggestions = useCallback(async (value) => {
    // Cancel previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSuggestionsLoading(false);
      return;
    }

    setSuggestionsLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const results = await searchSuggestions(value, controller.signal);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setActiveIndex(-1);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce the suggestions fetch
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query);
    }
  };

  const handleSuggestionClick = (movie) => {
    setQuery(movie.Title);
    setShowSuggestions(false);
    onSearch(movie.Title);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (query.trim()) onSearch(query);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSuggestionClick(suggestions[activeIndex]);
      } else if (query.trim()) {
        setShowSuggestions(false);
        onSearch(query);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search" ref={wrapperRef}>
      <form className="search__container" onSubmit={handleSubmit}>
        <span className="search__icon">
          <SearchIcon size={18} />
        </span>
        <input
          id="search-input"
          className="search__input"
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
          placeholder="Search for movies, series, episodes..."
          autoComplete="off"
          autoFocus
          role="combobox"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
        />
        <button
          id="search-button"
          className="search__btn"
          type="submit"
          disabled={loading || !query.trim()}
        >
          {loading ? (
            <span className="search__btn-loading">
              <span className="search__btn-spinner" />
              Searching
            </span>
          ) : 'Search'}
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions" id="suggestions-list" role="listbox">
          {suggestionsLoading && (
            <div className="suggestions__loading">
              <div className="suggestions__loading-dot" />
              <div className="suggestions__loading-dot" />
              <div className="suggestions__loading-dot" />
            </div>
          )}
          {suggestions.map((movie, idx) => {
            const hasPoster = movie.Poster && movie.Poster !== 'N/A';
            return (
              <div
                key={movie.imdbID}
                id={`suggestion-${idx}`}
                className={`suggestions__item ${idx === activeIndex ? 'suggestions__item--active' : ''}`}
                role="option"
                aria-selected={idx === activeIndex}
                onMouseDown={() => handleSuggestionClick(movie)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <div className="suggestions__poster">
                  {hasPoster ? (
                    <img src={movie.Poster} alt="" />
                  ) : (
                    <div className="suggestions__poster-placeholder">
                      <FilmIcon size={16} />
                    </div>
                  )}
                </div>
                <div className="suggestions__info">
                  <span className="suggestions__title">{movie.Title}</span>
                  <span className="suggestions__meta">{movie.Year} · {movie.Type}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
