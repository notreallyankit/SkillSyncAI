from app.ingestion.loader import load_document
from app.ingestion.chunker import chunk_text
from app.embedding.embedder import embed_chunks
from app.storage.faiss_store import store_embeddings

def run_ingestion(file_path):

    # Step 1 — load document
    text = load_document(file_path)

    # Step 2 — chunk document
    chunks = chunk_text(text)

    print(f"\nChunks created: {len(chunks)}")

    # Step 3 — embed chunks
    vectors = embed_chunks(chunks)

    print(f"Embedding shape: {vectors.shape}")

    # Step 4 — store in FAISS
    stored = store_embeddings(vectors, chunks)

    print(f"Stored {stored} chunks in FAISS")

    return stored