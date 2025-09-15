import Navigation from "@/components/Navigation";
import DynamicHero from "@/components/DynamicHero";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <DynamicHero />
      <Contact />
    </div>
  );
};

export default Index;