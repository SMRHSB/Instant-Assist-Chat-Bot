# FAISS Indexes
# FAISS Indexes

Overview
--------
This folder is intended to hold prebuilt FAISS binary indexes for each product category. FAISS indexes provide efficient vector similarity search used by the backend retrieval pipeline.

Folder layout and manifest
--------------------------
Each category lives in its own directory, e.g.:

- `faiss_indexes/cameras/index.faiss`
- `faiss_indexes/laptops/index.faiss`

Suggested `manifest.json` (repo-level helper)

```json
{
  "categories": ["cameras","gaming_consoles","headphones_and_speakers","laptops","mobiles","tablets","televisions","wearables"]
}
```

Rebuilding indexes (recommended workflow)
----------------------------------------
1. Prepare a corpus of documents for a category. Split long product pages into paragraph chunks of ~200-500 words.
2. Use `sentence-transformers/all-mpnet-base-v2` (or a fine-tuned variant) to compute 768-dimensional embeddings.
3. Build a FAISS index and save it as `index.faiss` inside the category folder.

Minimal Python example

```python
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
docs = ["product description 1", "product description 2"]
embs = model.encode(docs, convert_to_numpy=True)

d = embs.shape[1]
index = faiss.IndexFlatL2(d)
index.add(np.array(embs, dtype='float32'))
faiss.write_index(index, 'index.faiss')
```

Performance & storage guidance
-----------------------------
- Use `faiss.IndexFlatIP` for cosine/inner-product search with normalized vectors, or `IndexIVFFlat` for larger corpora with an indexing step.
- Keep an eye on index size — large corpora will produce large files. Use sharding or quantization when necessary.

Distribution and versioning of indexes
-------------------------------------
- Do not commit binary indexes into the main git history (they are ignored by `.gitignore`).
- Recommended approaches to share or deploy indexes:
  - Upload to S3/GCS and download during deployment.
  - Store in GitHub Releases as artifacts.
  - Use Git LFS if you must track them in git (configure `.gitattributes`).

Automation idea (helper script)
------------------------------
- Add a `scripts/` folder with `build_index.py` and `upload_indexes.ps1` to standardize index building and publish to cloud storage.

embs = model.encode(docs, convert_to_numpy=True)

d = embs.shape[1]
index = faiss.IndexFlatL2(d)
index.add(np.array(embs, dtype='float32'))
faiss.write_index(index, 'index.faiss')
```

When rebuilding, ensure you create a directory per category and write the `index.faiss` file there.
