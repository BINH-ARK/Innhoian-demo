import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Section, SectionHeader } from "@/components/Section";
import { motion } from "framer-motion";

// Team data constant
const TEAM_MEMBERS = [
    { name: "Ten", role: "Founder & Creative Director", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop" },
    { name: "Ten", role: "Founder & Creative Director", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop" },
    { name: "Ten", role: "Founder & Creative Director", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop" },
    { name: "Ten", role: "Founder & Creative Director", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop" },
];

// Philosophy sections data
const PHILOSOPHY_SECTIONS = [
    {
        title: "Có tâm trong từng thao tác",
        description: "Mỗi công việc, dù nhỏ nhất, đều được thực hiện với sự cẩn trọng và tinh thần trách nhiệm cao.",
        detail: "Không chỉ để hoàn thành cho đúng quy trình, mà để làm cho tử tế — vì chúng tôi tin rằng chất lượng vận hành bền vững được tạo nên từ chính những chi tiết thầm lặng ấy.",
        image: "https://scontent.fdad1-1.fna.fbcdn.net/v/t39.30808-6/608420693_774125755729871_9011090017212011504_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=CWEX5nft3U8Q7kNvwEh0qYg&_nc_oc=AdmZJ3BLnsj_XIKJiuH-P-BWx4MHGR6C5lUXvNTWv2AiCAytIeXSfoCtHSOn-LAW3OU&_nc_zt=23&_nc_ht=scontent.fdad1-1.fna&_nc_gid=R8VM3HhDV39I05ERdrYJrA&oh=00_AfqlfOGGSGF6Av7zAnOS-jN3YFidnvN_qUcBG1CGPxn9Zg&oe=697ECB1E",
        imagePosition: "left"
    },
    {
        title: "Có gu trong từng góc nhỏ",
        description: "Mỗi góc không gian đều được chăm chút với sự tinh tế và cảm nhận thẩm mỹ nhất quán.",
        detail: "Không chỉ để đẹp về hình ảnh, mà để dễ ở, dễ sống và tạo cảm xúc tích cực — để mỗi vị khách đều cảm thấy thư thái và được trân trọng.",
        image: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTMyNjc2MDA2NDI0OTU0MzA3Mg%3D%3D/original/31eeb1bf-cc93-4b17-b9fd-f2a82401a8dc.jpeg?im_w=720",
        imagePosition: "right"
    }
];

// Reusable philosophy section component
const PhilosophySection = ({ section, index }: { section: typeof PHILOSOPHY_SECTIONS[0], index: number }) => {
    const isImageLeft = section.imagePosition === "left";

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${index > 0 ? 'mt-16' : ''}`}>
            <div className={`relative ${isImageLeft ? 'order-1' : 'order-1 md:order-2'}`}>
                <img
                    src={section.image}
                    alt={section.title}
                    className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-accent/20 rounded-full -z-10 blur-3xl" />
            </div>
            <div className={isImageLeft ? 'order-2' : 'order-2 md:order-1'}>
                <SectionHeader title={section.title} />
                <div className="prose prose-lg text-muted-foreground">
                    {section.description}
                    <p className="mb-6">{section.detail}</p>
                </div>
            </div>
        </div>
    );
};

export default function About() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            {/* Header */}
            <section className="pt-40 pb-20 bg-secondary/20">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-display mb-6 text-foreground"
                    >
                        Có tâm trong từng thao tác
                        <br />
                        Có gu trong từng góc nhỏ
                    </motion.h1>
                </div>
            </section>

            {/* Philosophy */}
            <Section>
                {PHILOSOPHY_SECTIONS.map((section, idx) => (
                    <PhilosophySection key={section.title} section={section} index={idx} />
                ))}
            </Section>

            {/* Team */}
            <Section className="bg-white">
                <SectionHeader title="The People Behind INN" subtitle="Our Team" centered />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {TEAM_MEMBERS.map((member, idx) => (
                        <motion.div
                            key={`${member.name}-${idx}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center group"
                        >
                            <div className="aspect-[3/4] mb-4 overflow-hidden rounded-xl bg-secondary relative">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 saturate-0 group-hover:saturate-100"
                                />
                            </div>
                            <h3 className="text-xl font-display font-bold text-foreground">{member.name}</h3>
                            <p className="text-sm text-primary uppercase tracking-wider mt-1">{member.role}</p>
                        </motion.div>
                    ))}
                </div>
            </Section>

            <Footer />
        </div>
    );
}
