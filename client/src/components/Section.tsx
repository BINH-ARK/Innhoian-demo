import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  noPadding?: boolean;
}

export function Section({ children, className, id, noPadding = false }: SectionProps) {
  return (
    <section 
      id={id}
      className={cn(
        "relative", 
        !noPadding && "py-16 md:py-24",
        className
      )}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({ title, subtitle, centered = false }: { title: string; subtitle?: string; centered?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("mb-12 max-w-2xl", centered && "mx-auto text-center")}
    >
      {subtitle && (
        <span className="text-primary text-sm font-bold tracking-widest uppercase mb-3 block">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-foreground leading-tight">
        {title}
      </h2>
    </motion.div>
  );
}
