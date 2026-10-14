import React from 'react';

function BanList({ items, onRemove, onClear }) {
  return (
    <section className="ban-panel" aria-labelledby="ban-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your filters</p>
          <h2 id="ban-heading">The no-thanks list</h2>
        </div>
        {items.length > 0 && (
          <button className="text-button" type="button" onClick={onClear}>Clear all</button>
        )}
      </div>
      {items.length ? (
        <ul className="ban-list">
          {items.map((item) => (
            <li key={`${item.type}:${item.value}`}>
              <button
                className="ban-chip"
                type="button"
                aria-label={`Remove ${item.value} from banned ${item.type}`}
                onClick={() => onRemove(item)}
              >
                <span className="chip-type">{item.type}</span>
                <span>{item.value}</span>
                <span className="chip-remove" aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-note">Nothing on the list. Tap a detail you would rather skip.</p>
      )}
    </section>
  );
}

export default BanList;
