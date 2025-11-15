# Client (Frontend)

Overview
--------
This folder contains the React frontend built with Vite and TypeScript. It provides the UI, user authentication, category selection, chat interface, and calls backend endpoints under `/api/*` and `/ask`.

Key files
---------
- `src/main.tsx` — app entry point
- `src/App.tsx` — main application layout
- `src/components/` — UI components

Tech stack
----------
- Vite + React
- TypeScript
- Tailwind CSS
- Zustand for state

Available scripts (in `package.json`)
------------------------------------
- `npm run dev` — start development server (Vite)
- `npm run build` — build production bundle
- `npm run preview` — preview the built site
- `npm run lint` — run ESLint

Quickstart
----------

```powershell
cd Client
npm install
npm run dev
```

Notes
-----
- The frontend expects the backend server to be reachable at the address it was configured to call (by default `http://127.0.0.1:5000` for the Flask dev server). Adjust any API base URL if you run the backend on a different host/port.
- Keep local secrets (if any) out of version control. Use the root `.gitignore`.
