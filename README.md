# betashares-search

Search UI for Betashares fund search API.

## Project Setup

### Install dependencies

```sh
npm install
```

### Run development server

```sh
npm run dev
```

## Known issues

- Noticed an issue with sorting on certain fields, e.g. a search for ASX sorted by display_name.desc places iShares below VanEck. I've assumed the sorting is correct so have not implemented a client side fix as this would introduce issues with paginated results.
