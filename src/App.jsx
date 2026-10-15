import React, { useCallback, useEffect, useRef, useState } from 'react';
import BanList from './components/BanList.jsx';
import CatCard from './components/CatCard.jsx';
import { fetchRandomCats, findAllowedCat, MAX_PAGES } from './lib/cats.js';
import { loadSession, saveSession } from './lib/session.js';

function App() {
  const [initialSession] = useState(loadSession);
  const [current, setCurrent] = useState(initialSession.current);
  const [history, setHistory] = useState(initialSession.history);
  const [banned, setBanned] = useState(initialSession.banned);
  const [storageAvailable, setStorageAvailable] = useState(initialSession.storageAvailable);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(initialSession.current
    ? 'Welcome back. Your last cat and trail are right where you left them.'
    : 'Your next favorite is one curious click away.');
  const [error, setError] = useState('');
  const seen = useRef(new Set(initialSession.seenIds));
  const inFlight = useRef(false);

  useEffect(() => {
    const saved = saveSession({ current, history, banned, seenIds: [...seen.current] });
    if (saved !== storageAvailable) setStorageAvailable(saved);
  }, [current, history, banned, storageAvailable]);

  const discover = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError('');
    setMessage('Looking through the cat files…');
    const tried = new Set();

    try {
      for (let page = 0; page < MAX_PAGES; page += 1) {
        const candidates = await fetchRandomCats();
        const freshCandidates = candidates.filter((cat) => !tried.has(cat.id));
        freshCandidates.forEach((cat) => tried.add(cat.id));
        const next = findAllowedCat(freshCandidates, banned, seen.current);
        if (!next) continue;

        seen.current.add(next.id);
        setCurrent(next);
        setHistory((items) => [next, ...items.filter((item) => item.id !== next.id)]);
        setMessage(`Found a match after checking ${tried.size} ${tried.size === 1 ? 'portrait' : 'portraits'}.`);
        inFlight.current = false;
        setLoading(false);
        return;
      }

      if (tried.size === 0) throw new Error('No cat photos came back. Please try again.');
      setMessage(`The last ${tried.size} portraits missed your filters. Remove a filter or try again.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something interrupted the discovery. Please try again.');
      setMessage('The Commons collection is taking a break.');
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [banned]);

  const addBan = ({ type, value }) => {
    setBanned((items) => items.some((item) => item.type === type && item.value === value)
      ? items
      : [...items, { type, value }]);
    setMessage(`${value} added to your no-thanks list. The next discovery will skip it.`);
  };

  const removeBan = (removed) => {
    setBanned((items) => items.filter((item) => item.type !== removed.type || item.value !== removed.value));
    setMessage(`${removed.value} removed from your no-thanks list.`);
  };

  const clearBans = () => {
    setBanned([]);
    setMessage('Your no-thanks list is clear.');
  };

  const displayed = current;

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Veni Vici home"><span className="wordmark-mark">VV</span><span>VENI VICI<span className="wordmark-dot">.</span></span></a>
        <span className="topbar-note">A small adventure in cat discovery</span>
        <a className="topbar-link" href="#history">Your trail <span>{history.length}</span></a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow hero-kicker"><span className="live-dot" /> The internet's friendliest detour</p>
            <h1>Come curious.<br /><em>Leave with a cat.</em></h1>
            <p className="hero-description">A new face, a little backstory, and a few rabbit holes. Keep what you love, skip what you don't.</p>
            <button className="discover-button" type="button" onClick={discover} disabled={loading}>
              <span>{loading ? 'Looking around' : displayed ? 'Meet another cat' : 'Discover a cat'}</span>
              <span className="button-arrow" aria-hidden="true">↗</span>
            </button>
            <p className="status-line" aria-live="polite"><span className={loading ? 'status-pulse' : 'status-mark'} aria-hidden="true">{loading ? '·' : '✳'}</span>{message}</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun-disc" />
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="hero-stamp">THE<br />CAT<br />FILES <span>↘</span></div>
            <div className="hero-aside">VOL. 01<br />A VERY GOOD PLACE TO WANDER</div>
            <svg className="hero-cat" viewBox="0 0 340 320" role="presentation">
              <path d="M75 115 66 28l79 55c17-5 39-6 57-1l77-55-8 91c25 34 33 79 16 120-20 49-70 68-128 64-66-4-112-35-121-91-6-37 6-71 37-96Z" fill="#d78957" />
              <path d="m83 92-5-43 43 30m128 13 4-43-43 29" fill="#e8a580" />
              <path d="M95 142c17-16 43-13 55 2m41-2c15-15 40-16 57 0" fill="none" stroke="#402c27" strokeWidth="9" strokeLinecap="round" />
              <ellipse cx="123" cy="174" rx="10" ry="15" fill="#272323" /><ellipse cx="221" cy="174" rx="10" ry="15" fill="#272323" />
              <path d="m161 200 12 1 12-1-12 12Z" fill="#74443c" /><path d="M173 212c-1 17-18 20-26 12m26-12c1 17 18 20 26 12" fill="none" stroke="#402c27" strokeWidth="5" strokeLinecap="round" />
              <path d="M118 205 46 195m75 24-73 4m194-18 73-10m-73 34 75 3" fill="none" stroke="#402c27" strokeWidth="3" strokeLinecap="round" />
              <path d="M166 94c-7 23-8 39-5 50m26-50c8 23 9 39 6 50" fill="none" stroke="#b86e48" strokeWidth="5" strokeLinecap="round" />
            </svg>
            <span className="hero-art-caption">A cat photo from<br />the Commons collection</span>
          </div>
        </section>

        <div className="content-grid">
          <section className="discovery-column" aria-label="Cat discovery">
            {error && <div className="error-banner" role="alert"><span>{error}</span><button type="button" onClick={discover}>Try again</button></div>}
            {displayed ? (
              <CatCard cat={displayed} onBan={addBan} />
            ) : (
              <div className={`empty-result${loading ? ' empty-result--loading' : ''}`}>
                <div className="empty-icon" aria-hidden="true">{loading ? '…' : '✳'}</div>
                <p className="eyebrow">{loading ? 'Turning the pages' : 'Your canvas is ready'}</p>
                <h2>{loading ? 'Searching for your next cat.' : 'The next cat is out there.'}</h2>
                <p>{loading ? 'We check each portrait against your list before it arrives.' : 'Start the adventure and we will bring back one portrait at a time.'}</p>
                {!loading && <button className="inline-action" type="button" onClick={discover}>Find the first one <span>↗</span></button>}
              </div>
            )}
          </section>
          <aside className="side-column">
            <BanList items={banned} onRemove={removeBan} onClear={clearBans} />
            <div className="how-panel">
              <p className="eyebrow">How it works</p>
              <ol><li><span>01</span>Meet a cat and explore its details.</li><li><span>02</span>Tap any attribute to skip it next time.</li><li><span>03</span>Open a crossed-off filter to welcome it back.</li></ol>
              <p className="source-note">Cat photos and file metadata from <a href="https://commons.wikimedia.org/wiki/Category:Cats" target="_blank" rel="noreferrer">Wikimedia Commons ↗</a></p>
            </div>
          </aside>
        </div>

        <section id="history" className="history-section" aria-labelledby="history-heading">
          <div className="section-heading history-heading">
            <div><p className="eyebrow">The trail so far <span className="history-count">{history.length}</span></p><h2 id="history-heading">Cats you have met</h2></div>
            <p className="history-intro">
              {storageAvailable
                ? 'Your trail is saved in this browser and will be here when you return.'
                : 'This browser is blocking local storage, so this trail may not survive a reload.'}
            </p>
          </div>
          {history.length ? (
            <div className="history-grid">{history.map((cat, index) => <CatCard key={cat.id} cat={cat} onBan={addBan} compact index={history.length - index} />)}</div>
          ) : (
            <div className="history-empty"><span aria-hidden="true">↗</span><p>Your first discovery will start this collection.</p></div>
          )}
        </section>
      </main>

      <footer className="footer"><span>VENI VICI<span className="wordmark-dot">.</span></span><span>Go forth. Find cats.</span><a href="#top">Back to the top ↑</a></footer>
    </div>
  );
}

export default App;
