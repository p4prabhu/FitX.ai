import './App.css';
import { Routes, Route } from 'react-router-dom';
import TryOnPage from './pages/TryOnPage';

// Add environment variable type definitions
declare global {
  interface Window {
    env: {
      REACT_APP_S3_BUCKET: string;
      REACT_APP_AWS_REGION: string;
    };
  }
}

/** Injects all SaaS styles globally (works even if Tailwind isn't loaded) */
function StyleInjector() {
  return (
    <style>{`
/* ===== Base + Theme ===== */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
:root{
  --bg1:#0b1020; --bg2:#0e1c5a;
  --text:#EAF0FF; --muted:#B9C4E6;
  --glass:rgba(255,255,255,.08); --glass2:rgba(255,255,255,.12);
  --brand-sky:#7DD3FC; --brand-violet:#D8B4FE; --brand-emerald:#6EE7B7;
  --radius:18px; --shadow:0 12px 35px rgba(0,0,0,.35);
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:var(--text);background:#0b1020}

/* ===== Backdrop (animated gradient + blobs + grain) ===== */
.fx-root{position:relative;min-height:100vh;overflow-x:hidden}
.fx-backdrop{position:fixed;inset:0;z-index:0}
.fx-backdrop::before{
  content:"";position:absolute;inset:0;
  background:linear-gradient(120deg,var(--bg1),var(--bg2),var(--bg1));
  background-size:200% 200%;
  animation:fx-grad-move 12s ease-in-out infinite;
}
@keyframes fx-grad-move{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.fx-blob{position:absolute;filter:blur(40px);opacity:.28;border-radius:999px;transform:translateZ(0)}
.fx-b1{left:-6rem;top:-3rem;width:18rem;height:18rem;background:#EC4899;animation:fx-b1 16s ease-in-out infinite}
.fx-b2{right:-8rem;top:3rem;width:20rem;height:20rem;background:#3B82F6;animation:fx-b2 18s ease-in-out infinite}
.fx-b3{left:35%;bottom:-4rem;width:18rem;height:18rem;background:#10B981;animation:fx-b3 22s ease-in-out infinite}
@keyframes fx-b1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(40px,-30px) scale(1.08)}70%{transform:translate(-20px,20px) scale(.95)}}
@keyframes fx-b2{0%,100%{transform:translate(0,0) scale(1)}35%{transform:translate(-30px,25px) scale(1.05)}65%{transform:translate(15px,-15px) scale(.92)}}
@keyframes fx-b3{0%,100%{transform:translate(0,0) scale(1)}30%{transform:translate(25px,10px) scale(.96)}60%{transform:translate(-20px,-30px) scale(1.06)}}
.fx-grain{position:absolute;inset:0;opacity:.07;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
}

/* ===== Layout + Hero ===== */
.fx-stack{position:relative;z-index:1}
.fx-container{width:100%;max-width:1120px;margin:0 auto;padding:72px 24px}
.fx-hero{text-align:center}
.fx-chip{display:inline-block;padding:6px 12px;border-radius:999px;border:1px solid var(--glass2);
  background:rgba(255,255,255,.1);color:#D6E6FF;font-weight:700;letter-spacing:.2px;backdrop-filter:blur(6px)}
.fx-title{margin:16px 0 8px;font-size:clamp(32px,6vw,64px);font-weight:800;letter-spacing:-.02em}
.fx-title-grad{background:linear-gradient(90deg,var(--brand-sky),var(--brand-violet),var(--brand-emerald));
  -webkit-background-clip:text;background-clip:text;color:transparent}
.fx-sub{color:var(--muted);font-size:clamp(16px,2.3vw,20px);margin:6px 0 18px}
.fx-cta{text-align:center;margin:22px 0 14px}

/* ===== Cards / Shine / Fade ===== */
.fx-card{margin:28px auto 0;max-width:820px;padding:24px 26px;border-radius:var(--radius);
  border:1px solid var(--glass2);background:rgba(255,255,255,.1);backdrop-filter:blur(8px);box-shadow:var(--shadow);line-height:1.65}
.fx-shine{position:relative;overflow:hidden}
.fx-shine::after{content:"";position:absolute;top:-130%;left:-20%;width:140%;height:80%;transform:rotate(12deg);
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);transition:transform .9s ease}
.fx-shine:hover::after{transform:translateY(230%) rotate(12deg)}
.fx-fade{animation:fx-fade .5s ease-out both}
@keyframes fx-fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

/* ===== Grid + Dropzones (used by TryOnPage too) ===== */
.fx-grid{display:grid;grid-template-columns:1fr;gap:24px;margin:28px 0}
@media (min-width:900px){.fx-grid{grid-template-columns:1fr 1fr}}
.fx-card-title{margin:0 0 14px;font-size:24px;font-weight:700}
.fx-muted{color:#D5DEF8;opacity:.9}
.fx-ok{color:#86efac;font-weight:600}
.fx-drop{border:2px dashed rgba(255,255,255,.22);border-radius:14px;padding:28px;text-align:center;
  transition:all .2s ease;background:rgba(255,255,255,.06)}
.fx-drop:hover{border-color:rgba(255,255,255,.35);background:rgba(255,255,255,.08)}
.fx-drop.active{border-color:#7DD3FC;background:rgba(125,211,252,.14);box-shadow:0 10px 30px rgba(45,161,255,.28)}

/* ===== Minimal utility so your existing BUTTONS render even without Tailwind ===== */
.inline-flex{display:inline-flex}.items-center{align-items:center}
.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}
.border{border-width:1px}.border-transparent{border-color:transparent}
.text-base{font-size:1rem}.font-medium{font-weight:500}.font-semibold{font-weight:600}
.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}
.text-white{color:#fff}.bg-blue-600{background:#2563eb}.hover\\:bg-blue-700:hover{background:#1d4ed8}
.px-8{padding-left:2rem;padding-right:2rem}
.disabled\\:bg-gray-400:disabled{background:#9ca3af}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}
    `}</style>
  );
}

/** Landing page (keeps your button exactly as-is) */
function LandingPage() {
  return (
    <div className="fx-root">
      <div className="fx-backdrop">
        <span className="fx-blob fx-b1" />
        <span className="fx-blob fx-b2" />
        <span className="fx-blob fx-b3" />
        <span className="fx-grain" />
      </div>

      <div className="fx-stack">
        <div className="fx-container fx-fade">
          <div className="fx-hero">
            <span className="fx-chip">FitX.ai • Virtual Try-On</span>
            <h1 className="fx-title"><span className="fx-title-grad">Welcome to FitX.ai</span></h1>
            <p className="fx-sub">AI-powered virtual try-on for fashion</p>

            {/* ⬇️ EXACT SAME BUTTON you already have */}
            <div className="fx-cta">
              <a
                href="/tryon"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </a>
            </div>

            <div className="fx-card fx-shine">
              Try on outfits virtually before you buy. Upload a clothing image and a photo — see the fit in seconds.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <StyleInjector />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tryon" element={<TryOnPage />} />
      </Routes>
    </>
  );
}
