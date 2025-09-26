import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const VirginAmerica = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main id="main-content" role="main" className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Portfolio
            </a>
          </div>
          
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-light mb-4 text-foreground">
              Virgin America Digital
            </h1>
            <p className="text-xl text-muted-foreground font-light mb-8">
              Award-winning website and mobile app achieving 15% conversion lift
            </p>
            
            <div className="bg-secondary/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-medium mb-4">Project Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Led strategy, design, and development for VirginAmerica.com, resulting in a 15% conversion lift over three years and influencing Alaska Airlines' digital evolution.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Conversion Lift</h3>
                  <p className="text-2xl font-light text-primary">15%</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Time Period</h3>
                  <p className="text-2xl font-light text-primary">3 Years</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Awards Won</h3>
                  <p className="text-2xl font-light text-primary">Multiple</p>
                </div>
              </div>
              
              <h3 className="font-medium text-foreground mb-4">Key Achievements</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• UX Awards, Cannes Lions, CES, Webbys, and more</li>
                <li>• Designed and developed deals page A/B tests improving conversion by 5%</li>
                <li>• Developed Virgin America's first mobile app using pioneering cross-platform framework</li>
                <li>• Reduced maintenance requirements through innovative technical approach</li>
                <li>• Influenced Alaska Airlines' digital transformation strategy</li>
              </ul>
            </div>
            
            <div className="text-center">
              <a 
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                View More Projects
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VirginAmerica;