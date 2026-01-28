import { Link } from "wouter";
import { Instagram, MapPin, Mail, Phone, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-display text-2xl font-bold text-background">INN HoiAn</h3>
            <p className="text-background/70 font-light leading-relaxed max-w-sm">
              Awakening the soul of a home. We craft spaces that feel personal, warm, and distinctly yours in the heart of Hoi An.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://www.instagram.com/inn.hoian"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-background"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a
                href="https://www.facebook.com/p/Inn-Hoi-An-61563765966382/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-background"
              >
                <Facebook size={20} strokeWidth={1.5} />
              </a>
            </div>

          </div>

          {/* Links */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="font-display text-lg mb-4 text-primary">Explore</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-background/70 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/journey" className="text-background/70 hover:text-primary transition-colors">Our Journey</Link></li>
              <li><Link href="/services" className="text-background/70 hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/blog" className="text-background/70 hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4 md:col-start-9">
            <h4 className="font-display text-lg mb-4 text-primary">Visit Us</h4>
            <ul className="space-y-4 text-background/70">
              <li className="flex items-start space-x-3">
                <MapPin className="mt-1 shrink-0" size={18} strokeWidth={1.5} />
                <span>Hoi An Ancient Town,<br />Quang Nam, Vietnam</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="shrink-0" size={18} strokeWidth={1.5} />
                <a href="mailto:hello@innhoian.com" className="hover:text-primary">innhoian@gmail.com</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="shrink-0" size={18} strokeWidth={1.5} />
                <a href="tel:+84905123456" className="hover:text-primary">090 480 07 99</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-white/40">
          <p>© {new Date().getFullYear()} INN HoiAn. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white/60">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/60">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
