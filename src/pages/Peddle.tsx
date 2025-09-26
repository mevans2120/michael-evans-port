import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const Peddle = () => {
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
              Peddle Marketplace
            </h1>
            <p className="text-xl text-muted-foreground font-light mb-8">
              Platform redesign resulting in 10%+ post-launch conversion increase
            </p>
            
            <div className="bg-secondary/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-medium mb-4">Project Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Directed the product strategy for the redesign and re-platforming of Peddle.com, resulting in a post-launch conversion rate increase of over 10%.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Conversion Increase</h3>
                  <p className="text-2xl font-light text-accent">10%+</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">A/B Test Improvement</h3>
                  <p className="text-2xl font-light text-accent">5%</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Data Integration</h3>
                  <p className="text-2xl font-light text-accent">Complete</p>
                </div>
              </div>
              
              <h3 className="font-medium text-foreground mb-4">Key Achievements</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• Led Raw Materials Data and Insights team transition from GA3 to holistic Snowplow, Snowflake & GA4</li>
                <li>• Designed and developed A/B Tests improving top-of-funnel conversion by 5%</li>
                <li>• Post-launch dashboards provided data insights across marketplace and operations</li>
                <li>• Comprehensive platform redesign and re-platforming strategy</li>
                <li>• Cross-functional team leadership and stakeholder management</li>
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

export default Peddle;