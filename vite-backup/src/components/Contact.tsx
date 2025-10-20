import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            <span className="text-gradient">Let's Create</span>
            <br />
            <span className="text-foreground">Something Exceptional</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 font-light leading-relaxed max-w-2xl mx-auto">
            Ready to transform your digital presence? Let's discuss how we can bring your vision to life through strategic design and innovative solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant">
              Start a Project
            </Button>
            <Button variant="outline" size="lg" className="border-border hover:bg-secondary">
              Schedule a Call
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-stagger">
              <h3 className="text-lg font-medium mb-2 text-foreground">Email</h3>
              <p className="text-muted-foreground font-light">hello@yourconsulting.com</p>
            </div>
            <div className="animate-stagger">
              <h3 className="text-lg font-medium mb-2 text-foreground">LinkedIn</h3>
              <p className="text-muted-foreground font-light">Connect with me</p>
            </div>
            <div className="animate-stagger">
              <h3 className="text-lg font-medium mb-2 text-foreground">Location</h3>
              <p className="text-muted-foreground font-light">Available Worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;