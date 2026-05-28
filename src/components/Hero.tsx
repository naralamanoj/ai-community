import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 180]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const { siteContent } = useAppStore();

  return (
    <section ref={ref} id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-16">
      <motion.div style={{ y, opacity }} className="relative z-10 text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neon-border text-[10px] tracking-[0.4em] uppercase text-primary mb-8"
        >
          <Sparkles className="w-3 h-3" /> NBKRIST · AI &amp; Data Science
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-black uppercase italic tracking-tighter leading-[0.85] glow-text gradient-text"
          style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}
        >
          {siteContent.heroSubtitle}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-sm md:text-base text-white/70 max-w-2xl mx-auto"
        >
          {siteContent.heroTitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex items-center justify-center"
        >
          <a
            href="#about"
            className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary via-secondary to-accent text-sm font-bold tracking-widest uppercase hover:scale-105 transition-transform"
          >
            Explore Department
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
