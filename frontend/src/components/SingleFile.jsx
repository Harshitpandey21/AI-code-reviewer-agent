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
    <div className="min-h-screen flex bg-gradient-to-br from-[#020617] via-[#0b1224] to-[#020617] text-slate-200">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">

            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Single File Code Review
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                AI-powered review, refactoring, and test analysis
              </p>
            </div>

            <div className="text-sm">
              {loading ? (
                <div className="flex items-center gap-2 text-blue-400">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                  Analyzing
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  Ready to Analyze
                </div>
              )}
            </div>

          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-12 space-y-12 w-full">

          <section className="relative bg-slate-900/60 border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-xl transition hover:border-blue-500/30">

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>

            <div className="relative flex flex-col md:flex-row gap-6 items-center">

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="flex-1 text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-slate-800 file:text-white hover:file:bg-slate-700 transition"
              />

              <button
                onClick={runReview}
                disabled={!file || loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-40 px-8 py-3 rounded-xl shadow-lg"
              >
                {loading ? "Analyzing…" : "Run AI Review"}
              </button>

              <button
                onClick={downloadPDF}
                disabled={!result || downloading}
                className="bg-slate-800 hover:bg-slate-700 transition disabled:opacity-40 px-6 py-3 rounded-xl border border-white/5"
              >
                {downloading ? "Preparing PDF…" : "Download PDF"}
              </button>

            </div>
          </section>

          {result && (
            <div className="space-y-12">

              <Section
                title="Review Report"
                subtitle="Issues, improvements, and best practices"
                accent="blue"
              >
                <ReadableBlock>{result.review_code}</ReadableBlock>
              </Section>

              <Section
                title="Test Suggestions"
                subtitle="Recommended test cases and edge conditions"
                accent="emerald"
              >
                <ReadableBlock>{result.test_report}</ReadableBlock>
              </Section>

              <Section
                title="Refactored Code"
                subtitle="Improved, cleaner implementation"
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
    <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 p-8 hidden md:block">

      <h2 className="text-lg font-semibold mb-10 tracking-tight">
        AI Studio
      </h2>

      <nav className="space-y-3 text-sm">
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
      className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-200
        ${active
          ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
    >
      {children}
    </div>
  );
}

function Section({ title, subtitle, accent, children }) {
  const accentMap = {
    blue: "border-blue-500/20",
    emerald: "border-emerald-500/20",
    purple: "border-purple-500/20",
  };

  return (
    <section className={`bg-slate-900/70 backdrop-blur-xl border ${accentMap[accent]} rounded-2xl p-10 shadow-2xl transition hover:border-blue-500/20`}>
      <h3 className="text-xl font-semibold tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-400 mt-1 mb-6">
        {subtitle}
      </p>
      {children}
    </section>
  );
}

function ReadableBlock({ children }) {
  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-300">
      {children}
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <pre className="bg-slate-950 border border-white/5 rounded-xl p-6 overflow-x-auto text-sm font-mono text-slate-200 shadow-inner">
      {children}
    </pre>
  );
}
