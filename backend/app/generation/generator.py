import requests


OLLAMA_URL = "http://localhost:11434/api/generate"


def generate_resume_bullets(job_description, retrieved_chunks):

    context = "\n".join(retrieved_chunks)

    prompt = f"""
You are an AI career assistant.

Use ONLY the experience provided below.
Do not invent new skills.

Candidate Experience:
{context}

Job Description:
{job_description}

Write 4 resume bullet points tailored for this job.
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        }
    )

    return response.json()["response"]