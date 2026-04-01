import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def generate_resume_bullets(job_description, retrieved_chunks):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    context = "\n".join(retrieved_chunks)

    prompt = f"""
You are an expert resume optimizer.

STRICT RULES:
- Use ONLY the candidate experience provided
- Do NOT invent tools, technologies, or achievements
- Each bullet must start with a strong action verb
- Each bullet must include measurable impact where possible
- Align wording with the job description keywords

Candidate Experience:
{context}

Job Description:
{job_description}

TASK:
Generate exactly 4 high-quality resume bullet points.

FORMAT:
- One line per bullet
- No explanations
- No numbering
- No extra text
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content