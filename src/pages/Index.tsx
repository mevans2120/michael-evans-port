import Navigation from "@/components/Navigation";
import HeroDropdownVisual from "@/components/HeroDropdownVisual";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main">
        <HeroDropdownVisual />
        <Contact />
      </main>
    </div>
  );
};

export default Index;