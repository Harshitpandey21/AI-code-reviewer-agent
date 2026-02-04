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
    <div className="min-h-screen flex bg-[#020617] text-slate-200">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <header className="sticky top-0 z-50 bg-black/60 backdrop-blur border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold">Single File Code Review</h1>
              <p className="text-xs text-slate-400">
                AI-powered review, refactoring, and test analysis
              </p>
            </div>

            <div className="text-sm">
              {loading ? (
                <span className="text-blue-400 animate-pulse">
                  ● Analyzing…
                </span>
              ) : (
                <span className="text-emerald-400">● Idle</span>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-10 space-y-10 w-full">

          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row gap-6 items-center">

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="flex-1 text-sm text-slate-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:bg-slate-800 file:text-slate-200"
              />

              <button
                onClick={runReview}
                disabled={!file || loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600
                           hover:from-blue-500 hover:to-indigo-500
                           disabled:opacity-50
                           px-8 py-3 rounded-xl font-medium shadow-lg"
              >
                {loading ? "Analyzing…" : "Run AI Review"}
              </button>

              <button
                onClick={downloadPDF}
                disabled={!result || downloading}
                className="bg-slate-800 hover:bg-slate-700
                           disabled:opacity-50
                           px-6 py-3 rounded-xl font-medium border border-slate-700"
              >
                {downloading ? "Preparing PDF…" : "Download PDF"}
              </button>
            </div>
          </section>

          {result && (
            <div className="space-y-10">

              <Section
                title="Review Report"
                subtitle="Issues, improvements, and best practices"
                accent="blue"
              >
                <ReadableBlock>{result.review_code}</ReadableBlock>
              </Section>

              <Section
                title="Test Suggestions"
                subtitle="Recommended test cases & edge conditions"
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
    <aside className="w-64 bg-black/40 border-r border-slate-800 p-6 hidden md:block">
      <h2 className="text-lg font-semibold mb-8">AI Studio</h2>

      <nav className="space-y-4 text-sm">
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
      className={`px-3 py-2 rounded-md cursor-pointer transition
        ${active
          ? "bg-blue-600/20 text-blue-400"
          : "hover:bg-slate-800 text-slate-300"}`}
    >
      {children}
    </div>
  );
}

function Section({ title, subtitle, accent, children }) {
  const accentMap = {
    blue: "border-blue-600/30 text-blue-400",
    emerald: "border-emerald-600/30 text-emerald-400",
    purple: "border-purple-600/30 text-purple-400",
  };

  return (
    <section className={`bg-slate-900/70 border ${accentMap[accent]} rounded-2xl p-6 shadow-lg`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-xs text-slate-400 mb-4">{subtitle}</p>
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
    <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto text-sm font-mono text-slate-200">
      {children}
    </pre>
  );
}
