import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-projects";
import { Section, SectionHeader } from "@/components/Section";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { data: projects, isLoading } = useProjects();
  const featuredProjects = projects?.filter(p => p.isFeatured) || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {/* cozy interior homestay warm light */}
          <img
            src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop"
            alt="Cozy Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs font-medium tracking-widest uppercase mb-6 bg-white/10 backdrop-blur-md">
              INN HoiAn
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium leading-tight mb-6 text-balance text-accent italic">
              Quản lý - Vận hành- Kinh doanh dịch vụ
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://www.airbnb.com/rooms/1182167046150344707?viralityEntryPoint=1&s=76">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-full px-8 h-14 text-base shadow-lg shadow-black/10">
                  Đặt lịch tư vấn                </Button>
              </a>
              <Link href="/about">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-full px-8 h-14 text-base backdrop-blur-sm">
                  Xem các dự án                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <Section className="bg-background">
        <SectionHeader
          title="Curated spaces for the soulful traveler"
          subtitle="Featured Stays"
          centered
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-secondary/30 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={project.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop"}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-primary tracking-widest uppercase">{project.type}</span>
                      {project.isFeatured && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                    </div>
                    <h3 className="text-2xl font-display mb-2 text-foreground group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {project.slogan || project.description}
                    </p>
                    <a
                      href={project.airbnbUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5"
                    >
                      Book on Airbnb <ArrowRight size={14} className="ml-1" />
                    </a>
                  </div>
                </motion.div>
              ))
            ) : (
              // Fallback if no data seeded yet
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                <p>Our beautiful homes are being prepared for you.</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/journey">
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 font-display text-lg">
              View all locations <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* Services Highlight */}
      <Section className="bg-secondary/30 border-y border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm font-bold tracking-widest uppercase mb-3 block">
                Our Expertise
              </span>
              <h2 className="text-4xl md:text-5xl font-display mb-6 leading-tight">
                More than just a place to sleep.
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                From breathing new life into old structures to managing seamless guest experiences, we offer full-spectrum services for property owners in Hoi An.
              </p>

              <ul className="space-y-4 mb-8">
                {["Homestay Operations", "Renovation & Design", "Business Strategy"].map((item) => (
                  <li key={item} className="flex items-center text-foreground font-medium">
                    <div className="w-2 h-2 rounded-full bg-primary mr-3" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/services">
                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8">
                  Explore Services
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="order-1 md:order-2 relative">
            <div className="aspect-square rounded-full overflow-hidden border-8 border-white shadow-2xl relative z-10 max-w-md mx-auto">
              {/* renovation minimalist interior design */}
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                alt="Renovation Service"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/20 rounded-full -z-0" />
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
