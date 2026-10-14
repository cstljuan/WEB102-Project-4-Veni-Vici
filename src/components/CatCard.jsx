function Attribute({ type, value, onBan, title }) {
  const description = type === 'creator' ? 'Creator' : type === 'date' ? 'Date' : 'License';
  return (
    <button className="attribute" type="button" onClick={() => onBan({ type, value, label: title })}>
      <span className="attribute-label">{description}</span>
      <span className="attribute-value">{value}</span>
      <span className="attribute-action" aria-hidden="true">+</span>
    </button>
  );
}

function CatCard({ cat, onBan, compact = false, index }) {
  return (
    <article className={`cat-card${compact ? ' cat-card--compact' : ''}`}>
      <div className="cat-image-wrap">
        <img src={cat.image} alt={cat.description} loading="lazy" />
        {index != null && <span className="history-index">{String(index).padStart(2, '0')}</span>}
        <span className="image-caption">No. {cat.id.slice(-5).toUpperCase()}</span>
      </div>
      <div className="cat-card-body">
        <div className="cat-title-row">
          <div>
            <p className="eyebrow">The current visitor</p>
            <h2>{cat.title}</h2>
          </div>
          <span className="verified-mark" title="Image and metadata are from the same Commons file" aria-label="Image and metadata match">✓</span>
        </div>
        {!compact && <p className="cat-description">{cat.description}</p>}
        <div className="attributes" aria-label="Clickable image details. Select any detail to add it to your no-thanks list.">
          <Attribute type="creator" value={cat.creator} title={cat.title} onBan={onBan} />
          <Attribute type="date" value={cat.date} title={cat.title} onBan={onBan} />
          <Attribute type="license" value={cat.license} title={cat.title} onBan={onBan} />
        </div>
        {!compact && (
          <div className="cat-meta">
            <span>From <strong>Wikimedia Commons</strong></span>
            <a href={cat.sourceUrl} target="_blank" rel="noreferrer">View file details ↗</a>
          </div>
        )}
      </div>
    </article>
  );
}

export default CatCard;
