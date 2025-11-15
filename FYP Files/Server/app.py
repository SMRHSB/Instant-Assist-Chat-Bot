import os
from flask import Flask, request, jsonify
from langchain.chat_models import init_chat_model
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from typing import List, TypedDict
from dotenv import load_dotenv
from flask_cors import CORS
import mysql.connector
import bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from datetime import timedelta
import re


# === Flask App Initialization ===
app = Flask(__name__)
CORS(app)

import jwt
from functools import wraps
from flask import request, jsonify
from datetime import datetime
from dotenv import load_dotenv
from mysql.connector import Error
import os
from flask import Flask, request, jsonify
load_dotenv()
SECRET_KEY = os.getenv("JWT_SECRET_KEY")


def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST", "localhost"),
            user=os.getenv("MYSQL_USER", "root"),
            password=os.getenv("MYSQL_PASSWORD", "1234"),
            database=os.getenv("MYSQL_DATABASE", "Bot")
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"❌ Database connection error: {e}")
        return None

def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')

        if not token:
            return jsonify({'error': 'Token missing'}), 401

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']

            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT * FROM sessions WHERE user_id = %s AND jwt_token = %s", (user_id, token))
            session = cursor.fetchone()

            if not session:
                return jsonify({'error': 'Invalid or expired session'}), 403

            request.user = payload  # Attach decoded token
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return wrapper



@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        return jsonify({"error": "Email already exists"}), 409

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, hashed_pw))
    db.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/api/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        payload = {
            'user_id': user['user_id'],
            'email': user['email'],
            'exp': datetime.utcnow() + timedelta(hours=12)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        cursor.execute("INSERT INTO sessions (user_id, jwt_token) VALUES (%s, %s)", (user['user_id'], token))
        db.commit()

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'name': user['name'],
                'email': user['email'],
                'user_id': user['user_id']
            }
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
    
@app.route('/api/logout', methods=['POST'])
@token_required
def logout():
    token = request.headers.get('Authorization').replace('Bearer ', '')
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("DELETE FROM sessions WHERE jwt_token = %s", (token,))
    db.commit()
    return jsonify({'message': 'Logged out successfully'})

@app.route('/api/validate-session', methods=['GET'])
@token_required
def validate_session():
    user = request.user  # already attached by the token_required decorator
    return jsonify({'valid': True, 'user_id': user['user_id']}), 200






# === Environment Setup ===
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not groq_api_key:
    raise ValueError("❌ GROQ_API_KEY not found in .env")
os.environ["GROQ_API_KEY"] = groq_api_key

# === Flask Initialization ===
# app = Flask(__name__)
# CORS(app)

# === Model & Embeddings ===
llm = init_chat_model("llama3-70b-8192", model_provider="groq")
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

# === Categories ===
categories = [
    "laptops", "gaming_consoles", "cameras", "mobiles",
    "televisions", "tablets", "wearables", "headphones_and_speakers"
]

# === Prompt Template with category check ===
# prompt_template = ChatPromptTemplate.from_template(
#     """
# You are a helpful and knowledgeable product assistant focused on the '{category}' category.

# Format your answer in the following style:


# - For each product:
#   - Write the **product name in bold**.
#   - Below that, give 4–5 **bullet points** for the key features.
#   - Leave a **blank line** after each product for clean separation.

# - End with a **short friendly line**.

# **Important:** Use proper spacing, bullets (•), and line breaks for readability. Avoid huge paragraphs.

# Only answer if the user's question is relevant to this category.
# If not, reply: "Sorry, this question is outside the scope of {category} products."

# Here is the previous conversation:

# {chat_log}

# And here are documents to help you:

# {context}

# Assistant:
# """
# )

# === Prompt Template with category check ===
prompt_template = ChatPromptTemplate.from_template(
    """
You are a helpful and knowledgeable product assistant focused on the '{category}' category.

**IMPORTANT INSTRUCTIONS:**
- Use ONLY the provided context and chat history to answer.
- If the information is missing or incomplete, reply politely with "I don't know based on the provided information."
- DO NOT guess, invent, or hallucinate details beyond the given documents.

Format your answer in the following style:

- For each product:
  - Write the **product name in bold**.
  - Below that, give 4–5 **bullet points** for the key features.
  - Leave a **blank line** after each product for clean separation.

- End with a **short friendly line**.

**Important:** Use proper spacing, bullets (•), and line breaks for readability. Avoid huge paragraphs.

Here is the previous conversation:

{chat_log}

And here are documents to help you:

{context}

Assistant:
"""
)

# === Conversation Cache ===
conversation_cache: dict[str, List[dict]] = {}

# === Token Estimation ===
def estimate_tokens(text: str) -> int:
    return int(len(text.split()) * 1.3)

# # === FAISS Retrieval with Score Filtering ===
# def retrieve(state: dict) -> dict:
#     category = state["category"]
#     query = state["question"]

#     index_path = f"C:/Users/rohai/OneDrive/Desktop/faiss_indexes/{category}"
#     vector_store = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)

#     faiss_docs_with_scores = vector_store.similarity_search_with_score(query, k=10)

#     # Filter by similarity threshold
#     relevant_docs = [doc for doc, score in faiss_docs_with_scores if score < 0.8]
#     if not relevant_docs:
#         return {"context": []}

#     # Deduplicate + limit by token count
#     seen, total_tokens, limited_docs = set(), 0, []
#     for doc in relevant_docs:
#         text = doc.page_content
#         if text in seen:
#             continue
#         tokens = estimate_tokens(text)
#         if total_tokens + tokens > 4000:
#             break
#         limited_docs.append(doc)
#         seen.add(text)
#         total_tokens += tokens

#     return {"context": limited_docs}

# === FAISS Retrieval with Score Filtering (strict) ===
def retrieve(state: dict) -> dict:
    category = state["category"]
    query = state["question"]

    index_path = f"C:/Users/rohai/OneDrive/Desktop/faiss_indexes/{category}"
    vector_store = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)

    faiss_docs_with_scores = vector_store.similarity_search_with_score(query, k=15)

    # Stricter similarity threshold
    relevant_docs = [doc for doc, score in faiss_docs_with_scores if score < 0.5]
    if not relevant_docs:
        return {"context": []}

    # Deduplicate + limit by token count
    seen, total_tokens, limited_docs = set(), 0, []
    for doc in relevant_docs:
        text = doc.page_content
        if text in seen:
            continue
        tokens = estimate_tokens(text)
        if total_tokens + tokens > 4000:
            break
        limited_docs.append(doc)
        seen.add(text)
        total_tokens += tokens

    return {"context": limited_docs}


# === Helper to update conversation cache ===
MAX_HISTORY = 12
def update_conversation(conversation_id: str, role: str, content: str):
    conversation_cache.setdefault(conversation_id, []).append({"role": role, "content": content})
    if len(conversation_cache[conversation_id]) > MAX_HISTORY:
        conversation_cache[conversation_id] = conversation_cache[conversation_id][-MAX_HISTORY:]


def generate(state: dict, conversation_id: str = None) -> dict:
    if not conversation_id:
        conversation_id = "default"

    # Save the user's message before generating the response
    update_conversation(conversation_id, "user", state["question"])

    # Reconstruct full chat log
    chat_log = ""
    if conversation_id in conversation_cache:
        for entry in conversation_cache[conversation_id][-12:]:
            role = entry["role"].capitalize()
            chat_log += f"{role}: {entry['content']}\n"

    # Gather relevant documents and prior assistant replies
    doc_chunks = [doc.page_content for doc in state["context"]]
    if conversation_id in conversation_cache:
        doc_chunks += [
            entry["content"]
            for entry in conversation_cache[conversation_id]
            if entry["role"] == "assistant"
        ][-2:]

    docs_text = "\n".join(doc_chunks)

    # Use ChatPromptTemplate
    prompt_input = prompt_template.invoke({
        "category": state["category"],
        "chat_log": chat_log.strip(),
        "context": docs_text.strip()
    })

    response = llm.invoke(prompt_input)
    response_text = response.content.strip()

    # Save assistant reply
    update_conversation(conversation_id, "assistant", response_text)

    return {"answer": response_text}

# === JWT Token Decorator ===

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    category = data.get("category")
    question = data.get("question")
    conversation_id = data.get("conversation_id", "default")  # <- get conversation_id from frontend

    if not category or not question:
        return jsonify({'error': 'Missing category or question'}), 400
    if category not in categories:
        return jsonify({"error": f"Invalid category '{category}'"}), 400

    retrieved = retrieve({
        "category": category,
        "question": question,
        "context": [],
        "answer": ""
    })

    state = {
        "category": category,
        "question": question,
        "context": retrieved["context"],
        "answer": ""
    }

    answer_state = generate(state, conversation_id)  # <- pass conversation_id here

    return jsonify({
        "question": question,
        "answer": answer_state["answer"],
        "category": category
    })

# === Run App ===
if __name__ == "__main__":
    app.run(debug=True)
