import { useState, useRef, useEffect } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0a0a0f;
    --paper: #f2ede6;
    --cream: #e8e0d4;
    --gold: #c9a84c;
    --gold-light: #e8c97a;
    --rust: #c4522a;
    --muted: #6b6560;
    --line: rgba(201,168,76,0.25);
    --glow: rgba(201,168,76,0.08);
  }

  body { background: var(--ink); }

  .ss-root {
    min-height: 100vh;
    background: var(--ink);
    color: var(--paper);
    font-family: 'Syne', sans-serif;
    position: relative;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* Background grid texture */
  .ss-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  /* Ambient glow */
  .ss-root::after {
    content: '';
    position: fixed;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 600px;
    background: radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .ss-container {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 60px 80px;
    width: 100%;
  }

  /* make header/status/footer span both columns */
  .ss-header,
  .ss-status-strip,
  .ss-footer {
    grid-column: 1 / -1;
  }

  .ss-left { }
  .ss-right { }

  @media (max-width: 900px) {
    .ss-container {
      grid-template-columns: 1fr;
      padding: 0 24px 60px;
    }
  }

  /* ── HEADER ── */
  .ss-header {
    padding: 60px 0 48px;
    border-bottom: 1px solid var(--line);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
  }

  .ss-logo-block {}

  .ss-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ss-eyebrow::before {
    content: '';
    display: inline-block;
    width: 28px;
    height: 1px;
    background: var(--gold);
  }

  .ss-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(52px, 8vw, 80px);
    font-weight: 700;
    line-height: 0.9;
    color: var(--paper);
    letter-spacing: -0.02em;
  }

  .ss-title em {
    font-style: italic;
    color: var(--gold);
  }

  .ss-tagline {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-align: right;
    line-height: 1.8;
    max-width: 180px;
  }

  /* ── STATUS STRIP ── */
  .ss-status-strip {
    display: flex;
    align-items: center;
    gap: 32px;
    padding: 16px 0;
    border-bottom: 1px solid var(--line);
    margin-bottom: 56px;
  }

  .ss-step-pill {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    transition: color 0.3s;
  }

  .ss-step-pill.active { color: var(--gold); }
  .ss-step-pill.done { color: var(--paper); }

  .ss-step-num {
    width: 20px;
    height: 20px;
    border: 1px solid currentColor;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    flex-shrink: 0;
  }

  .ss-step-pill.done .ss-step-num {
    background: var(--gold);
    border-color: var(--gold);
    color: var(--ink);
  }

  .ss-step-divider {
    flex: 1;
    height: 1px;
    background: var(--line);
  }

  /* ── SECTIONS ── */
  .ss-section {
    margin-bottom: 56px;
    animation: fadeUp 0.5s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ss-section-header {
    display: flex;
    align-items: baseline;
    gap: 16px;
    margin-bottom: 24px;
  }

  .ss-section-num {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--gold);
    opacity: 0.7;
  }

  .ss-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--cream);
  }

  .ss-section-line {
    flex: 1;
    height: 1px;
    background: var(--line);
  }

  /* ── UPLOAD ZONE ── */
  .ss-upload-zone {
    position: relative;
    border: 1px solid var(--line);
    background: rgba(201,168,76,0.03);
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    transition: border-color 0.3s, background 0.3s;
    cursor: pointer;
    overflow: hidden;
  }

  .ss-upload-zone:hover {
    border-color: rgba(201,168,76,0.5);
    background: rgba(201,168,76,0.06);
  }

  .ss-upload-zone::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--gold);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .ss-upload-zone:hover::before,
  .ss-upload-zone.has-file::before { opacity: 1; }
  .ss-upload-zone.has-file { border-color: rgba(201,168,76,0.4); }

  .ss-upload-zone.dragging {
    border-color: var(--gold);
    background: rgba(201,168,76,0.08);
  }

  .ss-upload-icon {
    width: 48px;
    height: 48px;
    border: 1px solid var(--line);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--gold);
    font-size: 20px;
  }

  .ss-upload-text { flex: 1; }

  .ss-upload-primary {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--paper);
    margin-bottom: 4px;
  }

  .ss-upload-secondary {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  .ss-file-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .ss-upload-btn {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    background: var(--gold);
    color: var(--ink);
    border: none;
    padding: 12px 24px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s, transform 0.15s;
    position: relative;
    z-index: 2;
    flex-shrink: 0;
  }

  .ss-upload-btn:hover { background: var(--gold-light); transform: translateY(-1px); }
  .ss-upload-btn:active { transform: translateY(0); }
  .ss-upload-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ── TEXTAREA ── */
  .ss-textarea-wrap {
    position: relative;
  }

  .ss-textarea {
    width: 100%;
    background: rgba(201,168,76,0.02);
    border: 1px solid var(--line);
    color: var(--paper);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    line-height: 1.8;
    padding: 24px;
    resize: vertical;
    min-height: 220px;
    outline: none;
    transition: border-color 0.3s, background 0.3s;
    letter-spacing: 0.02em;
  }

  .ss-textarea::placeholder {
    color: rgba(107,101,96,0.6);
    font-style: italic;
  }

  .ss-textarea:focus {
    border-color: rgba(201,168,76,0.5);
    background: rgba(201,168,76,0.04);
  }

  .ss-char-count {
    position: absolute;
    bottom: 12px;
    right: 16px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.1em;
    pointer-events: none;
  }

  /* ── GENERATE BUTTON ── */
  .ss-generate-wrap {
    margin-top: 28px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .ss-generate-btn {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    background: transparent;
    color: var(--paper);
    border: 1px solid var(--paper);
    padding: 16px 40px;
    cursor: pointer;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
  }

  .ss-generate-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: 0;
  }

  .ss-generate-btn:hover { color: var(--ink); border-color: var(--gold); }
  .ss-generate-btn:hover::before { transform: scaleX(1); }
  .ss-generate-btn span { position: relative; z-index: 1; }
  .ss-generate-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .ss-generate-btn:disabled::before { display: none; }
  .ss-generate-btn:disabled:hover { color: var(--paper); border-color: var(--paper); }

  /* ── LOADER ── */
  .ss-loader {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--gold);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .ss-loader-dots {
    display: flex;
    gap: 4px;
  }

  .ss-loader-dot {
    width: 4px;
    height: 4px;
    background: var(--gold);
    border-radius: 50%;
    animation: dotPulse 1.2s ease-in-out infinite;
  }

  .ss-loader-dot:nth-child(2) { animation-delay: 0.2s; }
  .ss-loader-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dotPulse {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
  }

  /* ── OUTPUT ── */
  .ss-output-panel {
    position: relative;
    background: rgba(242,237,230,0.04);
    border: 1px solid var(--line);
    border-left: 3px solid var(--gold);
    animation: fadeUp 0.5s ease both;
  }

  .ss-output-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--line);
  }

  .ss-output-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ss-output-label::before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--gold);
    border-radius: 50%;
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .ss-copy-btn {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--line);
    padding: 6px 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ss-copy-btn:hover { color: var(--paper); border-color: rgba(201,168,76,0.4); }

  .ss-output-body {
    padding: 28px 24px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    line-height: 1.9;
    color: var(--cream);
    white-space: pre-wrap;
    word-break: break-word;
    letter-spacing: 0.02em;
  }

  /* ── TOAST ── */
  .ss-toast {
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: var(--ink);
    border: 1px solid var(--gold);
    padding: 14px 24px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--gold);
    z-index: 100;
    animation: toastIn 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── FOOTER ── */
  .ss-footer {
    padding-top: 40px;
    border-top: 1px solid var(--line);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ss-footer-brand {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--muted);
  }

  .ss-footer-meta {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.1em;
    opacity: 0.6;
  }
`;

export default function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);
  const [retrieved, setRetrieved] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [drag, setDrag] = useState(false);
  const outputRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const uploadResume = async () => {
    if (!file || uploaded) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("http://localhost:8000/upload", formData);
      setUploaded(true);
      showToast("Resume uploaded and indexed.");
    } catch (err) {
      console.error(err);
      showToast("Upload failed. Please try again.");
    }
  };

  const generate = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/generate", {
        job_description: jobDescription,
      });
      setOutput(res.data.generated_output);
      setRetrieved(res.data.retrieved_chunks || []);

      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong while generating. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const step1Done = !!file;
  const step2Done = jobDescription.trim().length > 0;

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        generate();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [jobDescription]);

  return (
    <>
      <style>{styles}</style>
      <div className="ss-root">
        <div className="ss-container">

          {/* HEADER */}
          <header className="ss-header">
            <div className="ss-logo-block">
              <div className="ss-eyebrow">AI-Powered Resume Tool</div>
              <h1 className="ss-title">SkillSync<em>.ai</em></h1>
            </div>
            <p className="ss-tagline">
              Match your<br/>experience to any<br/>opportunity.
            </p>
          </header>

          {/* STATUS STRIP */}
          <div className="ss-status-strip">
            <div className={`ss-step-pill ${step1Done ? "done" : "active"}`}>
              <div className="ss-step-num">{step1Done ? "✓" : "1"}</div>
              Upload Resume
            </div>
            <div className="ss-step-divider" />
            <div className={`ss-step-pill ${step2Done ? "done" : step1Done ? "active" : ""}`}>
              <div className="ss-step-num">{step2Done ? "✓" : "2"}</div>
              Job Description
            </div>
            <div className="ss-step-divider" />
            <div className={`ss-step-pill ${output ? "done" : step2Done ? "active" : ""}`}>
              <div className="ss-step-num">{output ? "✓" : "3"}</div>
              Generated Output
            </div>
          </div>

          {/* SECTION 1 — UPLOAD */}
          <div className="ss-left">
          <div className="ss-section">
            <div className="ss-section-header">
              <span className="ss-section-num">01</span>
              <span className="ss-section-title">Upload Resume</span>
              <div className="ss-section-line" />
            </div>
            
            <div
              className={`ss-upload-zone ${file ? "has-file" : ""} ${drag ? "dragging" : ""}`}
              onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                const f = e.dataTransfer?.files?.[0];
                if (f) { setFile(f); setUploaded(false); }
              }}
            >
              <input
                type="file"
                className="ss-file-input"
                onChange={(e) => { setFile(e.target.files[0]); setUploaded(false); }}
              />
              <div className="ss-upload-icon">
                {file ? "✦" : "↑"}
              </div>
              <div className="ss-upload-text">
                <div className="ss-upload-primary">
                  {file ? file.name : "Choose a file or drag it here"}
                </div>
                <div className="ss-upload-secondary">
                  {file
                    ? `${(file.size / 1024).toFixed(1)} KB · Ready to upload`
                    : "PDF, DOCX accepted"}
                </div>
              </div>
              <button
                className="ss-upload-btn"
                onClick={(e) => { e.stopPropagation(); uploadResume(); }}
                disabled={!file || uploaded}
              >
                {uploaded ? "Indexed ✓" : "Upload →"}
              </button>
            </div>
          </div>

          {/* SECTION 2 — JOB DESCRIPTION */}
          <div className="ss-section">
            <div className="ss-section-header">
              <span className="ss-section-num">02</span>
              <span className="ss-section-title">Job Description</span>
              <div className="ss-section-line" />
            </div>
            <div className="ss-textarea-wrap">
              <textarea
                className="ss-textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here. Include required skills, responsibilities, and any keywords that matter..."
                rows={10}
              />
              <div className="ss-char-count">{jobDescription.length} chars</div>
            </div>
            <div className="ss-generate-wrap">
              <button
                className="ss-generate-btn"
                onClick={generate}
                disabled={loading || !jobDescription.trim()}
              >
                <span>{loading ? "Generating…" : "Generate Resume Bullets"}</span>
              </button>
              {loading && (
                <div className="ss-loader">
                  <div className="ss-loader-dots">
                    <div className="ss-loader-dot" />
                    <div className="ss-loader-dot" />
                    <div className="ss-loader-dot" />
                  </div>
                  Aligning experience...
                </div>
              )}
            </div>
          </div>
          </div>

          <div className="ss-right">

          {retrieved.length > 0 && (
            <div className="ss-section">
              <div className="ss-section-header">
                <span className="ss-section-num">02A</span>
                <span className="ss-section-title">Retrieved Experience</span>
                <div className="ss-section-line" />
              </div>

              <div className="ss-output-panel">
                <div className="ss-output-body">
                  {retrieved.map((r, i) => (
                    <div key={i} style={{ marginBottom: "14px" }}>
                      • {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3 — OUTPUT */}
          {output && (
            <div className="ss-section" ref={outputRef}>
              <div className="ss-section-header">
                <span className="ss-section-num">03</span>
                <span className="ss-section-title">Generated Output</span>
                <div className="ss-section-line" />
              </div>
              <div className="ss-output-panel">
                <div className="ss-output-header">
                  <div className="ss-output-label">Live Output</div>
                  <button className="ss-copy-btn" onClick={handleCopy}>
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </div>
                <div className="ss-output-body">
                  {output.split("\n").map((line, i) => (
                    <div key={i} style={{ marginBottom: "10px" }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          </div>

          {/* FOOTER */}
          <footer className="ss-footer">
            <div className="ss-footer-brand">SkillSyncAI</div>
            <div className="ss-footer-meta">AI Resume Tool · {new Date().getFullYear()}</div>
          </footer>
        </div>

        {/* TOAST */}
        {toast && (
          <div className="ss-toast">
            <span>✦</span> {toast}
          </div>
        )}
      </div>
    </>
  );
}
