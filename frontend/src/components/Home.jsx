import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_75%_35%,rgba(168,85,247,0.16),transparent_25%),radial-gradient(circle_at_20%_75%,rgba(59,130,246,0.12),transparent_25%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#08122c] to-[#020617]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/40 backdrop-blur border-b border-white/10">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"></div>
          <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500 shadow-lg shadow-blue-500/20">
                <span className="text-lg">🧠</span>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">AI Code Reviewer</div>
              </div>
            </button>

            <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
              <button onClick={() => navigate("/")} className="transition hover:text-white">
                Home
              </button>
              <button onClick={() => navigate("/single")} className="transition hover:text-white">
                Single File Review
              </button>
              <button onClick={() => navigate("/project")} className="transition hover:text-white">
                Project Intelligence
              </button>
            </div>
          </div>
        </nav>

        <div className="pt-24"></div>

        <section className="mx-auto max-w-6xl px-6 pb-8 pt-16 text-center md:pt-20">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
              <span className="block text-white">AI-Powered Code Intelligence</span>
              <span className="mt-2 block bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                For Developers Who Care About Quality
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Review, refactor, and understand your codebase using autonomous AI agents.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/single")}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold shadow-[0_0_30px_rgba(59,130,246,0.35)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(59,130,246,0.45)]"
              >
                Analyze Single File
              </button>

              <button
                onClick={() => navigate("/project")}
                className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-slate-100 backdrop-blur transition duration-300 hover:scale-[1.03] hover:bg-white/10"
              >
                Analyze Full Project
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <FeaturePill icon="⚡" text="Instant AI Analysis" />
              <FeaturePill icon="🧠" text="Architecture Insights" />
              <FeaturePill icon="📄" text="Auto Documentation" />
              <FeaturePill icon="🎯" text="Interview Preparation" />
            </div>
          </div>
        </section>

        <section className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-2">
          <ProductCard
            accent="blue"
            icon="📄"
            title="Single File Code Review"
            description="Get instant AI feedback on a single source file — including review, refactoring suggestions, and test recommendations."
            buttonText="Get Started →"
            onClick={() => navigate("/single")}
          />

          <ProductCard
            accent="purple"
            icon="📁"
            title="Full Project Intelligence"
            description="Upload an entire project and let AI understand architecture, design decisions, risks, and interview-ready explanations."
            buttonText="Get Started →"
            onClick={() => navigate("/project")}
          />
        </section>

        <section className="mx-auto mt-20 max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight md:text-5xl">
            Why Developers Use AI Code Reviewer
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
            <ValueCard
              icon="🔎"
              title="Deep Code Analysis"
              text="Identify code smells, bugs, maintainability issues, and improvement opportunities with AI-driven feedback."
            />
            <ValueCard
              icon="🧩"
              title="Architecture Intelligence"
              text="Understand project structure, dependencies, module responsibilities, and overall design decisions."
            />
            <ValueCard
              icon="🎤"
              title="Interview Preparation"
              text="Generate realistic technical questions and answers based on your actual codebase and architecture."
            />
            <ValueCard
              icon="📝"
              title="Automatic Documentation"
              text="Create polished README content and technical summaries ready for GitHub repositories and handoff."
            />
            <ValueCard
              icon="⚡"
              title="Fast AI Agents"
              text="Get actionable insights quickly without manually reviewing every file in your project."
            />
          </div>
        </section>

        <footer className="mt-20 pb-12 pt-14">
          <div className="mx-auto max-w-4xl px-6">
            <div className="flex items-center justify-center gap-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              <p className="whitespace-nowrap text-sm italic tracking-wide text-slate-400">
                Boost your coding productivity with AI-powered insights.
              </p>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-700 to-transparent" />
            </div>

            <div className="mt-8 text-center">
              <div className="text-xl font-bold tracking-tight">🧠 AI Code Reviewer</div>
              <p className="mt-2 text-sm text-slate-400">
                Built with LangGraph · FastAPI · React
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
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

function ProductCard({ accent, icon, title, description, buttonText, onClick }) {
  const accentStyles =
    accent === "blue"
      ? {
          border: "hover:border-blue-400/60",
          glow: "group-hover:opacity-100 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.28),transparent_45%)]",
          button: "from-blue-600 to-indigo-600 shadow-[0_0_25px_rgba(59,130,246,0.30)]",
          ring: "shadow-[0_0_50px_rgba(59,130,246,0.18)]",
        }
      : {
          border: "hover:border-fuchsia-400/60",
          glow: "group-hover:opacity-100 bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.30),transparent_45%)]",
          button: "from-purple-600 to-fuchsia-600 shadow-[0_0_25px_rgba(168,85,247,0.30)]",
          ring: "shadow-[0_0_50px_rgba(168,85,247,0.18)]",
        }

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/40 p-10 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:scale-[1.02] ${accentStyles.border} ${accentStyles.ring}`}
    >
      <div className={`absolute inset-0 opacity-0 transition duration-300 ${accentStyles.glow}`} />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center text-center">
        <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-4xl shadow-inner">
          {icon}
        </div>

        <h3 className="text-4xl font-bold tracking-tight md:text-[2.15rem]">{title}</h3>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
          {description}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
          className={`mt-10 rounded-xl bg-gradient-to-r px-8 py-4 text-lg font-semibold transition duration-300 hover:scale-[1.03] ${accentStyles.button}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}

function ValueCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]">
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="text-2xl font-semibold leading-tight">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
    </div>
  )
}