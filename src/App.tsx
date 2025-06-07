import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

function LandingPage() {
  const navigate = useNavigate();
  const handleGetStarted = useCallback(() => {
    navigate('/tryon');
  }, [navigate]);

  return (
    <>
      {/* ── Navigation Bar ───────────────────────────────────────────── */}
      <nav className="w-full fixed top-0 inset-x-0 h-20 bg-black/90 backdrop-blur z-40">
        <div className="flex items-center h-full max-w-7xl mx-auto px-6">
          {/* Left: logo + links */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3">
              <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400" />
              <span className="text-2xl font-extrabold tracking-tight text-white">
                FitX<span className="text-blue-400">.ai</span>
              </span>
            </a>
            {/* Nav links */}
            <a href="#" className="text-white hover:text-blue-400 font-semibold text-lg transition">Home</a>
            <a href="#about" className="text-white hover:text-blue-400 font-semibold text-lg transition">About</a>
          </div>
          {/* Right: Login (ml-auto pushes it to the far end) */}
          <button className="ml-auto bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-blue-50 transition">Login</button>
        </div>
      </nav>
      {/* ── Hero Section (unchanged) ────────────────────────────────── */}
      <main className="flex-grow flex items-center justify-center pt-20">
        <div className="container py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left space-y-7">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
              Try On <span className="text-blue-600">Clothes</span> Virtually
              <br />
              With <span className="text-indigo-500">AI</span> Magic
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl">
              Instantly see how outfits look on you. No downloads, no hassle.
              Just upload your photo &amp; let our AI do the rest!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-lg transition">
                Get Started
              </button>
            </div>
          </div>
          {/* Illustration placeholder */}
          <div className="flex-1 flex justify-center">
            <div className="w-80 h-80 bg-gradient-to-tr from-blue-100 via-indigo-100 to-white rounded-3xl shadow-xl flex items-center justify-center">
              <span className="text-6xl text-blue-400">👕</span>
            </div>
          </div>
        </div>
      </main>
      {/* ── Footer (unchanged) ─────────────────────────────────────── */}
      <footer className="bg-white border-t mt-12">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400" />
            <span className="font-bold text-lg">FitX.ai</span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FitX.ai. All rights&nbsp;reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-600 transition">
              <svg width="24" height="24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition">
              <svg width="24" height="24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="4" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition">
              <svg width="24" height="24" fill="currentColor">
                <polygon points="12,2 22,22 2,22" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

function TryOnPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24">
      <h2 className="text-3xl font-bold mb-6">Virtual Try-On</h2>
      <p className="mb-4 text-gray-600">Upload your photo to get started!</p>
      <input type="file" accept="image/*" className="mb-6" />
      {/* Placeholder for model output */}
      <div className="w-80 h-80 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
        AI Model Output Here
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tryon" element={<TryOnPage />} />
    </Routes>
  );
}
