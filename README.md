# SkillSync 🚀

An AI-powered resume optimization tool that generates tailored resume bullets for job descriptions using semantic search and LLM-based generation.

## Features ✨

- **Resume Upload & Indexing**: Upload PDF or DOCX resumes which are automatically processed and indexed
- **Semantic Chunking**: Intelligent document splitting for better context preservation
- **Vector Embeddings**: Uses advanced embedding models to create semantic representations
- **FAISS Vector Database**: Fast similarity search across resume content
- **Intelligent Retrieval**: Retrieves the most relevant resume sections based on job descriptions
- **AI-Generated Bullets**: Groq LLM generates optimized, action-verb-based resume bullets
- **Job Description Matching**: Aligns resume content with specific job keywords
- **CORS Support**: Ready for cross-origin frontend integration
- **Interactive API Docs**: Swagger UI for easy API testing

## Tech Stack 🛠️

### Backend
- **Framework**: FastAPI
- **Vector DB**: FAISS (CPU)
- **Embeddings**: LLamaIndex with OpenAI embeddings
- **LLM**: Groq (llama3-70b-8192)
- **Document Processing**: PyMuPDF, Python-DOCX
- **Environment**: Python 3.x with virtual environment

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: Custom CSS (inline)

## Prerequisites 📋

- Python 3.8+
- Node.js 16+ & npm
- Groq API Key (free tier available at [console.groq.com](https://console.groq.com))
- OpenAI API Key (for embeddings)

## Setup Instructions 🔧

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/skillsync.git
cd skillsync
```

### 2. Backend Setup

#### Step 2.1: Create Python Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On Linux/Mac
source venv/bin/activate
```

#### Step 2.2: Install Dependencies

```bash
pip install -r requirements.txt
```

#### Step 2.3: Set Up Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cat > .env << EOF
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
EOF
```

**Where to get API Keys:**
- **Groq API Key**: Visit [console.groq.com](https://console.groq.com) → Create account → Go to API keys
- **OpenAI API Key**: Visit [platform.openai.com](https://platform.openai.com/api-keys) → Create new secret key

#### Step 2.4: Add `.env` to `.gitignore`

```bash
echo .env >> .gitignore
```

#### Step 2.5: Start Backend Server

```bash
# From backend/ directory (with venv activated)
uvicorn app.main:app --reload
```

The server will start on `http://localhost:8000`

**API Documentation**: Visit `http://localhost:8000/docs` for interactive Swagger UI

---

### 3. Frontend Setup

#### Step 3.1: Install Dependencies

```bash
cd frontend
npm install
```

#### Step 3.2: Configure Backend URL (Optional)

If your backend is running on a different host/port, update the axios base URL in `src/App.jsx`

#### Step 3.3: Start Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or the next available port)

---

## Running the Application 🎯

### Full Workflow

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   uvicorn app.main:app --reload
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open in Browser**:
   ```
   http://localhost:5173
   ```

4. **Use the App**:
   - Upload your resume (PDF or DOCX)
   - Paste a job description
   - Click "Generate Resume Bullets"
   - Copy optimized bullets to your actual resume

---

## API Endpoints 📡

### 1. Health Check
```
GET /
```
Response:
```json
{"message": "SkillSync backend running"}
```

### 2. Upload Resume
```
POST /upload
Content-Type: multipart/form-data

Form Data:
- file: <resume.pdf or resume.docx>
```
Response:
```json
{
  "status": "resume indexed",
  "chunks_created": 15
}
```

### 3. Generate Resume Bullets
```
POST /generate
Content-Type: application/json

Body:
{
  "job_description": "Senior Software Engineer with Python and FastAPI experience..."
}
```
Response:
```json
{
  "retrieved_chunks": ["chunk1", "chunk2", ...],
  "generated_output": "- Optimized FastAPI services..."
}
```

---

## Project Structure 📁

```
skillsync/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application
│   │   ├── generation/
│   │   │   └── generator.py        # LLM-based bullet generation
│   │   ├── ingestion/
│   │   │   ├── loader.py           # Document loading
│   │   │   ├── chunker.py          # Text chunking
│   │   │   └── pipeline.py         # Ingestion workflow
│   │   ├── retrieval/
│   │   │   └── retriever.py        # Semantic search
│   │   ├── embedding/
│   │   │   └── embedder.py         # Vector embeddings
│   │   ├── storage/
│   │   │   └── faiss_store.py      # FAISS storage
│   │   └── utils/
│   │       └── config.py           # Configuration
│   ├── data/
│   │   ├── raw_docs/               # Uploaded resumes
│   │   └── index/                  # FAISS indices
│   ├── requirements.txt
│   ├── .env                        # Environment variables (not in git)
│   └── test.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main React component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Styles
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

---

## Development 👨‍💻

### Backend Development

- **Auto-reload**: Enabled with `--reload` flag
- **Testing**: Run `python test.py`
- **API Docs**: Available at `http://localhost:8000/docs`

### Frontend Development

- **Hot Reload**: Enabled by Vite
- **Build**: `npm run build`
- **Preview Build**: `npm run preview`
- **Linting**: `npm run lint`

---

## Environment Variables 🔐

### Backend `.env`

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxx
```

**Security Tips:**
- Never commit `.env` files
- Use `.env.example` for reference
- Rotate API keys regularly
- Use secrets management in production

---

## Troubleshooting 🐛

### Backend Issues

**Error: `GROQ_API_KEY` not found**
- Check `.env` file exists in `backend/` directory
- Ensure `python-dotenv` is installed: `pip install python-dotenv`
- Restart the server after adding `.env`

**Error: `ModuleNotFoundError`**
- Verify virtual environment is activated
- Run `pip install -r requirements.txt`

**Error: FAISS/embedding errors**
- Ensure OPENAI_API_KEY is valid
- Check internet connection for API calls

### Frontend Issues

**Error: Cannot connect to backend**
- Verify backend is running on `localhost:8000`
- Check CORS settings in `backend/app/main.py`
- Open browser console for detailed errors

**Empty response from `/generate`**
- Ensure resume was uploaded first
- Check browser DevTools Network tab
- Verify job description is provided

---

## Performance Tips ⚡

- Use PDF resumes (faster than DOCX)
- Keep resumes under 5 pages for optimal chunking
- First generation takes longer (embeddings initialization)
- Subsequent generations are faster due to caching

---

## Contributing 🤝

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support & Contact 💬

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: ankit@skillsync.dev

---

**Made with ❤️ by SkillSync Team**
