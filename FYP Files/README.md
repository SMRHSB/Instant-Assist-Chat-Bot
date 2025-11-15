# FYP Files — Backend & Model Artifacts

Overview
--------
This folder contains the Flask backend and related model artifacts and instance data used by the server. The important subfolders are:

- `Server/` — the Flask app and server-side code (`app.py`, `testing.py`).
- `Server/fine-tuned-all-mpnet-base-v2/` — local model artifacts (weights, tokenizer) used for embeddings (kept out of git).
- `instance/` — local DB files (e.g., `chatdb.sqlite3`) used in development; excluded from git.

Server architecture
-------------------
- `app.py` implements the REST endpoints (signup, signin, logout, session validation, and `/ask`). It also contains the retrieval (FAISS load) and generate (LLM call) logic.
- The retrieval pipeline:
	- Loads a category-specific FAISS index (from `faiss_indexes/<category>`).
	- Uses `sentence-transformers` embeddings to obtain query vectors.
	- Performs nearest-neighbour search with FAISS and filters/limits results.
- The generation pipeline:
	- Assembles context + chat history into a prompt template and calls the configured LLM (Groq in the current code).

Important environment variables
-------------------------------
- `GROQ_API_KEY` — required to instantiate the external chat model. The server will raise an error if this variable is missing.
- `JWT_SECRET_KEY` — secret used to sign JSON Web Tokens.
- `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` — database credentials if using MySQL. The code falls back to defaults (localhost/root) but you should set these.

Database notes
--------------
- The server uses MySQL via `mysql-connector-python` in production-style config. For quick local testing you can adapt `get_db_connection()` in `app.py` to use SQLite or ensure a local MySQL server is running.
- Sessions are persisted in a `sessions` table; users are stored in a `users` table. If you want, I can add a migration script or a SQL schema file.

Running locally (development)
-----------------------------

```powershell
cd "FYP Files/Server"
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install flask python-dotenv flask-cors mysql-connector-python bcrypt PyJWT
# Optional: for embeddings & FAISS
pip install sentence-transformers faiss-cpu langchain
copy .env.example .env
# Add values to .env (GROQ_API_KEY, JWT_SECRET_KEY, DB creds)
python app.py
```

API endpoints (summary)
-----------------------
- `POST /api/signup` — Register. Body: `{ name, email, password }`.
- `POST /api/signin` — Login. Body: `{ email, password }`. Returns JWT.
- `POST /api/logout` — Invalidate the JWT session (requires Authorization header `Bearer <token>`).
- `GET /api/validate-session` — Validate session (requires Authorization).
- `POST /ask` — Retrieval + generation endpoint. Body: `{ category, question, conversation_id? }`.

Model artifacts
---------------
- The `fine-tuned-all-mpnet-base-v2` folder contains embedding model files and tokenizer data. These files are large and intentionally excluded from the repository. When deploying, ensure the server can access the same model files used to build the FAISS indexes or use a remote embedding endpoint.

Troubleshooting
---------------
- Missing `GROQ_API_KEY`: set it in `.env` or export it in your shell.
- FAISS load errors: check that the index path matches `faiss_indexes/<category>` and that the embedding dimension matches the index.
- DB connection errors: verify `MYSQL_*` variables and that the DB is reachable.

Suggested next improvements I can implement
-----------------------------------------
- Generate a `requirements.txt` and optionally a `pip-tools` `requirements.in` to pin versions.
- Add a `migrations/` folder or SQL schema file to create `users` and `sessions` tables.
- Provide a PowerShell or bash helper script to create the venv and install dependencies automatically.

- The `fine-tuned-all-mpnet-base-v2` model directory contains large model weights and tokenizer files and is excluded from git to avoid accidentally pushing large binaries or secrets.
- The `instance/chatdb.sqlite3` file stores local DB data and is also excluded.

If you want, I can:
- Add a `requirements.txt` that pins package versions used by the server.
- Add a small script to create a venv and install dependencies automatically.
