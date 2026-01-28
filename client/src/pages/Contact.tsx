import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Section, SectionHeader } from "@/components/Section";
import { useSubmitContact } from "@/hooks/use-contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, MapPin, Phone, Instagram, Send, Facebook, Music2 } from "lucide-react";
import { RiTiktokLine } from "react-icons/ri";


export default function Contact() {
  const { toast } = useToast();
  const mutation = useSubmitContact();

  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: InsertMessage) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Message Sent",
          description: "Thank you for reaching out. We'll get back to you soon.",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-40 pb-20 bg-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-display mb-6 text-foreground">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Info Side */}
          <div className="space-y-10">
            <div>
              <h3 className="text-2xl font-display font-bold mb-6">Get in touch</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you're interested in booking a stay, discussing a renovation project, or just want to say hello, our door is always open.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary p-3 rounded-full text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Visit Us</h4>
                  <p className="text-muted-foreground">Hoi An Ancient Town,<br />Quang Nam, Vietnam</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-secondary p-3 rounded-full text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Email Us</h4>
                  <a href="mailto:hello@innhoian.com" className="text-muted-foreground hover:text-primary transition-colors">hello@innhoian.com</a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-secondary p-3 rounded-full text-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Call Us</h4>
                  <a href="tel:+84905123456" className="text-muted-foreground hover:text-primary transition-colors">+84 905 123 456</a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <h4 className="font-bold text-foreground mb-4">Follow our journey</h4>
              <a
                href="https://www.instagram.com/inn.hoian"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium"
              >
                <Instagram size={20} />
                <span>@inn.hoian</span>
              </a>
              <br />
              <a
                href="https://www.facebook.com/profile.php?id=61563765966382"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium"
              >
                <Facebook size={20} />
                <span>Inn Hoi An</span>
              </a>
              <br />
              <a
                href="https://www.tiktok.com/@inn.vietnam?_r=1&_t=ZP-93NzhLyyULG"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium"
              >
                <RiTiktokLine size={20} />
                <span>@inn.vietnam</span>
              </a>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-border shadow-lg">
            <h3 className="text-2xl font-display font-bold mb-8">Send a message</h3>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Mango Nguyen" {...field} className="rounded-xl h-12 bg-secondary/10 border-border focus:ring-primary/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại </FormLabel>
                      <FormControl>
                        <Input placeholder="0901234567" {...field} className="rounded-xl h-12 bg-secondary/10 border-border focus:ring-primary/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="abc@gmail.com" {...field} className="rounded-xl h-12 bg-secondary/10 border-border focus:ring-primary/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhu cầu tư vấn</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Hãy nói cho cho chúng tôi biết kế hoạch chuyến đi của bạn ...."
                          className="min-h-[150px] rounded-xl bg-secondary/10 border-border resize-none focus:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full h-14 rounded-xl text-lg font-medium bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                >
                  {mutation.isPending ? "Sending..." : (
                    <>Send Message <Send className="ml-2 w-4 h-4" /></>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
