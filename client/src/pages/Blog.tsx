import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Blog() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-40 pb-20 flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-display mb-6 text-foreground">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Coming soon...
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
