const Hero = () => (
  <section
    className="w-full min-h-[calc(100vh-60px)] flex items-center justify-center bg-gradient-to-br from-white to-[#F6F6F6] font-sans"
  >
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-4 md:px-10 py-10 md:py-20">
      {/* Left: Headline and sub-copy */}
      <div className="max-w-xl pl-0 lg:pl-16 pt-10 lg:pt-32">
        <h1 className="text-6xl font-extrabold text-brand-navy tracking-tight leading-none">
          Try On Clothes Online with AI
        </h1>
        <p className="text-lg text-brand-gray mt-4">
          Experience AI-powered virtual try-on with FitX.ai
        </p>
      </div>
      {/* Right: Phone mockup */}
      <div className="flex justify-center items-center w-full">
        <div className="w-[80vw] max-w-[340px] h-[70vw] max-h-[700px] bg-[#EDEDED] rounded-xl shadow-xl flex items-center justify-center">
          {/* Placeholder for phone image or content */}
          <span className="text-brand-gray text-lg font-semibold">Phone Mockup</span>
        </div>
      </div>
    </div>
  </section>
);

export default Hero; 