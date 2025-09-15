import { ArrowRight, ExternalLink } from "lucide-react";
import Navigation from "@/components/Navigation";
import Contact from "@/components/Contact";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "This App",
    description: "This presentation app is meant to support navigation beyond back and forward. I'm using it to share my research on AI and vibe coding.",
    image: "/api/placeholder/400/300",
    link: "https://ai-research-presentation.vercel.app/section/intro/0",
    status: "Live"
  },
  {
    title: "Karuna's Website",
    description: "Karuna is a shaman who offers spiritual healing. Karuna wanted a site that was clean, and modern but was still mystical and unique.",
    image: "/api/placeholder/400/300",
    link: "https://www.karunagatton.com/",
    status: "Live"
  },
  {
    title: "D&D Initiative Tracker",
    description: "I built the D&D initiative tracker with my 11-year-old son for the campaigns I run with his friends. It tracks turn order, health points, and sorts characters for easy review. The speed it came together inspired this entire project.",
    image: "/api/placeholder/400/300",
    link: "https://dungeon-tracker.vercel.app/",
    status: "Live"
  },
  {
    title: "Voice Activated Kitchen Timer POC",
    description: "I love cooking, but didn't want an always-on Amazon device. So I built an offline, voice-activated kitchen timer—my first vibe coding project. If you've cooked with messy hands, you know why voice is ideal.",
    image: "/api/placeholder/400/300",
    link: "https://voice-timer-sand.vercel.app/",
    status: "Live"
  },
  {
    title: "AI Research Agent",
    description: "An in-progress agentic app that scrapes sites and pursues multiple questions while performing research, filtering results for relevance.",
    image: "/api/placeholder/400/300",
    link: "https://research-agent-sable.vercel.app/",
    status: "In Progress"
  },
  {
    title: "Department of Art",
    description: "A new project for DOA (the Department of Art production company) based in Portland. The goal is to see how quickly I can build an effective and excellent website for them using AI.",
    image: "/api/placeholder/400/300",
    link: "#",
    status: "Coming Soon"
  }
];

const AIShowcase = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-light text-foreground mb-8">
              AI App Showcase
            </h1>
            <p className="text-2xl text-muted-foreground font-light max-w-4xl mx-auto leading-relaxed">
              A collection of production applications and prototypes built using AI tools. 
              Each project demonstrates different approaches to AI-assisted development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {projects.map((project, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-elegant transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video bg-secondary/20 flex items-center justify-center">
                  <div className="text-muted-foreground text-sm">Project Preview</div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-medium text-foreground">{project.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'Live' 
                        ? 'bg-green-500/20 text-green-300' 
                        : project.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  {project.status !== 'Coming Soon' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group"
                      onClick={() => window.open(project.link, '_blank')}
                    >
                      View Project
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
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
      </div>

      <Contact />
    </div>
  );
};

export default AIShowcase;