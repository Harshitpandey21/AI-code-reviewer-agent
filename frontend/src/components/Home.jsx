import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-white relative">
      <div className="absolute inset-0 bg-[#020617]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(99,102,241,0.10),transparent_22%),radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.08),transparent_20%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_18%,transparent_82%,rgba(255,255,255,0.015))]" />
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative z-10">
        <nav
          className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/40 backdrop-blur-lg transition-all duration-300 ${
            scrolled ? "py-0 shadow-[0_10px_40px_rgba(2,6,23,0.45)]" : "py-0"
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

          <div
            className={`mx-auto flex max-w-7xl items-center justify-between px-8 transition-all duration-300 ${
              scrolled ? "py-3" : "py-5"
            }`}
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 text-left"
            >
              <div
                className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_30px_rgba(59,130,246,0.30)] transition-all duration-300 ${
                  scrolled ? "h-10 w-10" : "h-11 w-11"
                }`}
              >
                <span className={`${scrolled ? "text-lg" : "text-xl"} transition-all duration-300`}>
                  🧠
                </span>
              </div>

              <div>
                <div
                  className={`font-bold tracking-tight transition-all duration-300 ${
                    scrolled ? "text-lg md:text-xl" : "text-xl md:text-2xl"
                  }`}
                >
                  AI Code Reviewer
                </div>
                <div
                  className={`text-[11px] text-slate-400 tracking-[0.18em] uppercase transition-all duration-300 ${
                    scrolled ? "opacity-80" : "opacity-100"
                  }`}
                >
                  Code Intelligence Platform
                </div>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-xl shadow-[0_0_30px_rgba(15,23,42,0.35)]">
              <NavPill
                active={location.pathname === "/"}
                onClick={() => navigate("/")}
              >
                Home
              </NavPill>

              <NavPill
                active={location.pathname === "/single"}
                onClick={() => navigate("/single")}
              >
                Single File Review
              </NavPill>

              <NavPill
                active={location.pathname === "/project"}
                onClick={() => navigate("/project")}
              >
                Project Intelligence
              </NavPill>
            </div>
          </div>
        </nav>

        <div className="pt-[110px]">
          <section className="mx-auto max-w-7xl overflow-visible px-6 pt-10 pb-10">
            <div className="mx-auto max-w-5xl text-center overflow-visible">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.12)]">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                AI-powered analysis for modern developers
              </div>

              <h1 className="mt-8 pb-4 text-5xl font-extrabold leading-[1.18] tracking-tight md:text-7xl overflow-visible">
                <span className="block text-white">
                  Ship Cleaner Code
                </span>
                <span className="mt-2 block bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  With Real Code Intelligence
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
                Review source files, understand full project architecture, generate interview-ready insights,
                and create polished documentation with AI agents built for developer workflows.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => navigate("/single")}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold shadow-[0_0_35px_rgba(59,130,246,0.35)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_0_45px_rgba(59,130,246,0.45)]"
                >
                  Analyze Single File
                </button>

                <button
                  onClick={() => navigate("/project")}
                  className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-slate-100 backdrop-blur transition duration-300 hover:scale-[1.03] hover:bg-white/10"
                >
                  Analyze Full Project
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <FeaturePill icon="⚡" text="Instant Review Output" />
                <FeaturePill icon="🧠" text="Architecture Understanding" />
                <FeaturePill icon="📄" text="README Generation" />
                <FeaturePill icon="🎤" text="Interview Preparation" />
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:grid-cols-3">
              <MetricCard value="Single File" label="Focused code review and refactoring" />
              <MetricCard value="Full Project" label="Architecture, risks, and explanations" />
              <MetricCard value="Auto Docs" label="Generate README-ready documentation" />
            </div>
          </section>

          <section className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2">
            <ProductCard
              accent="blue"
              badge="For file-level analysis"
              icon={<FileAsset />}
              title="Single File Code Review"
              description="Get structured AI feedback on a single source file, including issues, improvements, refactoring suggestions, and test recommendations."
              buttonText="Open Single File Review"
              onClick={() => navigate("/single")}
            />

            <ProductCard
              accent="purple"
              badge="For repository-level analysis"
              icon={<ProjectAsset />}
              title="Full Project Intelligence"
              description="Upload a complete project and let AI analyze architecture, generate explanations, identify quality concerns, and prepare interview-ready outputs."
              buttonText="Open Project Intelligence"
              onClick={() => navigate("/project")}
            />
          </section>

          <section className="mx-auto mt-24 max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                Built For Real Developer Workflows
              </h2>
              <p className="mt-4 text-slate-400 text-base md:text-lg">
                More than a code explainer. This helps you review, understand, document, and improve code with practical outputs.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <ValueCard
                icon={<SearchAsset />}
                title="Deep Code Analysis"
                text="Identify maintainability issues, weak patterns, poor structure, and code quality problems quickly."
              />
              <ValueCard
                icon={<ArchitectureAsset />}
                title="System Understanding"
                text="Break down architecture, module responsibilities, and relationships across your codebase."
              />
              <ValueCard
                icon={<DocsAsset />}
                title="Automatic Documentation"
                text="Generate clean, reusable technical documentation and README-ready content from actual project files."
              />
              <ValueCard
                icon={<InterviewAsset />}
                title="Interview Readiness"
                text="Create technical questions and answers based on the real implementation, not generic templates."
              />
            </div>
          </section>

          <section className="mx-auto mt-24 max-w-6xl px-6">
            <div className="rounded-[32px] border border-white/10 bg-slate-950/40 p-8 md:p-10 backdrop-blur-xl">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  From Upload To Insight
                </h2>
                <p className="mt-3 text-slate-400">
                  A simple workflow designed for speed and clarity.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                <StepCard step="01" title="Upload Code" text="Choose a file or complete project archive for AI-powered analysis." />
                <StepCard step="02" title="Run Analysis" text="Generate review reports, explanations, documentation, and interview outputs." />
                <StepCard step="03" title="Take Action" text="Use the results to refactor faster, document better, and prepare confidently." />
              </div>
            </div>
          </section>

          <footer className="mt-24 pb-14 pt-14">
            <div className="mx-auto max-w-4xl px-6">
              <div className="flex items-center justify-center gap-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                <p className="whitespace-nowrap text-sm italic tracking-wide text-slate-400">
                  Boost your coding productivity with AI-powered insights.
                </p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-700 to-transparent" />
              </div>

              <div className="mt-8 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_30px_rgba(59,130,246,0.30)]">
                    <span className="text-lg">🧠</span>
                  </div>
                  <div className="text-xl font-bold tracking-tight">AI Code Reviewer</div>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Built with LangGraph · FastAPI · React
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

function NavPill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.30)]"
          : "text-slate-300 hover:text-white hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  )
}

function FeaturePill({ icon, text }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
      <span className="mr-2">{icon}</span>
      {text}
    </div>
  )
}

function MetricCard({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 text-center">
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  )
}

function ProductCard({ accent, badge, icon, title, description, buttonText, onClick }) {
  const accentStyles =
    accent === "blue"
      ? {
          border: "hover:border-blue-400/60",
          glow: "group-hover:opacity-100 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.28),transparent_45%)]",
          button: "from-blue-600 to-indigo-600 shadow-[0_0_25px_rgba(59,130,246,0.30)]",
          badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        }
      : {
          border: "hover:border-fuchsia-400/60",
          glow: "group-hover:opacity-100 bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.30),transparent_45%)]",
          button: "from-purple-600 to-fuchsia-600 shadow-[0_0_25px_rgba(168,85,247,0.30)]",
          badge: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
        }

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/45 p-10 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:scale-[1.02] ${accentStyles.border}`}
    >
      <div className={`absolute inset-0 opacity-0 transition duration-300 ${accentStyles.glow}`} />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />

      <div className="relative z-10 flex h-full flex-col">
        <div className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs ${accentStyles.badge}`}>
          {badge}
        </div>

        <div className="mt-6">{icon}</div>

        <h3 className="mt-7 text-3xl font-bold tracking-tight md:text-[2.15rem]">
          {title}
        </h3>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
          {description}
        </p>

        <div className="mt-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
            className={`rounded-xl bg-gradient-to-r px-8 py-4 text-base font-semibold transition duration-300 hover:scale-[1.03] ${accentStyles.button}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

function ValueCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]">
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold leading-tight">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
    </div>
  )
}

function StepCard({ step, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
      <div className="text-sm font-semibold tracking-[0.25em] text-blue-400 uppercase">
        {step}
      </div>
      <h3 className="mt-3 text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
    </div>
  )
}

function AssetShell({ children, accent = "blue" }) {
  const shell =
    accent === "blue"
      ? "from-sky-400 via-blue-500 to-indigo-600 shadow-[0_0_35px_rgba(59,130,246,0.28)]"
      : "from-fuchsia-400 via-purple-500 to-indigo-600 shadow-[0_0_35px_rgba(168,85,247,0.28)]"

  return (
    <div className={`relative flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br ${shell}`}>
      <div className="absolute inset-[1px] rounded-[23px] bg-[linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0.10)_38%,rgba(2,6,23,0.14))]" />
      <div className="absolute left-3 right-3 top-2 h-4 rounded-full bg-white/25 blur-md" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function FileAsset() {
  return (
    <AssetShell accent="blue">
      <svg viewBox="0 0 24 24" className="h-10 w-10 fill-none stroke-white stroke-[1.8]">
        <path d="M8 3h6l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    </AssetShell>
  )
}

function ProjectAsset() {
  return (
    <AssetShell accent="purple">
      <svg viewBox="0 0 24 24" className="h-10 w-10 fill-none stroke-white stroke-[1.8]">
        <path d="M3 8a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1H3V8Z" />
        <path d="M3 11h18l-1.2 7a2 2 0 0 1-2 1.7H6.2a2 2 0 0 1-2-1.7L3 11Z" />
      </svg>
    </AssetShell>
  )
}

function SearchAsset() {
  return (
    <AssetShell accent="blue">
      <svg viewBox="0 0 24 24" className="h-10 w-10 fill-none stroke-white stroke-[1.8]">
        <circle cx="11" cy="11" r="5.5" />
        <path d="M16 16l4 4" />
      </svg>
    </AssetShell>
  )
}

function ArchitectureAsset() {
  return (
    <AssetShell accent="purple">
      <svg viewBox="0 0 24 24" className="h-10 w-10 fill-none stroke-white stroke-[1.8]">
        <rect x="4" y="4" width="6" height="4" rx="1" />
        <rect x="14" y="4" width="6" height="4" rx="1" />
        <rect x="9" y="16" width="6" height="4" rx="1" />
        <path d="M7 8v3h10V8" />
        <path d="M12 11v5" />
      </svg>
    </AssetShell>
  )
}

function DocsAsset() {
  return (
    <AssetShell accent="blue">
      <svg viewBox="0 0 24 24" className="h-10 w-10 fill-none stroke-white stroke-[1.8]">
        <path d="M8 3h6l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5" />
        <path d="M9 12h6" />
        <path d="M9 15h6" />
        <path d="M9 18h4" />
      </svg>
    </AssetShell>
  )
}

function InterviewAsset() {
  return (
    <AssetShell accent="purple">
      <svg viewBox="0 0 24 24" className="h-10 w-10 fill-none stroke-white stroke-[1.8]">
        <rect x="9" y="3" width="6" height="10" rx="3" />
        <path d="M6 11a6 6 0 0 0 12 0" />
        <path d="M12 17v4" />
        <path d="M9 21h6" />
      </svg>
    </AssetShell>
  )
}