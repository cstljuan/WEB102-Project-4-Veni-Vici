# Veni Vici! - Learning Notes

## Run the app

```sh
npm install
npm run dev
```

The app uses React and Vite. It needs an internet connection for Wikimedia Commons images and Google Fonts.

## Request and response flow

`fetchRandomCats()` in `src/lib/cats.js` uses `URLSearchParams` to query Wikimedia Commons for files in the `Cats` category. It requests 50 search results from a random offset, asks for image URLs and extended file metadata, and checks the HTTP response before parsing JSON. Audio and other non-image records are filtered out by MIME type.

The normalizer keeps each image URL and metadata from the same Commons file record: title, creator, date, license, and description. Metadata values that Commons returns as HTML are reduced to plain text before they appear in the interface. The image detail link opens that file's Commons page.

`App` calls the async fetch function when Discover is pressed. It checks each batch against active bans and IDs already seen during the session. If no eligible file appears, it requests another random batch up to four times. A successful result updates the current image and prepends it to history.

## State and interactions

- `current` stores the one image shown in the main result.
- `history` stores each discovered file once, newest first, for the lifetime of the page session.
- `banned` stores `{ type, value }` pairs for creator, date, and license.
- `loading`, `message`, and `error` give visible and screen-reader-friendly request feedback.
- A ref stores seen file IDs without making those IDs part of rendered interface state.

Each displayed creator, date, and license button adds that exact value to the ban list. Each ban chip removes its own value. A file matching any active ban cannot become the next displayed result.

## API

The app uses Wikimedia Commons' MediaWiki API with `action=query`, `generator=search`, `gsrsearch=incategory:Cats`, `gsrnamespace=6`, `prop=imageinfo`, and `iiprop=url|extmetadata|mime`. It requests thumbnails with `iiurlwidth=960`, then uses the returned image URL directly. Documentation: <https://www.mediawiki.org/wiki/API:Search> and <https://www.mediawiki.org/wiki/API:Imageinfo>.

Commons file metadata and licenses vary by item. The app displays the license information returned by the source and links back to each file page. If the API fails, inspect the browser Network panel and the error message in the interface.
