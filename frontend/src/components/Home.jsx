import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0b1224] to-[#020617] text-white">
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-wide flex items-center gap-2">
            🧠 AI Code Reviewer
          </div>

          <div className="hidden md:flex gap-6 text-sm text-slate-300">
            <button onClick={() => navigate("/")} className="hover:text-white">
              Home
            </button>
            <button onClick={() => navigate("/single")} className="hover:text-white">
              Single File Review
            </button>
            <button onClick={() => navigate("/project")} className="hover:text-white">
              Project Intelligence
            </button>
          </div>
        </div>
      </nav>
      <section className="max-w-5xl mx-auto px-6 text-center mt-28">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          AI-Powered Code Intelligence  
          <span className="block text-blue-500 mt-2">
            For Developers Who Care About Quality
          </span>
        </h1>

        <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
          Review, refactor, and understand your codebase using autonomous AI agents.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <button
            onClick={() => navigate("/single")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition shadow-lg shadow-blue-600/30"
          >
            Try Single File Review
          </button>
          <button
            onClick={() => navigate("/project")}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition"
          >
            Analyze Full Project
          </button>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 mt-24 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="
          relative group
          bg-slate-900/60 border border-slate-800 rounded-2xl p-10
          transition-all duration-300 ease-out
          hover:-translate-y-2 hover:scale-[1.04]
          hover:border-blue-500
          hover:shadow-[0_0_40px_rgba(59,130,246,0.35)]
        ">
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition
                          bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-xl"></div>

          <div className="relative z-10">
            <div className="text-5xl mb-6">📄</div>
            <h2 className="text-2xl font-semibold">
              Single File Code Review
            </h2>
            <p className="text-slate-400 mt-3 leading-relaxed">
              Get instant AI feedback on a single source file — including review,
              refactoring suggestions, and test recommendations.
            </p>
            <button
              onClick={() => navigate("/single")}
              className="mt-8 inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-md transition"
            >
              Get Started →
            </button>
          </div>
        </div>
        <div className="
          relative group
          bg-slate-900/60 border border-slate-800 rounded-2xl p-10
          transition-all duration-300 ease-out
          hover:-translate-y-2 hover:scale-[1.04]
          hover:border-purple-500
          hover:shadow-[0_0_40px_rgba(168,85,247,0.35)]
        ">
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition
                          bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-xl"></div>

          <div className="relative z-10">
            <div className="text-5xl mb-6">📁</div>
            <h2 className="text-2xl font-semibold">
              Full Project Intelligence
            </h2>
            <p className="text-slate-400 mt-3 leading-relaxed">
              Upload an entire project and let AI understand architecture,
              design decisions, risks, and interview-ready explanations.
            </p>
            <button
              onClick={() => navigate("/project")}
              className="mt-8 inline-flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-md transition"
            >
              Get Started →
            </button>
          </div>
        </div>

      </section>

      <footer className="mt-28 pb-10 text-center text-slate-500 text-sm">
        Built with LangGraph, FastAPI, and React · AI Code Reviewer
      </footer>
    </div>
  )
}
