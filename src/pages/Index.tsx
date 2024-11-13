import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold mb-4">Why Choose IXSO</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the most advanced lighting system in Roblox
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="trophy"
            title="Premium Quality"
            description="Industry-leading lighting effects and performance"
          />
          <FeatureCard
            icon="shield"
            title="Exclusive Access"
            description="Join an elite community of lighting designers"
          />
          <FeatureCard
            icon="lightning"
            title="Powerful Controls"
            description="Advanced features for professional stage management"
          />
        </div>
      </section>
    </main>
  );
};

export default Index;