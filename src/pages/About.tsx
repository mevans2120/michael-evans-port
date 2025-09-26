import Navigation from "@/components/Navigation";
import Contact from "@/components/Contact";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main id="main-content" role="main" className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-light text-foreground mb-8">
              About Michael
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Photo Section */}
            <div className="animate-slide-up">
              <div className="aspect-square bg-muted rounded-3xl overflow-hidden shadow-card border border-border/50">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center">
                  <p className="text-muted-foreground text-lg font-light">Photo placeholder</p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-8 animate-slide-up">
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-xl font-light leading-relaxed mb-6">
                  I'm a product strategist, designer, and developer with nearly 20 years of experience 
                  leading customer-centric teams and driving innovation across multiple industries.
                </p>
                
                <p className="mb-6 leading-relaxed">
                  My journey began in a purple house—a childhood lesson that standing out isn't just 
                  acceptable, it's essential. That philosophy has shaped every product decision I've 
                  made since, always asking: "How can this be unexpectedly delightful?"
                </p>

                <p className="mb-6 leading-relaxed">
                  Over the past two decades, I've built digital products and led teams across B2C, 
                  Health & Wellness, Retail, Commerce, Hospitality, Marketplaces, Technology, Media, 
                  and AI industries. My approach combines deep user research, strategic thinking, 
                  and hands-on development to create products that truly serve customer needs while 
                  driving business growth.
                </p>

                <p className="mb-6 leading-relaxed">
                  I believe great products are born from the intersection of user empathy, technical 
                  possibility, and business value. My role is to orchestrate these elements into 
                  experiences that feel both innovative and inevitable.
                </p>

                <p className="mb-6 leading-relaxed">
                  In the age of AI, I'm particularly interested in how we can use these powerful 
                  tools to augment human creativity rather than replace it—building products that 
                  make people more capable, not more dependent.
                </p>

                <p className="leading-relaxed">
                  When I'm not building products, you might find me farming, cooking, or exploring 
                  the intersection of technology and human creativity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Contact />
    </div>
  );
};

export default About;