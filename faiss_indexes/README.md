# FAISS Indexes

Overview
--------
This folder contains prebuilt FAISS index files used by the backend for fast similarity search over product documentation.

Structure
---------
Each subfolder corresponds to a product category and contains a binary FAISS index (for example `index.faiss`). Example categories present in this repo include:

- `cameras`
# FAISS Indexes

Overview
--------
This folder contains prebuilt FAISS index files used by the backend for fast similarity search over product documentation.

Structure
---------
Each subfolder corresponds to a product category and contains a binary FAISS index (for example `index.faiss`). Example categories present in this repo include:

- `cameras`
- `gaming_consoles`
- `headphones_and_speakers`
- `laptops`
- `mobiles`
- `tablets`
- `televisions`
- `wearables`

Notes
-----
- These index files are binary artifacts and are large; they are excluded from version control by the root `.gitignore`.
- If you need to rebuild the indexes, the standard flow is:

  1. Prepare your document corpus (one document per product or paragraph chunk).
  2. Use a Sentence-Transformers model (for example `all-mpnet-base-v2`) to compute embeddings.
  3. Build a FAISS index from those embeddings and persist it to the category folder.

Example (very small) Python sketch to build an index

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

When rebuilding, ensure you create a directory per category and write the `index.faiss` file there.
