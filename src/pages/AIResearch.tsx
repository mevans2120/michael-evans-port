import { ArrowRight, Users, FileText, Code, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import Contact from "@/components/Contact";
import { Button } from "@/components/ui/button";

const researchAreas = [
  {
    icon: Users,
    title: "User Research",
    description: "I interviewed 13 colleagues about how they use AI in their lives (work and personal) and where they think AI is going next.",
    insights: [
      "Most people use AI for writing assistance and brainstorming",
      "Trust in AI outputs varies significantly by domain",
      "Integration with existing workflows is crucial for adoption"
    ]
  },
  {
    icon: FileText,
    title: "Concept & Content",
    description: "A thought experiment 'What if AI was a wrapper over your phone's tools?' And a collection of interesting articles and podcasts around AI.",
    insights: [
      "AI as middleware could revolutionize mobile interfaces",
      "Context-aware computing is the next frontier", 
      "Privacy concerns shape AI adoption patterns"
    ]
  },
  {
    icon: Code,
    title: "Vibe Coding",
    description: "I describe my current AI coding workflow and I share some of the projects that I've created solely using AI tools.",
    insights: [
      "AI accelerates prototyping by 10x",
      "Natural language to code translation is surprisingly effective",
      "Human oversight remains critical for quality and architecture"
    ]
  },
  {
    icon: Search,
    title: "Summary & Future",
    description: "What I have learned from the research, the vibe coding, and what I think the AI future looks like.",
    insights: [
      "AI will augment rather than replace human creativity",
      "The most successful AI products feel invisible to users",
      "Ethical considerations must be built into the foundation"
    ]
  }
];

const AIResearch = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main id="main-content" role="main" className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-light text-foreground mb-8">
              AI Research
            </h1>
            <p className="text-2xl text-muted-foreground font-light max-w-4xl mx-auto leading-relaxed">
              A collection of research, thoughts, and coding experiments exploring the intersection of AI and product development.
            </p>
          </div>

          {/* Research Overview */}
          <div className="mb-20 animate-slide-up">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-3xl font-light text-foreground mb-6">Research Focus</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                My AI research focuses on practical applications in product development, user experience design, and the evolving relationship between humans and artificial intelligence. Through interviews, experiments, and hands-on coding, I explore how AI can enhance rather than replace human creativity.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The goal is to understand not just what AI can do, but how it should be integrated into products to create genuine value for users while maintaining human agency and creativity.
              </p>
            </div>
          </div>

          {/* Research Areas */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {researchAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-lg p-8 hover:shadow-elegant transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-light text-foreground">{area.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {area.description}
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground uppercase tracking-wider">Key Insights</h4>
                    <ul className="space-y-2">
                      {area.insights.map((insight, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Methodology */}
          <div className="mb-16 animate-slide-up">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-3xl font-light text-foreground mb-6">Research Methodology</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-4">Qualitative Research</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      In-depth interviews with 13 professionals across industries
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      Observational studies of AI tool usage patterns
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      Content analysis of AI-related discussions and trends
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-4">Hands-on Experimentation</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      Building functional prototypes using AI coding tools
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      Testing different AI integration patterns
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      Measuring development speed and quality metrics
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="group"
              onClick={() => window.history.back()}
            >
              <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
              Back to Home
            </Button>
          </div>
        </div>
      </main>

      <Contact />
    </div>
  );
};

export default AIResearch;