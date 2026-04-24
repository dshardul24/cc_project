import MovieCard from './MovieCard.jsx';

export default function MovieGrid({ movies, onMovieClick }) {
  return (
    <div className="movies-grid" id="movies-grid">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          index={index}
          onClick={() => onMovieClick(movie)}
        />
      ))}
    </div>
  );
}
