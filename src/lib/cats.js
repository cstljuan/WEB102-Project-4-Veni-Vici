const API_ROOT = 'https://commons.wikimedia.org/w/api.php';
const PAGE_SIZE = 50;
const MAX_PAGES = 4;
// Commons' search results for this category fit within the first few pages.
// Large offsets silently return an empty `pages` object, so randomize only
// within the verified result window.
const SEARCH_WINDOW = 100;

function plainText(value = '') {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function metadataValue(metadata, key) {
  return plainText(metadata?.[key]?.value || '');
}

function normalizeCat(record) {
  const image = record.imageinfo?.[0];
  const metadata = image?.extmetadata;
  if (!image?.thumburl || !image.mime?.startsWith('image/')) return null;

  const filename = record.title.replace(/^File:/, '');
  const title = metadataValue(metadata, 'ObjectName') || filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
  const rawDate = metadataValue(metadata, 'DateTimeOriginal') || metadataValue(metadata, 'DateTime');
  const date = rawDate.match(/\b(?:1[0-9]{3}|20[0-9]{2})\b/)?.[0] || 'Date not listed';

  return {
    id: String(record.pageid),
    image: image.thumburl,
    width: image.thumbwidth || image.width,
    height: image.thumbheight || image.height,
    title,
    creator: metadataValue(metadata, 'Artist') || metadataValue(metadata, 'Credit') || 'Creator not listed',
    date,
    license: metadataValue(metadata, 'LicenseShortName') || 'License details not listed',
    description: metadataValue(metadata, 'ImageDescription') || title,
    sourceUrl: image.descriptionurl,
  };
}

export async function fetchRandomCats({ signal } = {}) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: 'incategory:Cats',
    gsrnamespace: '6',
    gsrlimit: String(PAGE_SIZE),
    gsroffset: String(Math.floor(Math.random() * SEARCH_WINDOW)),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|mime',
    iiurlwidth: '960',
    format: 'json',
    origin: '*',
  });
  const response = await fetch(`${API_ROOT}?${params}`, { signal });
  if (!response.ok) {
    throw new Error(`Wikimedia Commons returned ${response.status}. Please try again.`);
  }

  const payload = await response.json();
  return Object.values(payload.query?.pages || {}).map(normalizeCat).filter(Boolean);
}

export function isCatBanned(cat, banned) {
  return banned.some((entry) => {
    if (entry.type === 'creator') return cat.creator === entry.value;
    if (entry.type === 'date') return cat.date === entry.value;
    if (entry.type === 'license') return cat.license === entry.value;
    return false;
  });
}

export function findAllowedCat(records, banned, seenIds) {
  return records.find((cat) => !isCatBanned(cat, banned) && !seenIds.has(cat.id));
}

export { MAX_PAGES };
