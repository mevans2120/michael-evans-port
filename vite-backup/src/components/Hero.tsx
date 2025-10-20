import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-accent/10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light mb-12 leading-tight">
            <span className="text-gradient">Digital Innovation</span>
            <br />
            <span className="text-foreground">Through Strategic Design</span>
          </h1>
          
          <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground mb-16 font-light leading-relaxed max-w-4xl mx-auto">
            I help forward-thinking organizations transform ideas into exceptional digital experiences through research, strategy, design, and AI-powered development.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant">
              View My Work
            </Button>
            <Button variant="outline" size="lg" className="border-border hover:bg-secondary">
              Let's Connect
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;