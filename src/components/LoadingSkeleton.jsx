export default function LoadingSkeleton() {
  return (
    <div className="skeleton-grid" id="loading-skeleton">
      {Array.from({ length: 10 }).map((_, i) => (
        <div className="skeleton-card" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="skeleton-card__poster" />
          <div className="skeleton-card__info">
            <div className="skeleton-card__title" />
            <div className="skeleton-card__meta" />
          </div>
        </div>
      ))}
    </div>
  );
}
