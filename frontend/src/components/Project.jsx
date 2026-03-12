import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function ProjectAgent() {
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState("PROJECT_REVIEW");

  const [results, setResults] = useState({
    PROJECT_REVIEW: null,
    PROJECT_EXPLAIN: null,
    INTERVIEW: null,
    DOCUMENTATION: null,
  });

  const [loading, setLoading] = useState(false);

  async function runAgent() {
    if (!file) return;

    setLoading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("action", activeTab);

    try {
      const res = await axios.post(
        "http://localhost:8000/project-review",
        form
      );

      setResults((prev) => ({
        ...prev,
        [activeTab]: res.data,
      }));
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

  const hasAnyResult =
    results.PROJECT_REVIEW ||
    results.PROJECT_EXPLAIN ||
    results.INTERVIEW ||
    results.DOCUMENTATION;

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#020617]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(99,102,241,0.10),transparent_22%),radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.08),transparent_20%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_18%,transparent_82%,rgba(255,255,255,0.015))]" />
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/40 backdrop-blur-2xl">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

          <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between gap-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.12)]">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                Repository-level AI analysis
              </div>

              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-4">
                Full Project Intelligence
              </h1>

              <p className="text-sm text-slate-400 mt-2">
                Review, explain, generate interview questions, and create documentation from a full project archive.
              </p>
            </div>

            <div className="text-sm font-medium shrink-0">
              {loading ? (
                <div className="flex items-center gap-2 text-blue-400">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                  Analyzing Project
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40"></div>
                  Ready to Analyze
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-12 space-y-12 w-full">
          <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/45 p-8 md:p-10 backdrop-blur-2xl shadow-[0_0_40px_rgba(2,6,23,0.40)] transition duration-300 hover:border-blue-400/30 hover:shadow-[0_0_55px_rgba(59,130,246,0.14)]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_45%)]" />

            <div className="relative z-10">
              <div className="flex flex-col gap-3 mb-8">
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
                  Upload Project Archive
                </h2>
                <p className="text-sm text-slate-400">
                  Upload a ZIP file to generate architecture reviews, system explanations, interview Q&A, and production-ready README content.
                </p>
              </div>

              <div className="flex flex-col xl:flex-row gap-5 xl:items-center">
                <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                  <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-800 file:px-4 file:py-2.5 file:text-white hover:file:bg-slate-700 transition"
                  />
                  {file && (
                    <p className="mt-3 text-xs text-slate-400">
                      Selected archive:{" "}
                      <span className="text-slate-200 font-medium">
                        {file.name}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={runAgent}
                    disabled={!file || loading}
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-semibold shadow-[0_0_30px_rgba(59,130,246,0.28)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_0_45px_rgba(59,130,246,0.40)] disabled:opacity-40"
                  >
                    {loading ? "Running..." : "Run AI Analysis"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <Tabs active={activeTab} setActive={setActiveTab} />

          {hasAnyResult && (
            <div className="space-y-10">
              {activeTab === "PROJECT_REVIEW" &&
                results.PROJECT_REVIEW?.review_report && (
                  <ResultCard
                    title="Project Review"
                    subtitle="Architecture, code quality, and system-level observations"
                    onDownload={downloadPDF}
                    accent="blue"
                  >
                    <ReadableBlock>
                      {results.PROJECT_REVIEW.review_report}
                    </ReadableBlock>
                  </ResultCard>
                )}

              {activeTab === "PROJECT_EXPLAIN" &&
                results.PROJECT_EXPLAIN?.project_explanation && (
                  <ResultCard
                    title="Architecture Explanation"
                    subtitle="System design breakdown and implementation understanding"
                    onDownload={downloadPDF}
                    accent="purple"
                  >
                    <ReadableBlock>
                      {results.PROJECT_EXPLAIN.project_explanation}
                    </ReadableBlock>
                  </ResultCard>
                )}

              {activeTab === "INTERVIEW" &&
                results.INTERVIEW?.interview_questions && (
                  <ResultCard
                    title="Interview Questions"
                    subtitle="Structured technical Q&A derived from the actual project"
                    onDownload={downloadPDF}
                    accent="emerald"
                  >
                    <InterviewRenderer
                      text={results.INTERVIEW.interview_questions}
                    />
                  </ResultCard>
                )}

              {activeTab === "DOCUMENTATION" &&
                results.DOCUMENTATION?.documentation && (
                  <ResultCard
                    title="Project Documentation"
                    subtitle="AI-generated README content ready for refinement or direct use"
                    onDownload={downloadPDF}
                    accent="blue"
                  >
                    <pre className="rounded-2xl border border-white/10 bg-[#020617]/90 p-6 overflow-x-auto text-sm font-mono text-slate-200 shadow-inner whitespace-pre-wrap">
                      {results.DOCUMENTATION.documentation}
                    </pre>
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
    <aside className="hidden md:flex w-72 border-r border-white/10 bg-slate-950/35 backdrop-blur-2xl relative z-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(59,130,246,0.06),transparent_25%,transparent)] pointer-events-none" />

      <div className="relative z-10 flex w-full flex-col p-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_30px_rgba(59,130,246,0.30)]">
            <span className="text-xl">🧠</span>
          </div>

          <div>
            <div className="text-xl font-bold tracking-tight text-white">
              AI Code Reviewer
            </div>
            <div className="text-[11px] text-slate-400 tracking-[0.18em] uppercase">
              Workspace
            </div>
          </div>
        </button>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur-xl shadow-[0_0_30px_rgba(15,23,42,0.35)]">
          <NavItem
            active={location.pathname === "/"}
            onClick={() => navigate("/")}
          >
            Home
          </NavItem>

          <NavItem
            active={location.pathname === "/single"}
            onClick={() => navigate("/single")}
          >
            Single File Review
          </NavItem>

          <NavItem
            active={location.pathname === "/project"}
            onClick={() => navigate("/project")}
          >
            Project Intelligence
          </NavItem>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-blue-400">
            Current Mode
          </p>
          <h3 className="mt-3 text-lg font-semibold text-white">
            Project Intelligence
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Analyze repository structure, system design, interview readiness,
            and documentation from a full project archive.
          </p>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.30)]"
          : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
      }`}
    >
      {children}
    </button>
  );
}

function Tabs({ active, setActive }) {
  const tabs = [
    { id: "PROJECT_REVIEW", label: "Project Review" },
    { id: "PROJECT_EXPLAIN", label: "Architecture" },
    { id: "INTERVIEW", label: "Interview Q&A" },
    { id: "DOCUMENTATION", label: "Documentation" },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur-xl shadow-[0_0_30px_rgba(15,23,42,0.20)]">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
              active === tab.id
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.30)]"
                : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ title, subtitle, children, onDownload, accent }) {
  const accentMap = {
    blue: {
      border: "border-blue-500/20",
      glow: "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_35%)]",
      beam: "via-blue-400/70",
    },
    emerald: {
      border: "border-emerald-500/20",
      glow: "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_35%)]",
      beam: "via-emerald-400/70",
    },
    purple: {
      border: "border-purple-500/20",
      glow: "bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_35%)]",
      beam: "via-fuchsia-400/70",
    },
  };

  return (
    <section
      className={`group relative overflow-hidden rounded-[30px] border bg-slate-950/50 p-8 md:p-10 backdrop-blur-2xl shadow-[0_0_40px_rgba(2,6,23,0.40)] transition-all duration-300 hover:-translate-y-1 ${accentMap[accent].border}`}
    >
      <div
        className={`absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent ${accentMap[accent].beam} to-transparent opacity-80`}
      />
      <div className={`absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 ${accentMap[accent].glow}`} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02)_30%,transparent_60%)]" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
              {title}
            </h3>
            <p className="text-sm text-slate-400 mt-2">{subtitle}</p>
          </div>

          <button
            onClick={onDownload}
            className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-slate-100 backdrop-blur transition duration-300 hover:bg-white/[0.08] hover:border-white/20"
          >
            Download PDF
          </button>
        </div>

        {children}
      </div>
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
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const parts = block.split(/ANSWER:/g);
        const question = parts[0]?.trim() || "";
        const answer = parts[1]?.trim() || "";

        return (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition duration-300 hover:border-blue-400/20"
          >
            <p className="text-blue-400 font-semibold mb-4">
              Q{index + 1}. {question}
            </p>

            <p className="text-slate-300 leading-7 text-sm">
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-8 whitespace-pre-wrap text-slate-300">
      {children}
    </div>
  );
}