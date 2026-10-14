function Attribute({ type, value, onBan, title }) {
  const description = type === 'temperament' ? 'Temperament' : type === 'origin' ? 'From' : 'Breed';
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
        <img src={cat.image} alt={`${cat.breed.name}, a cat breed originating in ${cat.breed.origin}`} loading="lazy" />
        {index != null && <span className="history-index">{String(index).padStart(2, '0')}</span>}
        <span className="image-caption">No. {cat.id.slice(-5).toUpperCase()}</span>
      </div>
      <div className="cat-card-body">
        <div className="cat-title-row">
          <div>
            <p className="eyebrow">The current visitor</p>
            <h2>{cat.breed.name}</h2>
          </div>
          <span className="verified-mark" title="Breed information paired with this image" aria-label="Image and breed information matched">✓</span>
        </div>
        {!compact && <p className="cat-description">{cat.breed.description}</p>}
        <div className="attributes" aria-label="Clickable cat details. Select any detail to add it to your no-thanks list.">
          <Attribute type="breed" value={cat.breed.name} title={cat.breed.name} onBan={onBan} />
          <Attribute type="origin" value={cat.breed.origin} title={cat.breed.name} onBan={onBan} />
          <Attribute type="temperament" value={cat.breed.temperament.split(',')[0].trim()} title={cat.breed.name} onBan={onBan} />
        </div>
        {!compact && (
          <div className="cat-meta">
            <span>Typical lifespan <strong>{cat.breed.lifeSpan}</strong></span>
            {cat.breed.wikipediaUrl && <a href={cat.breed.wikipediaUrl} target="_blank" rel="noreferrer">Read about this breed ↗</a>}
          </div>
        )}
      </div>
    </article>
  );
}

export default CatCard;
