# Instant Assist Chat Bot

Overview
--------
This repository contains a product assistant application composed of:

- `Client/` — React + Vite frontend (UI, auth, chat interface)
- `FYP Files/` — backend server, fine-tuned embedding model artifacts, and DB instance
- `faiss_indexes/` — prebuilt FAISS index folders (binary indexes used for retrieval)

Architecture (flow)
-------------------
```mermaid
flowchart LR
  Client[Client (React/Vite)] -->|"HTTP: /ask, /api/*"| Server[Server (Flask)]
  Server -->|"Similarity search"| FAISS[FAISS Indexes]
  Server -->|"Embeddings & model files"| Model[Local fine-tuned model folder]
  Server -->|"Session persistence"| DB[(instance/chatdb.sqlite3 or MySQL)]
```

Quickstart
----------

Frontend

```powershell
cd Client
npm install
npm run dev
```

# Instant Assist Chat Bot

Overview
--------
This repository contains a product assistant application composed of:

- `Client/` — React + Vite frontend (UI, auth, chat interface)
- `FYP Files/` — backend server, fine-tuned embedding model artifacts, and DB instance
- `faiss_indexes/` — prebuilt FAISS index folders (binary indexes used for retrieval)

Architecture (flow)
-------------------
```mermaid
flowchart LR
  Client[Client (React/Vite)] -->|HTTP: /ask, /api/*| Server[Server (Flask)]
  Server -->|Similarity search| FAISS[FAISS Indexes]
  Server -->|Embeddings & model files| Model[Local fine-tuned model folder]
  Server -->|Session persistence| DB[(instance/chatdb.sqlite3 or MySQL)]
```

Quickstart
----------

Frontend

```powershell
cd Client
npm install
npm run dev
```

Backend (development)

```powershell
cd "FYP Files/Server"
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install flask python-dotenv flask-cors mysql-connector-python bcrypt PyJWT langchain sentence-transformers faiss-cpu
copy .env.example .env
# Fill in the required keys inside .env (GROQ_API_KEY, JWT_SECRET_KEY, DB credentials)
python app.py
```

Security & git
---------------
- A root `.gitignore` has been added to avoid committing secrets and large files. It ignores `node_modules/`, Python virtual environments, `.env` files, FAISS indexes, model weights, and local DB files.
- Keep credentials in `.env` (never commit) or use a secrets manager.

Where to look next
------------------
- `Client/README.md` — frontend details and scripts
- `faiss_indexes/README.md` — what FAISS indexes are and how to rebuild them
- `FYP Files/README.md` — backend and model notes
