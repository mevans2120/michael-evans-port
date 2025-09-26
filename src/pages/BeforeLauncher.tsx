import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const BeforeLauncher = () => {
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
              Before Launcher
            </h1>
            <p className="text-xl text-muted-foreground font-light mb-8">
              Award-winning Android launcher that decreased daily phone usage by 40%
            </p>
            
            <div className="bg-secondary/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-medium mb-4">Project Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded a company that shipped an award-winning, wellness focused attention-reducing Android launcher. Grew to 500k+ organic installs through ASO, with sustained high user ratings.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Organic Installs</h3>
                  <p className="text-2xl font-light text-accent">500k+</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">User Rating</h3>
                  <p className="text-2xl font-light text-accent">4.7/5</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Usage Reduction</h3>
                  <p className="text-2xl font-light text-accent">40%</p>
                </div>
              </div>
              
              <h3 className="font-medium text-foreground mb-4">Key Achievements</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• Fast Company "Best Apps of 2019" recognition</li>
                <li>• Novel notification prioritization system to reduce distractions</li>
                <li>• Comprehensive beta testing and onboarding process development</li>
                <li>• Strategic SEM campaign targeting winnable search terms</li>
                <li>• Successfully sold to private development team for continued development</li>
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

export default BeforeLauncher;