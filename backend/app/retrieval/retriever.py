import faiss
import json

from app.utils.config import INDEX_DIR
from app.embedding.embedder import embed_query


INDEX_PATH = INDEX_DIR / "faiss.index"
METADATA_PATH = INDEX_DIR / "metadata.json"


def retrieve_similar_chunks(query, top_k=5):

    index = faiss.read_index(str(INDEX_PATH))

    with open(METADATA_PATH, "r") as f:
        metadata = json.load(f)

    query_vector = embed_query(query)

    distances, indices = index.search(query_vector, top_k)

    results = []

    for i in indices[0]:
        if i < len(metadata):
            results.append(metadata[i]["text"])

    return results