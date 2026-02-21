import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function downloadPDF() {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("action", activeTab);

    try {
      const res = await axios.post(
        "http://localhost:8000/project-review/pdf",
        form,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "ai_project_report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen flex relative bg-gradient-to-br from-[#020617] via-[#0b1224] to-[#020617] text-slate-200 overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-blue-600/10 blur-[200px] rounded-full pointer-events-none"></div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10">

        <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-2xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-10 py-6 flex justify-between items-center">

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Full Project Intelligence
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Review • Explanation • Interview Insights
              </p>
            </div>

            <div className="text-sm font-medium">
              {loading ? (
                <div className="flex items-center gap-2 text-blue-400">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                  Analyzing Code
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40"></div>
                  Ready to Analyze
                </div>
              )}
            </div>

          </div>
        </header>

        <main className="max-w-7xl mx-auto px-10 py-16 space-y-16 w-full">

          <section className="relative bg-slate-900/70 border border-white/5 rounded-3xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.4)] backdrop-blur-xl transition hover:border-blue-500/40 hover:shadow-[0_0_60px_rgba(59,130,246,0.25)]">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>

            <div className="relative flex gap-8 items-center">

              <input
                type="file"
                accept=".zip"
                onChange={(e) => setFile(e.target.files[0])}
                className="flex-1 text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-800 file:text-white hover:file:bg-slate-700 transition"
              />

              <button
                onClick={runAgent}
                disabled={!file || loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-40"
              >
                Run AI Analysis
              </button>
            </div>
          </section>

          <Tabs active={activeTab} setActive={setActiveTab} />

          {result && (
            <div className="relative min-h-[200px] space-y-16">

              {activeTab === "INTERVIEW" && result.interview_questions && (
                <ResultCard
                  title="Interview Questions"
                  subtitle="Structured technical Q&A"
                  onDownload={downloadPDF}
                >
                  <InterviewRenderer text={result.interview_questions} />
                </ResultCard>
              )}

              {activeTab === "PROJECT_REVIEW" && result.review_report && (
                <ResultCard
                  title="Project Review"
                  subtitle="Architecture and quality analysis"
                  onDownload={downloadPDF}
                >
                  <ReadableBlock>
                    {result.review_report}
                  </ReadableBlock>
                </ResultCard>
              )}

              {activeTab === "PROJECT_EXPLAIN" && result.project_explanation && (
                <ResultCard
                  title="Architecture Explanation"
                  subtitle="System design breakdown"
                  onDownload={downloadPDF}
                >
                  <ReadableBlock>
                    {result.project_explanation}
                  </ReadableBlock>
                </ResultCard>
              )}

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 bg-black/50 backdrop-blur-2xl border-r border-white/5 p-10 hidden md:block relative">

      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>

      <h2 className="text-lg font-semibold mb-12 tracking-tight relative z-10">
        AI Reviewer
      </h2>

      <nav className="space-y-4 text-sm relative z-10">

        <NavItem
          active={location.pathname === "/"}
          onClick={() => navigate("/")}
        >
          Home
        </NavItem>

        <NavItem
          active={location.pathname === "/project"}
          onClick={() => navigate("/project")}
        >
          Project Intelligence
        </NavItem>

        <NavItem
          active={location.pathname === "/single"}
          onClick={() => navigate("/single")}
        >
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
      className={`px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
        ${active
          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
    >
      {children}
    </div>
  );
}

function Tabs({ active, setActive }) {
  const tabs = [
    { id: "PROJECT_REVIEW", label: "Project Review" },
    { id: "PROJECT_EXPLAIN", label: "Architecture" },
    { id: "INTERVIEW", label: "Interview Q&A" },
  ];

  return (
    <div className="flex gap-8 border-b border-white/5 pb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className={`relative pb-2 text-sm font-medium transition
            ${active === tab.id
              ? "text-blue-400"
              : "text-slate-400 hover:text-white"}`}
        >
          {tab.label}
          {active === tab.id && (
            <div className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-500 rounded-full shadow-blue-500/50 shadow-md"></div>
          )}
        </button>
      ))}
    </div>
  );
}

function ResultCard({ title, subtitle, children, onDownload }) {
  return (
    <section className="relative bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-3xl p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] transition hover:border-blue-500/30 hover:shadow-[0_0_60px_rgba(59,130,246,0.15)]">
      <div className="flex justify-between mb-8 items-start">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <button
          onClick={onDownload}
          className="bg-slate-800 hover:bg-slate-700 px-5 py-2 rounded-lg text-sm transition border border-white/5 hover:border-white/10"
        >
          Download PDF
        </button>
      </div>

      {children}
    </section>
  );
}

function InterviewRenderer({ text }) {
  if (!text) return null;

  const cleaned = text.replace(/^\s*\d+\.\s*/gm, "").trim();

  const blocks = cleaned
    .split(/Question:/g)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  return (
    <div className="space-y-10">
      {blocks.map((block, index) => {
        const parts = block.split(/ANSWER:/g);
        const question = parts[0]?.trim() || "";
        const answer = parts[1]?.trim() || "";

        return (
          <div
            key={index}
            className="bg-slate-950 border border-white/5 rounded-2xl p-8 shadow-inner transition hover:border-blue-500/20"
          >
            <p className="text-blue-400 font-semibold mb-4">
              Q{index + 1}. {question}
            </p>

            <p className="text-slate-300 leading-relaxed text-sm">
              {answer}
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
