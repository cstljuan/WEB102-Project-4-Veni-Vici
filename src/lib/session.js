const STORAGE_KEY = 'veni-vici-session-v1';
const BAN_TYPES = new Set(['creator', 'date', 'license']);

function isSecureUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function isCat(value) {
  return value &&
    typeof value.id === 'string' &&
    isSecureUrl(value.image) &&
    typeof value.title === 'string' &&
    typeof value.creator === 'string' &&
    typeof value.date === 'string' &&
    typeof value.license === 'string' &&
    typeof value.description === 'string' &&
    isSecureUrl(value.sourceUrl);
}

function emptySession(storageAvailable = true) {
  return { current: null, history: [], banned: [], seenIds: [], storageAvailable };
}

function compactCat(cat) {
  return { ...cat, description: cat.description.slice(0, 800) };
}

export function loadSession() {
  if (typeof window === 'undefined') return emptySession(false);

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySession();

    const saved = JSON.parse(raw);
    if (saved?.version !== 1) return emptySession();

    const history = Array.isArray(saved.history) ? saved.history.filter(isCat) : [];
    const current = isCat(saved.current) ? saved.current : history[0] || null;
    const banned = Array.isArray(saved.banned)
      ? saved.banned.filter((item) => item && BAN_TYPES.has(item.type) && typeof item.value === 'string')
      : [];
    const seenIds = Array.isArray(saved.seenIds)
      ? saved.seenIds.filter((id) => typeof id === 'string')
      : [];

    return {
      current,
      history,
      banned,
      seenIds: [...new Set([...seenIds, ...history.map((cat) => cat.id), ...(current ? [current.id] : [])])],
      storageAvailable: true,
    };
  } catch {
    return emptySession(false);
  }
}

export function saveSession({ current, history, banned, seenIds }) {
  if (typeof window === 'undefined') return false;

  try {
    const saved = {
      version: 1,
      current: current ? compactCat(current) : null,
      history: history.map(compactCat),
      banned,
      seenIds,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return true;
  } catch {
    return false;
  }
}
