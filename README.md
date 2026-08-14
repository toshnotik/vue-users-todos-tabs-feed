# Frontend Test Assignment

Vue 3 test assignment with TypeScript, Pinia, Composition API, SCSS and JSONPlaceholder REST API.

## Features

- Users table with sorting, role/status filters and pagination.
- Todo list with create, edit, delete, complete and localStorage persistence.
- Tabs with active tab stored in the URL query parameter.
- Feedback form with live validation, submit state and localStorage persistence.
- Infinite posts feed with Intersection Observer and skeleton loading.
- Reusable modal with slot content, Teleport, overlay close and ESC close.

## Stack

- Vue 3
- TypeScript
- Pinia
- SCSS
- Vite
- JSONPlaceholder API

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Notes

JSONPlaceholder returns only 10 users, so the API layer expands that data to 60 table rows. This keeps the real `/users` endpoint in use while making pagination and page-size controls easy to test.
