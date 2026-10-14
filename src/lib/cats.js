const API_ROOT = 'https://api.thecatapi.com/v1';
const PAGE_SIZE = 40;
const MAX_PAGES = 4;

function normalizeBreed(breed) {
  return {
    id: breed.id,
    name: breed.name,
    origin: breed.origin || 'Unknown origin',
    temperament: breed.temperament || 'Temperament not listed',
    description: breed.description || 'A cat with a story still waiting to be told.',
    lifeSpan: breed.life_span ? `${breed.life_span} years` : 'Not listed',
    wikipediaUrl: breed.wikipedia_url || '',
  };
}

export function normalizeCat(record) {
  const breed = record.breeds?.[0];
  if (!record.url || !breed?.id || !breed.name) return null;

  return {
    id: record.id,
    image: record.url,
    width: record.width,
    height: record.height,
    breed: normalizeBreed(breed),
  };
}

export async function fetchRandomCats({ signal } = {}) {
  const query = new URLSearchParams({
    limit: String(PAGE_SIZE),
    order: 'RANDOM',
    size: 'med',
  });
  const response = await fetch(`${API_ROOT}/images/search?${query}`, { signal });
  if (!response.ok) {
    throw new Error(`The cat library returned ${response.status}. Try again in a moment.`);
  }

  const records = (await response.json()).map(normalizeCat).filter(Boolean);
  if (records.length) return records;

  // Some unfiltered random records have no breed data. Choose a breed first, then
  // request a random image for that breed so the image and attributes stay paired.
  const breedsResponse = await fetch(`${API_ROOT}/breeds`, { signal });
  if (!breedsResponse.ok) {
    throw new Error(`The breed library returned ${breedsResponse.status}. Try again in a moment.`);
  }
  const breeds = await breedsResponse.json();
  const breed = breeds[Math.floor(Math.random() * breeds.length)];
  if (!breed?.id) return [];

  const breedQuery = new URLSearchParams({
    limit: String(PAGE_SIZE),
    breed_ids: breed.id,
    order: 'RANDOM',
    size: 'med',
  });
  const breedResponse = await fetch(`${API_ROOT}/images/search?${breedQuery}`, { signal });
  if (!breedResponse.ok) {
    throw new Error(`The image library returned ${breedResponse.status}. Try again in a moment.`);
  }
  return (await breedResponse.json()).map(normalizeCat).filter(Boolean);
}

export function isCatBanned(cat, banned) {
  return banned.some((entry) => {
    if (entry.type === 'breed') return cat.breed.id === entry.value;
    if (entry.type === 'origin') return cat.breed.origin === entry.value;
    if (entry.type === 'temperament') {
      return cat.breed.temperament === entry.value;
    }
    return false;
  });
}

export function findAllowedCat(records, banned, seenIds) {
  return records.find((cat) => !isCatBanned(cat, banned) && !seenIds.has(cat.id));
}

export { MAX_PAGES };
