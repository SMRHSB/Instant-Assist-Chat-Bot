# Server (Flask) — README

Short overview
--------------
This repository contains a Flask-based backend that exposes endpoints for signup/signin/logout, session validation, and a `/ask` endpoint that uses a Groq-hosted LLM plus local Sentence Transformers embeddings and FAISS retrieval. The app expects certain environment variables (API keys, DB credentials) and a running MySQL instance.

What I read to determine run steps
----------------------------------
- `app.py` and `testing.py` — both start a Flask app via `if __name__ == "__main__": app.run(debug=True)`.
- The code uses `python-dotenv` to load environment variables and requires a `GROQ_API_KEY` and `JWT_SECRET_KEY` and MySQL connection variables.

Quick prerequisites
-------------------
- Python 3.10+ (3.8+ may also work, but prefer 3.10+)
- pip
- A MySQL server (or adapt the code to another DB)
- Network access for the Groq LLM if you intend to call it
- (Optional) A virtual environment

Suggested Python packages (install into a venv)
------------------------------------------------
The code imports these third-party packages — install the ones you need:
- flask
- python-dotenv
- flask-cors
- mysql-connector-python
- bcrypt
- PyJWT
- langchain
- langchain-huggingface
- langchain-community
- sentence-transformers
- faiss-cpu (or faiss-gpu if you have GPU and want the GPU build)

You can install the most common ones with:

```powershell
# create venv (PowerShell)
python -m venv .venv; .\.venv\Scripts\Activate.ps1

# install core packages
pip install flask python-dotenv flask-cors mysql-connector-python bcrypt PyJWT
# Optional / ML packages (may take long to install)
pip install langchain sentence-transformers faiss-cpu
```

Set up environment variables (safe local workflow)
-------------------------------------------------
1. Copy the example file to `.env`:

```powershell
copy .env.example .env
```

2. Edit `.env` and replace placeholders with real values (especially `GROQ_API_KEY` and `JWT_SECRET_KEY`).

Notes on secrets and git
------------------------
- `.env` is excluded by `.gitignore` (see `.gitignore` in this repo). Keep your real keys in `.env` or a secure secrets manager — do NOT commit them.
- The repository also ignores the local `instance/` folder, SQLite files, and the `fine-tuned-all-mpnet-base-v2` model folder to avoid accidentally uploading large model weights or databases.

How to run the app (development)
--------------------------------
1. Activate your virtual environment (PowerShell):

```powershell
.\.venv\Scripts\Activate.ps1
```

2. Ensure `.env` is present and filled.
3. Run the app:

```powershell
python app.py
```

This starts Flask with the built-in server (debug=True). By default it listens on `http://127.0.0.1:5000` unless overridden.

Important environment variables the app requires
-----------------------------------------------
- GROQ_API_KEY — required by the code (used to init the LLM with `init_chat_model`). The app will raise an error if `GROQ_API_KEY` is missing.
- JWT_SECRET_KEY — used to sign and validate JSON Web Tokens.
- MYSQL_HOST / MYSQL_USER / MYSQL_PASSWORD / MYSQL_DATABASE — database credentials used by `get_db_connection()`.

Endpoints (observed in code)
----------------------------
- POST `/api/signup` — Register a user. JSON body: { name, email, password }
- POST `/api/signin` — Login. JSON body: { email, password }
- POST `/api/logout` — Requires Authorization header (Bearer <token>)
- GET `/api/validate-session` — Requires Authorization header
- POST `/ask` — Query the LLM / retrieval endpoint. JSON body: { category, question, conversation_id? }

Notes & caveats
---------------
- The code loads `GROQ_API_KEY` and will call `init_chat_model("llama3-70b-8192", model_provider="groq")`. Ensure you have correct API access and understand potential usage costs.
- If you don't want to use MySQL while testing, you'll need to modify `get_db_connection()` and related DB calls to use SQLite or stub/mock DB responses.
- The app imports many LangChain-related packages and FAISS; installing and configuring those can be more involved (embedding model downloads, faiss index files, etc.).

Recommended next steps / improvements
------------------------------------
- Add a `requirements.txt` (I can create a minimal one for you if you want).
- Add simple smoke tests (e.g., test that `python -m flask run` or `python app.py` starts without missing env vars — after you supply `GROQ_API_KEY`).
- If you want local dev without GROQ, add a small flag or a fake/mock LLM implementation to bypass external API calls.

If you'd like, I can:
- Create a `requirements.txt` automatically with the packages referenced.
- Add a small script to run the app with Gunicorn or UVicorn for production.
- Add a simple unit test that validates environment variable loading.

Completion summary
------------------
Created:
- `.gitignore` — ignores `.env`, model weights, DB files, venvs, IDE config, and other common noise.
- `.env.example` — shows required env variables without secrets.
- `README.md` — documents how to set up env vars and run the app; lists required env keys and notes about MySQL and Groq.

If you want, I can now add a `requirements.txt` and a short PowerShell script to create the venv and install packages. Which of those should I do next?