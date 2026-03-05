from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("BAAI/bge-small-en-v1.5")

def embed_chunks(chunks):
    embeddings = model.encode(
        chunks,
        normalize_embeddings=True
    )
    return np.array(embeddings).astype("float32")


def embed_query(query):
    query = "query: " + query
    embedding = model.encode(
        [query],
        normalize_embeddings=True
    )
    return np.array(embedding).astype("float32")