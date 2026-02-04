import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home"
import SingleFile from "./components/SingleFile"
import Project from "./components/Project"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Navigate to="/project" />} />
        <Route path="/project" element={<Project />} />
        <Route path="/single" element={<SingleFile />} />
      </Routes>
    </BrowserRouter>
  );
}

