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
- `src/App.jsx` is the entire app in one component: seeded `transactions` state, the add-transaction form state, type/category filter state, derived totals (income, expenses, balance), and the filtered transaction table.
- Transaction shape: `{ id, description, amount: number, type: "income" | "expense", category, date: "YYYY-MM-DD" }`. Form input is a string, so convert `amount` with `Number()` when creating a transaction. Categories are a hardcoded array in `App.jsx`, shared by the form and the filter.
- Styling: global styles in `src/index.css`, component styles in `src/App.css` (plain CSS, class names like `.summary-card`, `.income-amount`, `.expense-amount`).

## Known issues

- The "Freelance Work" seed entry has `type: "expense"` despite the `salary` category.
