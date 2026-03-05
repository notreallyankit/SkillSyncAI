import faiss
import json
import numpy as np
from pathlib import Path
from app.utils.config import INDEX_DIR

# BGE-small embedding dimension
DIMENSION = 384

# paths
INDEX_PATH = INDEX_DIR / "faiss.index"
METADATA_PATH = INDEX_DIR / "metadata.json"


def load_or_create_index():
    
    if INDEX_PATH.exists():
        index = faiss.read_index(str(INDEX_PATH))
    else:
        index = faiss.IndexFlatIP(DIMENSION)

    return index


def load_metadata():

    if not METADATA_PATH.exists():
        return []

    try:
        with open(METADATA_PATH, "r") as f:
            content = f.read().strip()
            if not content:
                return []
            return json.loads(content)
    except json.JSONDecodeError:
        return []


def save_index(index):
    faiss.write_index(index, str(INDEX_PATH))


def save_metadata(metadata):
    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)


def store_embeddings(vectors, chunks):

    index = load_or_create_index()
    metadata = load_metadata()

    # ensure numpy format
    vectors = np.array(vectors).astype("float32")

    index.add(vectors)

    for chunk in chunks:
        metadata.append({
            "text": chunk
        })

    save_index(index)
    save_metadata(metadata)

    return len(chunks)