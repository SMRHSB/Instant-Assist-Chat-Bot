# Instant Assist Chat Bot

Overview
--------
This repository contains a product assistant application composed of:

- `Client/` — React + Vite frontend (UI, auth, chat interface)
- `FYP Files/` — backend server, fine-tuned embedding model artifacts, and DB instance
- `faiss_indexes/` — prebuilt FAISS index folders (binary indexes used for retrieval)

Architecture (flow)
-------------------
# Instant Assist Chat Bot — Detailed Overview

Overview
--------
This repository implements a retrieval-augmented product assistant. It is organized into three top-level areas:

- `Client/` — React + Vite frontend (TypeScript, Tailwind). Handles authentication, UI, and interactions with the backend APIs.
- `FYP Files/` — server code (Flask) in `FYP Files/Server/`, model artifacts (kept out of git), and local instance files.
- `faiss_indexes/` — prebuilt FAISS indexes per product category (ignored by git by default).

How it works (high-level)
-------------------------
1. The frontend calls the backend `/ask` endpoint with a JSON payload like:

   ```json
   { "category": "laptops", "question": "Which laptop has the best battery life?" }
   ```

2. The backend uses the configured embedding model (sentence-transformers) to embed the query, loads the category-specific FAISS index from `faiss_indexes/<category>/index.faiss`, and retrieves nearest-neighbour documents.
3. The retrieved documents are assembled into a prompt (plus recent conversation turns). The server calls the configured chat model (Groq LLM in `app.py`) to produce an answer.
4. The server responds to the frontend with a JSON answer object.

Key locations
-------------
- Frontend entry: `Client/src/main.tsx` and `Client/src/App.tsx`.
- Backend server: `FYP Files/Server/app.py`.
- FAISS indexes: `faiss_indexes/<category>/index.faiss` (binary).
- Model artifacts: `FYP Files/Server/fine-tuned-all-mpnet-base-v2/` (large — excluded from git).

Developer quickstart
--------------------

Frontend (development):

```powershell
cd Client
npm install
npm run dev
```

Backend (development):

```powershell
cd "FYP Files/Server"
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install flask python-dotenv flask-cors mysql-connector-python bcrypt PyJWT
# Optional: ML deps for embeddings & FAISS
pip install sentence-transformers faiss-cpu langchain
copy .env.example .env
# Edit .env and add GROQ_API_KEY, JWT_SECRET_KEY, DB settings
python app.py
```

Security & repository hygiene
-----------------------------
- `.gitignore` (root) excludes `.env`, venvs, FAISS indexes, model artifacts, and sqlite DBs to prevent accidental commits of secrets or large binaries.
- For sharing large artifacts (indexes/models) use cloud storage, GitHub Releases, or Git LFS rather than committing them to the main git history.

API examples
------------

Sign-in (curl):

```bash
curl -X POST "http://127.0.0.1:5000/api/signin" -H "Content-Type: application/json" -d '{"email":"you@example.com","password":"password"}'
```

Ask endpoint (curl):

```bash
curl -X POST "http://127.0.0.1:5000/ask" -H "Content-Type: application/json" -d '{"category":"laptops","question":"Which laptop has best battery life?"}'
```

Next steps I can help with
-------------------------
- Add a `requirements.txt` for the server and pin dependency versions.
- Add scripts to upload/download indexes from S3 (or other cloud storage).
- Add Git LFS configuration and `.gitattributes` for tracking FAISS indexes if you prefer storing them in the repo via LFS.
