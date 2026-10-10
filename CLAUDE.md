# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Starter project for a Claude Code course: a React expense tracker that **intentionally** ships with a bug, poor UI, and messy code, to be fixed incrementally during the course. Don't assume existing patterns are the intended style, and don't fix unrelated problems unprompted — keep changes scoped to what is asked.

## Commands

```bash
npm install
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the built dist/
npm run lint      # ESLint (flat config in eslint.config.js)
```

There is no test runner or test suite configured.

## Architecture

- Vite + React 19, plain JavaScript (JSX), ES modules. No router, state library, backend, or persistence — data lives only in React state and resets on reload.
- `index.html` → `src/main.jsx` (mounts `<App />` in `StrictMode`) → `src/App.jsx`.
- Components live flat in `src/` (no `components/` folder). State is kept in the component that uses it; only `transactions` is shared.
  - `src/App.jsx`: owns the seeded `transactions` state and the `categories` array, defines `handleAdd` (appends a transaction) and `handleDelete` (removes one by `id`), and renders the header plus the children below, in a CSS grid laid out in `App.css`.
  - `src/Summary.jsx`: props `transactions`. Derives total income, expenses, and balance and renders the "left to spend" figure with a spent-vs-income meter.
  - `src/SpendingChart.jsx`: props `transactions`. Sums expense amounts per category and renders a sorted vertical bar chart (Recharts).
  - `src/TransactionForm.jsx`: props `categories`, `onAdd`. Owns the add-form field state, builds the new transaction (id via `Date.now()`, today's date), calls `onAdd`, then resets the fields.
  - `src/TransactionList.jsx`: props `transactions`, `categories`, `onDelete`. Owns the type/category filter state and renders the filters and the filtered table, with a Delete button per row that calls `onDelete(id)`.
- Transaction shape: `{ id, description, amount: number, type: "income" | "expense", category, date: "YYYY-MM-DD" }`. Form input is a string, so `TransactionForm` converts `amount` with `Number()`. Categories are a hardcoded array in `App.jsx`, passed as a prop to both the form and the list.
- `src/format.js`: shared display formatters (`formatMoney`, `formatShortMoney`, `formatDate`, `formatCategory`). Data stays raw; format only when rendering.
- Styling: color tokens (CSS custom properties) and global styles in `src/index.css`, component styles in `src/App.css` (plain CSS, class names like `.balance-figure`, `.meter`, `.tx-amount`). The Archivo font is loaded from Google Fonts in `index.html`. `SpendingChart.jsx` repeats the color hexes as constants because SVG attributes can't read CSS variables, so keep the two in sync.

## Known issues

- The "Freelance Work" seed entry has `type: "expense"` despite the `salary` category.
