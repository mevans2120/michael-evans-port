import { Button } from "@/components/ui/button";

const caseStudies = [
  {
    title: "FinTech Platform Redesign",
    client: "Leading Financial Services",
    description: "Complete UX overhaul resulting in 150% increase in user engagement and 40% reduction in support tickets.",
    tags: ["UX Design", "Strategy", "Research"],
    image: "🏦"
  },
  {
    title: "AI-Powered Healthcare App",
    client: "Healthcare Innovation Lab",
    description: "End-to-end development of an AI diagnostic tool serving 50,000+ patients monthly.",
    tags: ["AI Development", "UX Design", "Production"],
    image: "🏥"
  },
  {
    title: "E-commerce Transformation",
    client: "Retail Technology Leader",
    description: "Strategic digital transformation leading to 200% revenue growth and market expansion.",
    tags: ["Strategy", "Digital Production", "Research"],
    image: "🛍️"
  }
];

const CaseStudies = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            <span className="text-gradient">Case Studies</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Real impact through strategic design and innovative solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {caseStudies.map((study, index) => (
            <div 
              key={study.title}
              className="group animate-stagger"
            >
              <div className="bg-card p-8 rounded-2xl shadow-card group-hover:shadow-elegant transition-all duration-300 border border-border/50">
                <div className="text-6xl mb-6 opacity-80">{study.image}</div>
                
                <div className="mb-4">
                  <h3 className="text-2xl font-medium mb-2 text-card-foreground">
                    {study.title}
                  </h3>
                  <p className="text-primary font-medium">{study.client}</p>
                </div>
                
                <p className="text-muted-foreground mb-6 font-light leading-relaxed">
                  {study.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {study.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-light"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Button variant="outline" className="border-border hover:bg-secondary">
                  View Case Study
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;