import { Search, Target, Palette, Rocket, Bot, Settings } from "lucide-react";

const services = [
  {
    title: "Digital Research",
    description: "User insights and market analysis to drive strategic decisions",
    icon: Search
  },
  {
    title: "Strategy", 
    description: "Digital strategies that align business goals with user needs",
    icon: Target
  },
  {
    title: "UX Design",
    description: "Human-centered design creating engaging digital experiences",
    icon: Palette
  },
  {
    title: "Digital Production",
    description: "End-to-end execution from concept to successful launch",
    icon: Rocket
  },
  {
    title: "AI-Powered Development",
    description: "Modern development enhanced by AI technologies",
    icon: Bot
  },
  {
    title: "Technical Architecture",
    description: "Full-stack expertise spanning modern web technologies",
    icon: Settings
  }
];

const Services = () => {
  return (
    <section className="pt-8 pb-24 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <service.icon className="text-primary" size={24} />
                <h3 className="text-xl font-light text-card-foreground">
                  {service.title}
                </h3>
              </div>
              <p className="text-muted-foreground font-light leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <a 
            href="/about"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-light"
          >
            Learn more about me →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;