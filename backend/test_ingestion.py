from app.ingestion.loader import load_document
from app.ingestion.chunker import chunk_text

# change filename if needed
file_path = "backend/data/raw_docs/Ankit_Tojo_220953486_CCE.pdf"

text = load_document(file_path)

print("\nDOCUMENT LOADED\n")
print(text[:500])  # show first 500 characters

chunks = chunk_text(text)

print("\nNUMBER OF CHUNKS:", len(chunks))

print("\nFIRST CHUNK:\n")
print(chunks[0])