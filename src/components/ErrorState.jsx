import { AlertCircleIcon } from './Icons.jsx';

export default function ErrorState({ message }) {
  return (
    <div className="state-message state-message--error" id="error-state">
      <span className="state-message__icon">
        <AlertCircleIcon size={48} />
      </span>
      <h2 className="state-message__title">Something went wrong</h2>
      <p className="state-message__text">{message}</p>
    </div>
  );
}
