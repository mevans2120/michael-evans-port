import Navigation from "@/components/Navigation";
import Contact from "@/components/Contact";

const Capabilities = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main id="main-content" role="main" className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-light text-foreground mb-8">
              About Michael
            </h1>
            <p className="text-2xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed mb-12">
              A product strategist, designer, and developer with nearly 20 years of experience leading customer-centric teams driving innovation across multiple industries.
            </p>
          </div>

          <div className="space-y-16">
            {/* Background Section */}
            <section className="animate-slide-up">
              <h2 className="text-3xl font-light text-foreground mb-8">Background</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-6">
                  I've spent nearly two decades building digital products and leading teams across B2C, Health & Wellness, Retail, Commerce, Hospitality, Marketplaces, Technology, Media, and AI industries.
                </p>
                <p className="mb-6">
                  My approach combines deep user research, strategic thinking, and hands-on development to create products that truly serve customer needs while driving business growth.
                </p>
                <p>
                  When I'm not building products, you might find me farming, cooking, or exploring the intersection of technology and human creativity.
                </p>
              </div>
            </section>

            {/* Purple House Story */}
            <section className="animate-slide-up">
              <h2 className="text-3xl font-light text-foreground mb-8">The Purple House</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Growing up in a purple house taught me early that standing out isn't just acceptable—it's essential. 
                  That lesson has shaped every product decision I've made since, always asking: "How can this be unexpectedly delightful?"
                </p>
              </div>
            </section>

            {/* Philosophy Section */}
            <section className="animate-slide-up">
              <h2 className="text-3xl font-light text-foreground mb-8">Philosophy</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-6">
                  I believe great products are born from the intersection of user empathy, technical possibility, and business value. 
                  My role is to orchestrate these elements into experiences that feel both innovative and inevitable.
                </p>
                <p>
                  In the age of AI, I'm particularly interested in how we can use these powerful tools to augment human creativity 
                  rather than replace it—building products that make people more capable, not more dependent.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Contact />
    </div>
  );
};

export default Capabilities;