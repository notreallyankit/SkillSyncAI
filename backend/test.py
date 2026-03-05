import faiss
import json
from pathlib import Path

from app.ingestion.pipeline import run_ingestion
from app.utils.config import RAW_DOCS_DIR, INDEX_DIR
from app.embedding.embedder import embed_query

INDEX_PATH = INDEX_DIR / "faiss.index"
METADATA_PATH = INDEX_DIR / "metadata.json"


print("\n===== SKILLSYNC PIPELINE TEST =====\n")


# -------------------------
# STEP 1 — INGEST DOCUMENT
# -------------------------

file_path = RAW_DOCS_DIR / "Ankit_Tojo_220953486_CCE.pdf"

print("Running ingestion pipeline...\n")

stored_chunks = run_ingestion(str(file_path))

print("\nChunks indexed:", stored_chunks)


# -------------------------
# STEP 2 — LOAD FAISS INDEX
# -------------------------

print("\nLoading FAISS index...\n")

index = faiss.read_index(str(INDEX_PATH))

print("Total vectors in index:", index.ntotal)


# -------------------------
# STEP 3 — LOAD METADATA
# -------------------------

with open(METADATA_PATH, "r") as f:
    metadata = json.load(f)

print("Metadata entries:", len(metadata))


# -------------------------
# STEP 4 — TEST QUERY
# -------------------------

query = """
Looking for experience in Python automation and robotframework with internship experience
"""

print("\nQuery:")
print(query)


query_vector = embed_query(query)

distances, indices = index.search(query_vector, 5)


# -------------------------
# STEP 5 — PRINT RESULTS
# -------------------------

print("\nTop Matches:\n")

for i in indices[0]:

    if i < len(metadata):
        print("-", metadata[i]["text"])


print("\n===== TEST COMPLETE =====\n")