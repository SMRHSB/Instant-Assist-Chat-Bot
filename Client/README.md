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
# Client (Frontend)

Overview
--------
The `Client/` folder contains the frontend built with Vite, React and TypeScript. It implements the chat UI, authentication flows, category selector for product categories, and communicates with the Flask backend.

Purpose
-------
- Allow users to sign up / sign in and maintain a chat-style conversation.
- Let users pick product categories (laptops, mobiles, etc.) and ask category-specific questions.
- Display retrieval-augmented answers returned by the backend in a clean, readable format.

Key files and structure
-----------------------
- `src/main.tsx` — React entry point and router setup.
- `src/App.tsx` — main layout and route mounting.
- `src/components/` — individual UI components (Sidebar, Navbar, Chat, Tutorial, etc.).
- `src/pages/` — page-level components (Dashboard, QAPage, LoginPage, SignupPage, ProfilePage).

Scripts (from `package.json`)
-----------------------------
- `npm run dev` — start Vite dev server.
- `npm run build` — build production bundle.
- `npm run preview` — preview the production build.
- `npm run lint` — run ESLint.

Configuration and environment
-----------------------------
- The frontend expects an API base URL for backend calls. By default the code assumes `http://127.0.0.1:5000`. If you host the backend elsewhere, update the API base URL in the code (search for `fetch` or API helper files in `src/`).

Local development tips
----------------------
- Start the backend first so the frontend can reach `/ask` and the auth endpoints.
- If the frontend can't reach the server due to CORS, check the Flask `CORS` setup in `FYP Files/Server/app.py`.

Testing and linting
-------------------
- Lint with `npm run lint`. Add tests as needed — the repo currently doesn't include unit tests for the frontend.

Deployment notes
----------------
- To build for production:

```powershell
cd Client
npm install
npm run build
npm run preview
```

- Serve the `dist/` folder from any static hosting (Vercel, Netlify, Surge) or include it in a Docker image.

Troubleshooting
---------------
- If UI styles look broken, ensure `tailwind` is built and `index.css` is imported in `main.tsx`.
- If routes show 404 when deployed, configure your host to fallback to `index.html` for single page apps.
