# FYP Files

Overview
--------
This folder contains the backend `Server/`, model artifacts (a fine-tuned Sentence-Transformers folder), and local instance data.

Key subfolders
# FYP Files

Overview
--------
This folder contains the backend `Server/`, model artifacts (a fine-tuned Sentence-Transformers folder), and local instance data.

Key subfolders
--------------
- `Server/` — Flask backend that handles authentication, session management, and an `/ask` endpoint which uses FAISS-based retrieval + an LLM.
- `Server/fine-tuned-all-mpnet-base-v2/` — local copy of the fine-tuned embedding model (large; excluded from git).
- `instance/` — local DB used by the Flask app (e.g., `chatdb.sqlite3` — excluded from git).

Running the Server
------------------
See `FYP Files/Server/README.md` for a detailed run and environment setup. In short:

```powershell
cd "FYP Files/Server"
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install flask python-dotenv flask-cors mysql-connector-python bcrypt PyJWT langchain sentence-transformers faiss-cpu
copy .env.example .env
# fill the required env vars in .env
python app.py
```

Important environment variables
-------------------------------
- `GROQ_API_KEY` — API key used to call the external LLM provider (required by the app)
- `JWT_SECRET_KEY` — secret for signing JWTs
- `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` — DB credentials if using MySQL

Model & data safety
-------------------
- The `fine-tuned-all-mpnet-base-v2` model directory contains large model weights and tokenizer files and is excluded from git to avoid accidentally pushing large binaries or secrets.
- The `instance/chatdb.sqlite3` file stores local DB data and is also excluded.

If you want, I can:
- Add a `requirements.txt` that pins package versions used by the server.
- Add a small script to create a venv and install dependencies automatically.
