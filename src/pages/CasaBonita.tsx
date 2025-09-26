import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const CasaBonita = () => {
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
              Casa Bonita Platform
            </h1>
            <p className="text-xl text-muted-foreground font-light mb-8">
              Restaurant management, reservation, loyalty platform with 300k+ club members
            </p>
            
            <div className="bg-secondary/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-medium mb-4">Project Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Built and launched Casa Bonita's new restaurant management, reservation, loyalty, and marketing platform — now with 300k+ club members accounting for 80% of bookings, and an 85% reservation utilization rate.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Club Members</h3>
                  <p className="text-2xl font-light text-primary">300k+</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Bookings Rate</h3>
                  <p className="text-2xl font-light text-primary">80%</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Utilization</h3>
                  <p className="text-2xl font-light text-primary">85%</p>
                </div>
              </div>
              
              <h3 className="font-medium text-foreground mb-4">Key Achievements</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• Designed The Founders Club achieving over 250k sign-ups within 6 hours</li>
                <li>• Created comprehensive user research insights and wireframes for digital experiences</li>
                <li>• Designed and tested a pager system enhancing guest experience</li>
                <li>• Casa Bonita has consistently been fully booked since opening</li>
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

export default CasaBonita;