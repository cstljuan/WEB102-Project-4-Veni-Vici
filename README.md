# Web Development Project 4 - *Veni Vici!*

Submitted by: **Juan Castillo**

This web app: **is a cat-photo discovery club. Meet one photo at a time, learn its title, creator, date, and license, ban details you want to skip, and revisit every discovery from your session.**

Time spent: **To be confirmed by Juan** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Application features a button that creates a new API fetch request on click and displays at least three attributes and an image obtained from the returned JSON data**
  - The same attribute types appear for every result: creator, date, and license. The file title and description are also displayed.
- [x] **Only one item/data from API call response is viewable at a time and at least one image is displayed per API call**
  - A single current result is shown at a time. Its image and metadata come from the same Wikimedia Commons file record.
- [x] **API call response results should appear random to the user**
  - Each request selects a random search offset from the large Commons cat image category. Already-seen files are skipped during this session.
- [x] **Clicking on a displayed value for one attribute adds it to a displayed ban list**
  - Creator, date, and license values are clickable. Clicking a value adds it to the list; clicking it in the list removes it immediately.
- [x] **Attributes on the ban list prevent further images/API results with that attribute from being displayed**
  - Each response batch is checked against active bans and the app requests another batch when needed. It shows a no-match message if four batches contain no eligible result.
  - [x] _The walkthrough recording must show a banned attribute being immediately removed from the list._

The following **optional** features are implemented:

- [x] Multiple types of attributes are clickable and can be added to the ban list.
- [x] Users can see a stored history of their previously displayed results from this session.
  - A dedicated section displays each previous image and its attributes.
  - Each successful Discover action updates the history with the newest result.

The following **additional** features are implemented:

* [x] Full creator, date, and license values can be banned. History items have the same clickable attributes.
* [x] Loading, error, exhausted-filter feedback, keyboard focus indicators, image descriptions, live status feedback, responsive layouts, and reduced-motion support.

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='walkthrough.gif' title='Veni Vici walkthrough showing discovery, attribute bans, filter removal, and session history' width='700' alt='Veni Vici walkthrough: discover a cat, ban its creator, remove the ban, discover another cat, and open the trail' />

The recording was captured from the deployed app at https://veni-vici-walkthrough.vercel.app/ with the Claude in Chrome GIF recorder. It shows Discover, clicking a creator to ban it, removing that ban from the list, discovering another cat, and opening the session trail.

## Notes

The app searches Wikimedia Commons for files in its cat image category and requests image URLs plus file metadata in one query. It filters out audio and other non-image files, then normalizes the image URL, title, creator, date, license, and description. `App` owns the current result, session history, ban list, and request state. Each discovery checks up to four batches of 50 files, skips matching filters and already-seen file IDs, and only then updates the current result and history. The displayed attributes and image come from the same Commons file record.

The Commons API is used without a private key. Individual Commons files may have different licenses; the app shows the license information returned with each file and links to its source page. Network access is required. See [LEARNING.md](LEARNING.md) for setup and implementation details.

## License

    Copyright 2026 Juan Castillo

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
