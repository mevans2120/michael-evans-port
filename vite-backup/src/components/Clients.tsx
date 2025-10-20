const clients = [
  { name: "TechCorp", industry: "Technology" },
  { name: "InnovateLab", industry: "Healthcare" },
  { name: "RetailMax", industry: "E-commerce" },
  { name: "FinanceFirst", industry: "Financial Services" },
  { name: "EduFuture", industry: "Education Technology" },
  { name: "GreenEnergy", industry: "Sustainability" }
];

const testimonials = [
  {
    quote: "Working with them transformed our digital presence completely. The strategic approach and innovative solutions exceeded our expectations.",
    author: "Sarah Chen",
    role: "VP of Digital, TechCorp",
    company: "TechCorp"
  },
  {
    quote: "The AI-powered solution delivered remarkable results. Our users love the new experience and our metrics have never been better.",
    author: "Michael Rodriguez",
    role: "Product Director, InnovateLab",
    company: "InnovateLab"
  }
];

const Clients = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            <span className="text-gradient">Trusted By</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Collaborating with forward-thinking organizations across industries
          </p>
        </div>
        
        {/* Client Logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-20">
          {clients.map((client, index) => (
            <div 
              key={client.name}
              className="text-center group animate-stagger"
            >
              <div className="bg-card p-6 rounded-xl shadow-card group-hover:shadow-elegant transition-all duration-300 border border-border/50">
                <h4 className="font-medium text-card-foreground mb-1">{client.name}</h4>
                <p className="text-sm text-muted-foreground font-light">{client.industry}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.author}
              className="bg-card p-8 rounded-2xl shadow-card border border-border/50 animate-stagger"
            >
              <p className="text-lg text-card-foreground mb-6 font-light leading-relaxed italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-medium text-card-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground font-light">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;