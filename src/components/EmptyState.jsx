import { PopcornIcon } from './Icons.jsx';

export default function EmptyState() {
  return (
    <div className="state-message" id="empty-state">
      <span className="state-message__icon">
        <PopcornIcon size={48} />
      </span>
      <h2 className="state-message__title">Ready to explore?</h2>
      <p className="state-message__text">
        Search for any movie, TV series, or episode above. 
        Try searching for "Inception", "Breaking Bad", or your favorite title!
      </p>
    </div>
  );
}
