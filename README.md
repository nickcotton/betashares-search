# betashares-search

Search UI for Betashares fund search API.

## Overview

This is a Vue.js based application that queries the betasearch API for a particular query. A few interesting details about the implementation:

- The search query and filters are kept in sync with the URL query params. This makes search/filter combinations easily savable/sharable.
- I couldn't find a way to get a dynamic list of popular search terms (to use as auto-suggestions), so I hardcoded one. It lives at `src/lib/popular-searches.json` and is a deduplicated list of all symbols, display names, asset categories, categories and tags. Happy to provide the source of the script I used to generate this.

Given unlimited time, I might continue to flesh out the available filters and fields revealed for each result. I might also explore a more table-like approach, with sorting and filtering baked into that UI.

## Known issues

- Noticed an issue with sorting on certain fields, e.g. a search for ASX sorted by display_name.desc places iShares below VanEck. I've assumed the sorting is correct so have not implemented a client side fix as this would introduce issues with paginated results.

## Project Setup

### Install dependencies

```sh
npm install
```

### Run development server

```sh
npm run dev
```

### Visit

```sh
http://localhost:3000
```
