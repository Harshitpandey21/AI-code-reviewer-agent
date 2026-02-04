import { useNavigate, useLocation } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItem = (path, label) => (
    <button
      onClick={() => navigate(path)}
      className={`text-sm transition ${
        location.pathname === path
          ? "text-white font-medium"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  )

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur bg-black/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-xl font-bold flex items-center gap-2 cursor-pointer"
        >
          🧠 AI Agent Studio
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
          {navItem("/", "Home")}
          {navItem("/single", "Single File Review")}
          {navItem("/project", "Project Intelligence")}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/docs")}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition shadow shadow-blue-600/30"
        >
          Documentation
        </button>

      </div>
    </nav>
  )
}
