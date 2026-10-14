# Veni Vici! - Learning Notes

## Run the app

```sh
npm install
npm run dev
```

The app uses React and Vite. It needs an internet connection for The Cat API and Google Fonts.

## Request and response flow

`fetchRandomCats()` in `src/lib/cats.js` builds a query with `URLSearchParams`, requests up to 40 random medium images that have breed metadata, checks the HTTP status, parses JSON, and normalizes each usable record. The normalizer keeps image URL and breed information together, so displayed details describe that result.

`App` calls the async function when Discover is pressed. The app checks each batch against the active bans and IDs already seen during this session. If the batch has no allowed cat, it makes another request, up to four batches. If no match appears, it explains that the user can remove a filter or try again. A successful result updates the current cat and prepends the cat to history.

## State and interactions

- `current` stores the one cat shown in the main result.
- `history` stores each discovered cat once, newest first, for the lifetime of the page session.
- `banned` stores `{ type, value }` pairs. Types are breed, origin, and temperament.
- `loading`, `message`, and `error` give visible and screen-reader-friendly request feedback.
- A ref stores seen image IDs without making those IDs part of the rendered interface state.

Each detail button adds the corresponding displayed value to the ban list. Each ban chip removes its own value. A cat matching any active ban cannot become the next displayed result.

## API

The app uses The Cat API's `GET /v1/images/search` endpoint with `limit`, `has_breeds`, `order`, and `size` query parameters. Documentation: <https://developers.thecatapi.com/>. The returned `breeds` field is used for the breed name, origin, temperament, description, lifespan, and optional encyclopedia link.

If the API fails, inspect the browser Network panel and the error message in the interface. The public endpoint may change its behavior or availability independently of this code.
