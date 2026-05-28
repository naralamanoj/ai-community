import { motion } from "framer-motion";
import { Rocket, Eye, Target } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { fadeIn, staggerContainer } from "@/lib/animations";

export default function Department() {
  const { siteContent } = useAppStore();
  const cards = [
    { icon: Rocket, label: "At a Glance", body: siteContent.aboutDescription, accent: "from-primary to-secondary" },
    { icon: Eye, label: "Our Vision", body: siteContent.aboutVision, accent: "from-secondary to-accent" },
    { icon: Target, label: "Our Mission", body: siteContent.aboutMission, accent: "from-accent to-primary" },
  ];

  return (
    <section id="about" className="relative py-20 px-6">
      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={fadeIn("up")} className="text-center mb-10">
          <p className="text-[10px] tracking-[0.4em] text-primary mb-3">// SECTION 01</p>
          <h2 className="font-display text-5xl md:text-7xl font-black italic uppercase tracking-tight gradient-text">
            The Department
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              variants={fadeIn("up", i * 0.1)}
              whileHover={{ y: -6 }}
              className="glass-morphism rounded-3xl p-8 group relative overflow-hidden"
            >
              <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${c.accent} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`} />
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.accent} flex items-center justify-center mb-5`}>
                <c.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-2">{c.label}</p>
              <p className="text-base text-white/85 leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
