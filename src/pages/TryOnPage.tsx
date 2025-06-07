import PhotoUpload from '../components/TryOn/PhotoUpload';

const TryOnPage = () => {
  return (
    <section className="w-full min-h-[90vh] flex flex-col items-center justify-center px-2 bg-gradient-to-br from-[#f8fbff] via-[#f5f5f5] to-[#eaf6fa]">
      {/* Hero Section */}
      <div className="w-full max-w-4xl text-center mb-14 mt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4 tracking-tight leading-tight drop-shadow-sm">
          Try On Clothes Online with <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">AI</span>
        </h1>
        <p className="text-xl text-secondary mb-6">
          Experience AI-powered virtual try-on with <span className="font-bold text-primary">FitX.ai</span>
        </p>
      </div>
      {/* Main Card Section */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
        {/* Upload Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-[#e0e0e0] p-10 flex flex-col items-center min-h-[420px] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <PhotoUpload />
          <button className="mt-8 w-full max-w-xs py-4 rounded-full bg-primary text-background text-lg font-bold shadow-md hover:bg-secondary hover:text-primary transition-colors">
            Upload your photo
          </button>
          <p className="mt-4 text-secondary text-sm">Or just drag and drop here</p>
          <div className="w-full border-t border-dashed border-[#e0e0e0] my-6" />
          <p className="text-secondary text-xs mb-2">No image? Try one of these</p>
          <div className="flex space-x-2">
            {/* Demo images (placeholders) */}
            <div className="w-12 h-16 bg-[#f5f5f5] rounded-lg border border-[#e0e0e0]" />
            <div className="w-12 h-16 bg-[#f5f5f5] rounded-lg border border-[#e0e0e0]" />
            <div className="w-12 h-16 bg-[#f5f5f5] rounded-lg border border-[#e0e0e0]" />
            <div className="w-12 h-16 bg-[#f5f5f5] rounded-lg border border-[#e0e0e0]" />
          </div>
        </div>
        {/* Preview Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-[#e0e0e0] p-10 flex flex-col items-center justify-center min-h-[420px] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <h2 className="text-2xl font-bold text-primary mb-6 tracking-tight">Try-On Preview</h2>
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-40 h-56 bg-[#f5f5f5] border-2 border-dashed border-secondary rounded-xl flex items-center justify-center mb-4">
                <span className="text-secondary text-lg">No photo yet</span>
              </div>
              <p className="text-secondary text-center text-base">Upload a photo to see your virtual try-on preview here.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryOnPage; 