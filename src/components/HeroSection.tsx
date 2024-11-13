const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ixso-purple/20 to-transparent" />
      
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 animate-fade-up">
        <span className="inline-block px-3 py-1 rounded-full text-sm bg-white/10 backdrop-blur-lg border border-white/10 mb-6">
          Invite Only
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Next Generation
          <span className="block text-gradient">Stage Lighting</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Premium lighting system for elite Roblox experiences
        </p>
        <button className="px-8 py-4 bg-ixso-purple rounded-lg hover-glow transition-all duration-300 hover:-translate-y-0.5 text-lg font-medium">
          Request Access
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ixso-dark to-transparent" />
    </div>
  );
};

export default HeroSection;