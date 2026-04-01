from fastapi import FastAPI, UploadFile, File
import shutil
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from app.ingestion.pipeline import run_ingestion
from app.retrieval.retriever import retrieve_similar_chunks
from app.generation.generator import generate_resume_bullets
from app.utils.config import RAW_DOCS_DIR

app = FastAPI()

class JobRequest(BaseModel):
    job_description: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "SkillSync backend running"}


@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    file_path = RAW_DOCS_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    chunks = run_ingestion(str(file_path))

    return {
        "status": "resume indexed",
        "chunks_created": chunks
    }


@app.post("/generate")
async def generate(req: JobRequest):

    chunks = retrieve_similar_chunks(req.job_description, top_k=5)

    output = generate_resume_bullets(req.job_description, chunks)

    return {
        "retrieved_chunks": chunks,
        "generated_output": output
    }