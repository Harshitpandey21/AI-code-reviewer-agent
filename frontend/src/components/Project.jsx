import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

/* =========================
   MAIN PAGE
========================= */

export default function ProjectAgent() {
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState("PROJECT_REVIEW");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runAgent() {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const form = new FormData();
    form.append("file", file);
    form.append("action", activeTab);

    try {
      const res = await axios.post(
        "http://localhost:8000/project-review",
        form
      );
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function downloadPDF() {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("action", activeTab);

    const res = await axios.post(
      "http://localhost:8000/project-review/pdf",
      form,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );

    const a = document.createElement("a");
    a.href = url;
    a.download = "ai_project_report.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-200">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <header className="sticky top-0 z-50 bg-black/60 backdrop-blur border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold">AI Project Intelligence</h1>
              <p className="text-xs text-slate-400">
                Review • Architecture • Interview Insights
              </p>
            </div>

            <div className="text-sm">
              {loading ? (
                <span className="text-blue-400 animate-pulse">● Analyzing…</span>
              ) : (
                <span className="text-emerald-400">● Idle</span>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-10 space-y-10 w-full">

          {/* UPLOAD */}
          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex gap-6 items-center">
              <input
                type="file"
                accept=".zip"
                onChange={(e) => setFile(e.target.files[0])}
                className="flex-1 text-sm text-slate-300 file:bg-slate-800 file:text-white"
              />
              <button
                onClick={runAgent}
                disabled={!file || loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 rounded-xl shadow-lg"
              >
                Run AI Analysis
              </button>
            </div>
          </section>

          <Tabs active={activeTab} setActive={setActiveTab} />

          {result && (
            <div className="space-y-10">

              {activeTab === "INTERVIEW" && result.interview_questions && (
                <ResultCard
                  title="Interview Questions"
                  subtitle="Clean structured Q&A"
                  onDownload={downloadPDF}
                >
                  <InterviewRenderer text={result.interview_questions} />
                </ResultCard>
              )}

              {activeTab === "PROJECT_REVIEW" && result.review_report && (
                <ResultCard title="Project Review" onDownload={downloadPDF}>
                  <ReadableBlock>{result.review_report}</ReadableBlock>
                </ResultCard>
              )}

              {activeTab === "PROJECT_EXPLAIN" && result.project_explanation && (
                <ResultCard title="Architecture Explanation" onDownload={downloadPDF}>
                  <ReadableBlock>{result.project_explanation}</ReadableBlock>
                </ResultCard>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* =========================
   SIDEBAR
========================= */

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 bg-black/40 border-r border-slate-800 p-6 hidden md:block">
      <h2 className="text-lg font-semibold mb-8">AI Studio</h2>

      <nav className="space-y-4 text-sm">
        <NavItem active={location.pathname === "/project"} onClick={() => navigate("/project")}>
          Project Intelligence
        </NavItem>
        <NavItem active={location.pathname === "/single"} onClick={() => navigate("/single")}>
          Single File Review
        </NavItem>
      </nav>
    </aside>
  );
}

function NavItem({ children, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`px-3 py-2 rounded-md cursor-pointer
        ${active ? "bg-blue-600/20 text-blue-400" : "hover:bg-slate-800"}`}
    >
      {children}
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function Tabs({ active, setActive }) {
  const tabs = [
    { id: "PROJECT_REVIEW", label: "Project Review" },
    { id: "PROJECT_EXPLAIN", label: "Architecture" },
    { id: "INTERVIEW", label: "Interview Q&A" },
  ];

  return (
    <div className="flex gap-3 border-b border-slate-800">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className={`px-4 py-2 border-b-2
            ${active === tab.id
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function ResultCard({ title, subtitle, children, onDownload }) {
  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
        <button onClick={onDownload} className="bg-slate-800 px-4 py-2 rounded">
          Download PDF
        </button>
      </div>
      {children}
    </section>
  );
}

/* =========================
   INTERVIEW FORMAT FIX
========================= */

function InterviewRenderer({ text }) {
  // Normalize: remove leading numbering like "1. "
  const cleaned = text.replace(/^\s*\d+\.\s*/g, "");

  const blocks = cleaned
    .split("Question:")
    .map(b => b.trim())
    .filter(b => b.length > 0);

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        const [question, ...rest] = block.split("ANSWER:");
        const answer = rest.join("ANSWER:");

        return (
          <div
            key={i}
            className="bg-slate-950 border border-slate-800 rounded-xl p-5"
          >
            <p className="text-blue-400 font-semibold mb-2">
              Q{i + 1}. {question.trim()}
            </p>

            <p className="text-slate-300 leading-relaxed">
              {answer?.trim()}
            </p>
          </div>
        );
      })}
    </div>
  );
}


function ReadableBlock({ children }) {
  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-300">
      {children}
    </div>
  );
}
