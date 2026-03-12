import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function SingleFile() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function runReview() {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/single-review",
        form
      );
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function downloadPDF() {
    if (!file) return;
    setDownloading(true);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/single-review/pdf",
        form,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "ai_code_review_report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#020617]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(99,102,241,0.10),transparent_22%),radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.08),transparent_20%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_18%,transparent_82%,rgba(255,255,255,0.015))]" />
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/40 backdrop-blur-2xl">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

          <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.12)]">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                File-level AI analysis
              </div>

              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-4">
                Single File Code Review
              </h1>

              <p className="text-sm text-slate-400 mt-2">
                AI-powered review, refactoring, and test intelligence for individual source files.
              </p>
            </div>

            <div className="text-sm font-medium">
              {loading ? (
                <div className="flex items-center gap-2 text-blue-400">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                  Analyzing Code
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
            <div className="absolute inset-0 opacity-0 transition duration-300 hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.08),transparent_35%)]" />

            <div className="relative z-10">
              <div className="flex flex-col gap-3 mb-8">
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                  Upload a Source File
                </h2>
                <p className="text-sm text-slate-400">
                  Submit a single file to generate a review report, suggested tests, and an AI-refactored version.
                </p>
              </div>

              <div className="flex flex-col xl:flex-row gap-5 xl:items-center">
                <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-800 file:px-4 file:py-2.5 file:text-white hover:file:bg-slate-700 transition"
                  />
                  {file && (
                    <p className="mt-3 text-xs text-slate-400">
                      Selected file: <span className="text-slate-200 font-medium">{file.name}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={runReview}
                    disabled={!file || loading}
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-semibold shadow-[0_0_30px_rgba(59,130,246,0.28)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_0_45px_rgba(59,130,246,0.40)] disabled:opacity-40"
                  >
                    {loading ? "Analyzing…" : "Run AI Review"}
                  </button>

                  <button
                    onClick={downloadPDF}
                    disabled={!result || downloading}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] px-8 py-3.5 text-sm font-semibold text-slate-100 backdrop-blur transition duration-300 hover:bg-white/[0.08] hover:border-white/20 disabled:opacity-40"
                  >
                    {downloading ? "Preparing PDF…" : "Download PDF"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {result && (
            <div className="space-y-10">
              <Section
                title="Review Report"
                subtitle="Issues, improvements, and engineering best practices"
                accent="blue"
              >
                <ReadableBlock>{result.review_code}</ReadableBlock>
              </Section>

              <Section
                title="Test Suggestions"
                subtitle="Recommended test cases, coverage ideas, and edge scenarios"
                accent="emerald"
              >
                <ReadableBlock>{result.test_report}</ReadableBlock>
              </Section>

              <Section
                title="Refactored Code"
                subtitle="Improved implementation with cleaner structure and readability"
                accent="purple"
              >
                <CodeBlock>{result.refactored_code}</CodeBlock>
              </Section>
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
            File Review
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Analyze one source file to receive targeted code review, refactoring suggestions, and test guidance.
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

function Section({ title, subtitle, accent, children }) {
  const accentMap = {
    blue: {
      border: "border-blue-500/20",
      glow: "group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_35%)]",
      beam: "via-blue-400/70",
    },
    emerald: {
      border: "border-emerald-500/20",
      glow: "group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_35%)]",
      beam: "via-emerald-400/70",
    },
    purple: {
      border: "border-purple-500/20",
      glow: "group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_35%)]",
      beam: "via-fuchsia-400/70",
    },
  };

  return (
    <section
      className={`group relative overflow-hidden rounded-[30px] border bg-slate-950/50 p-8 md:p-10 backdrop-blur-2xl shadow-[0_0_40px_rgba(2,6,23,0.40)] transition-all duration-300 hover:-translate-y-1 ${accentMap[accent].border}`}
    >
      <div className={`absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent ${accentMap[accent].beam} to-transparent opacity-80`} />
      <div className={`absolute inset-0 opacity-0 transition duration-300 ${accentMap[accent].glow}`} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02)_30%,transparent_60%)]" />

      <div className="relative z-10">
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
            {title}
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}

function ReadableBlock({ children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-8 whitespace-pre-wrap text-slate-300">
      {children}
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <pre className="rounded-2xl border border-white/10 bg-[#020617]/90 p-6 overflow-x-auto text-sm font-mono text-slate-200 shadow-inner whitespace-pre-wrap">
      {children}
    </pre>
  );
}