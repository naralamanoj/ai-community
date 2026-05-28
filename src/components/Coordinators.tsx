import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Github, Linkedin, Instagram, ExternalLink, Search } from "lucide-react";
import { useAppStore, type Coordinator } from "@/lib/store";
import { OFFICIAL_LEADERS } from "@/data/coordinators";
import { fadeIn, staggerContainer } from "@/lib/animations";

export default function Coordinators() {
  const { coordinators } = useAppStore();
  const source: Coordinator[] = coordinators.length ? coordinators : OFFICIAL_LEADERS;
  const [query, setQuery] = useState("");
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter(
      (c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q),
    );
  }, [source, query]);
  const [stars, setStars] = useState<{ x: number; y: number; s: number; o: number }[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 80 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 2 + 0.5,
        o: Math.random() * 0.6 + 0.2,
      })),
    );
  }, []);

  return (
    <section id="coordinators" className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((st, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse-glow"
            style={{
              left: `${st.x}%`,
              top: `${st.y}%`,
              width: st.s,
              height: st.s,
              opacity: st.o,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="relative max-w-7xl mx-auto"
      >
        <motion.div variants={fadeIn("up")} className="text-center mb-10">
          <p className="text-[10px] tracking-[0.4em] text-accent mb-3">// SECTION 04</p>
          <h2 className="font-display text-5xl md:text-7xl font-black italic uppercase tracking-tight gradient-text">
            Coordinators
          </h2>
        </motion.div>

        <motion.div variants={fadeIn("up", 0.05)} className="max-w-md mx-auto mb-10 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search coordinators by name or role…"
            className="w-full bg-black/40 border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm outline-none focus:border-primary placeholder:text-white/30"
            aria-label="Search coordinators"
          />
        </motion.div>

        {list.length === 0 ? (
          <div className="glass-morphism rounded-[2rem] p-12 text-center text-white/50 text-sm">
            No coordinators match "{query}".
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((c, i) => (
              <CoordCard key={c.id} coord={c} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}

function CoordCard({ coord, index }: { coord: Coordinator; index: number }) {
  const photo =
    coord.photo ||
    (coord.name === "NARALA MANOJ" ? "/MANOJN.jpg" : "");

  return (
    <motion.div
      variants={fadeIn("up", index * 0.08)}
      whileHover={{ rotateX: -6, rotateY: 6, scale: 1.02 }}
      style={{ transformPerspective: 1000 }}
      className="glass-morphism rounded-3xl p-6 relative group"
    >
      <div className="relative w-24 h-24 mb-5 mx-auto">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-[2px]">
          <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
            {photo ? (
              <img src={photo} alt={coord.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black gradient-text">{coord.avatar}</span>
            )}
          </div>
        </div>
        <div className="absolute -inset-2 rounded-full bg-primary/30 blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="text-center font-display font-black uppercase text-base tracking-tight">{coord.name}</h3>
      <p className="text-center text-[10px] tracking-[0.3em] text-accent mt-1 uppercase">
        @{coord.role.toLowerCase().replace(/\s+/g, "_")}
      </p>
      <div className="flex items-center justify-center gap-3 mt-5">
        {coord.github && (
          <a href={coord.github} target="_blank" rel="noreferrer" className="text-white/50 hover:text-primary">
            <Github className="w-4 h-4" />
          </a>
        )}
        {coord.linkedin && (
          <a href={coord.linkedin} target="_blank" rel="noreferrer" className="text-white/50 hover:text-secondary">
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {coord.instagram && (
          <a href={coord.instagram} target="_blank" rel="noreferrer" className="text-white/50 hover:text-accent">
            <Instagram className="w-4 h-4" />
          </a>
        )}
        {coord.portfolio && (
          <a href={coord.portfolio} target="_blank" rel="noreferrer" className="text-white/50 hover:text-white">
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
