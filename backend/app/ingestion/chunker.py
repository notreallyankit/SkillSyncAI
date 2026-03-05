from llama_index.core.node_parser import SentenceSplitter

splitter = SentenceSplitter(
    chunk_size=400,
    chunk_overlap=50
)

def split_by_bullets(text):
    
    bullets = ["•", "-", "◦"]

    chunks = []
    lines = text.split("\n")

    current = ""

    for line in lines:

        if any(line.strip().startswith(b) for b in bullets):
            
            if current:
                chunks.append(current.strip())
            
            current = line

        else:
            current += " " + line

    if current:
        chunks.append(current.strip())

    return chunks


def chunk_text(text):

    bullet_chunks = split_by_bullets(text)

    final_chunks = []

    for chunk in bullet_chunks:

        if len(chunk) > 500:
            # fallback to token splitting
            final_chunks.extend(splitter.split_text(chunk))
        else:
            final_chunks.append(chunk)

    return final_chunks