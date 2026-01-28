import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Section, SectionHeader } from "@/components/Section";
import { useServices } from "@/hooks/use-services";
import { motion } from "framer-motion";
import { Home, Briefcase, PaintBucket, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Services() {
  const { data: services, isLoading } = useServices();

  const getIcon = (iconName: string | null) => {
    switch (iconName) {
      case "home": return <Home size={32} strokeWidth={1} />;
      case "business": return <Briefcase size={32} strokeWidth={1} />;
      case "renovation": return <PaintBucket size={32} strokeWidth={1} />;
      default: return <Home size={32} strokeWidth={1} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-40 pb-20 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display mb-6"
          >
            Services
          </motion.h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Comprehensive solutions for property owners in Hoi An.
          </p>
        </div>
      </section>

      <Section>
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-secondary animate-pulse rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services?.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center text-primary mb-6">
                  {getIcon(service.icon)}
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      <Section className="bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display mb-6">Ready to transform your space?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you need help managing your homestay or renovating an old property, we are here to help.
          </p>
          <Link href="/contact">
            <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white px-8">
              Let's Talk <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
