export default function DemoColorSystem() {
  return (
    <div className="min-h-screen bg-bg-page">
      {/* NavBar */}
      <nav className="bg-bg-nav px-8 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-text-nav tracking-tight">FitX.ai</div>
        <div className="flex space-x-8">
          <a href="#" className="text-text-nav hover:text-text-nav-hover transition-colors duration-150 font-medium">Home</a>
          <a href="#" className="text-text-nav hover:text-text-nav-hover transition-colors duration-150 font-medium">Try On</a>
          <a href="#" className="text-text-nav hover:text-text-nav-hover transition-colors duration-150 font-medium">About</a>
        </div>
        <button className="bg-cta text-text-nav px-6 py-2 rounded-full font-bold hover:bg-cta-hover transition-colors duration-150">Sign In</button>
      </nav>
      {/* HeroCopy */}
      <section className="max-w-3xl mx-auto mt-24 px-4">
        <h1 className="text-6xl font-black tracking-tight leading-none text-bg-nav mb-6">
          Change Clothes Online with AI
        </h1>
        <p className="text-base leading-relaxed text-copy mb-8">
          Experience AI-powered virtual try-on with FitX.ai. Upload your photo and see yourself in the latest styles instantly.
        </p>
        <button className="bg-cta text-text-nav px-8 py-4 rounded-full text-lg font-bold hover:bg-cta-hover transition-colors duration-150">
          Upload your photo
        </button>
      </section>
    </div>
  );
} 