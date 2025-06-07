const Header = () => {
  return (
    <header className="bg-bg-nav sticky top-0 z-50 shadow-md w-full">
      <nav className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16 border-b border-[#222222]/10">
        <div className="text-2xl font-bold text-text-nav tracking-tight">FitX.ai</div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-text-nav hover:text-text-nav-hover transition-colors duration-150 font-medium uppercase">Home</a>
          <a href="/try-on" className="text-text-nav hover:text-text-nav-hover transition-colors duration-150 font-medium uppercase">Try On</a>
          <a href="/about" className="text-text-nav hover:text-text-nav-hover transition-colors duration-150 font-medium uppercase">About</a>
        </div>
        <button className="bg-cta text-text-nav px-6 py-2 rounded-full font-bold hover:bg-cta-hover transition-colors duration-150 shadow-sm">Sign In</button>
      </nav>
    </header>
  );
};

export default Header; 