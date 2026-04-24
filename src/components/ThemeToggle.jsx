import { SunIcon, MoonIcon } from './Icons.jsx';

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="theme-toggle"
      id="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="theme-toggle__track">
        <span className="theme-toggle__icon theme-toggle__icon--sun">
          <SunIcon size={14} />
        </span>
        <span className="theme-toggle__icon theme-toggle__icon--moon">
          <MoonIcon size={14} />
        </span>
        <div className="theme-toggle__thumb" />
      </div>
    </button>
  );
}
