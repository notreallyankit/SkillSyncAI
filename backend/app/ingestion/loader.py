import fitz
import docx

def load_pdf(path):
    doc = fitz.open(path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def load_docx(path):
    doc = docx.Document(path)
    return "\n".join([p.text for p in doc.paragraphs])

def load_txt(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def load_document(path):
    if path.endswith(".pdf"):
        return load_pdf(path)
    elif path.endswith(".docx"):
        return load_docx(path)
    elif path.endswith(".txt"):
        return load_txt(path)
    else:
        raise ValueError("Unsupported file type")