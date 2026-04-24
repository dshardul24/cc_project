const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

if (!API_KEY) {
  console.error(
    '⚠️ OMDB API key is missing! Create a .env file in the project root with:\n' +
    'VITE_OMDB_API_KEY=your_api_key_here\n' +
    'Get a free key at https://www.omdbapi.com/apikey.aspx'
  );
}

/**
 * Search movies by query string
 */
export async function searchMovies(query, page = 1) {
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network error. Please check your connection and try again.');
  }

  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'No movies found. Try a different search term.');
  }

  return {
    movies: data.Search,
    totalResults: parseInt(data.totalResults, 10),
  };
}

/**
 * Get detailed movie info by IMDb ID
 */
export async function getMovieDetails(imdbID) {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network error. Please check your connection and try again.');
  }

  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie details not available.');
  }

  return data;
}

/**
 * Curated list of famous/iconic movie IMDb IDs for the homepage
 */
const FEATURED_MOVIE_IDS = [
  'tt1375666', // Inception
  'tt0111161', // The Shawshank Redemption
  'tt0468569', // The Dark Knight
  'tt0137523', // Fight Club
  'tt0109830', // Forrest Gump
  'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
  'tt0816692', // Interstellar
  'tt0133093', // The Matrix
  'tt0080684', // The Empire Strikes Back
  'tt0167260', // The Lord of the Rings: The Return of the King
  'tt1853728', // Django Unchained
  'tt0114369', // Se7en
  'tt0110912', // Pulp Fiction
  'tt0245429', // Spirited Away
  'tt0482571', // The Prestige
  'tt0361748', // Inglourious Basterds
  'tt0407887', // The Departed
  'tt4154796', // Avengers: Endgame
  'tt0047478', // Seven Samurai
  'tt6751668', // Parasite
];

/**
 * Fetch featured movies for the homepage.
 * Returns detailed info for each movie.
 */
export async function getFeaturedMovies() {
  const promises = FEATURED_MOVIE_IDS.map(async (id) => {
    try {
      const url = `${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=short`;
      const response = await fetch(url);
      if (!response.ok) return null;
      const data = await response.json();
      if (data.Response === 'False') return null;
      return data;
    } catch {
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
}

/**
 * Search suggestions — lightweight search returning just titles
 * Uses abort controller for cancellation
 */
export async function searchSuggestions(query, signal) {
  if (!query || query.trim().length < 2) return [];

  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query.trim())}&page=1`;
  const response = await fetch(url, { signal });

  if (!response.ok) return [];

  const data = await response.json();

  if (data.Response === 'False') return [];

  return data.Search.slice(0, 6); // max 6 suggestions
}

/**
 * Find similar movies based on genre and director.
 * Searches OMDb using the primary genre keyword and the director's name,
 * then deduplicates and excludes the current movie.
 */
export async function getSimilarMovies(movieDetails) {
  if (!movieDetails) return [];

  const currentId = movieDetails.imdbID;
  const searches = [];

  // Search by primary genre (first genre from comma-separated list)
  if (movieDetails.Genre && movieDetails.Genre !== 'N/A') {
    const primaryGenre = movieDetails.Genre.split(',')[0].trim();
    searches.push(
      searchMoviesQuiet(primaryGenre).then(results =>
        results.map(m => ({ ...m, _reason: primaryGenre }))
      )
    );
  }

  // Search by director's last name
  if (movieDetails.Director && movieDetails.Director !== 'N/A') {
    const directorName = movieDetails.Director.split(',')[0].trim();
    const lastName = directorName.split(' ').pop();
    if (lastName && lastName.length > 2) {
      searches.push(
        searchMoviesQuiet(directorName).then(results =>
          results.map(m => ({ ...m, _reason: `By ${directorName}` }))
        )
      );
    }
  }

  // Search by title keywords (first significant word from title)
  if (movieDetails.Title) {
    const stopWords = ['the', 'a', 'an', 'of', 'and', 'in', 'to', 'for', 'is', 'on', 'at'];
    const titleWords = movieDetails.Title.split(/\s+/).filter(
      w => w.length > 3 && !stopWords.includes(w.toLowerCase())
    );
    if (titleWords.length > 0) {
      const keyword = titleWords[0];
      searches.push(
        searchMoviesQuiet(keyword).then(results =>
          results.map(m => ({ ...m, _reason: 'Related' }))
        )
      );
    }
  }

  if (searches.length === 0) return [];

  const allResults = await Promise.all(searches);
  const flat = allResults.flat();

  // Deduplicate and exclude the current movie
  const seen = new Set();
  const unique = [];
  for (const movie of flat) {
    if (movie.imdbID !== currentId && !seen.has(movie.imdbID)) {
      seen.add(movie.imdbID);
      unique.push(movie);
    }
  }

  return unique.slice(0, 12); // max 12 similar movies
}

/**
 * Internal helper — search that never throws (returns empty on failure)
 */
async function searchMoviesQuiet(query) {
  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie&page=1`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    if (data.Response === 'False') return [];
    return data.Search || [];
  } catch {
    return [];
  }
}
