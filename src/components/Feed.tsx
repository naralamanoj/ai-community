import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Megaphone, Newspaper, Sparkles, ExternalLink } from "lucide-react";
import { useAppStore, type FeedKind } from "@/lib/store";
import { fadeIn, staggerContainer } from "@/lib/animations";

const FILTERS: { label: string; value: FeedKind | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Events", value: "EVENT" },
  { label: "Posts", value: "POST" },
  { label: "News", value: "NEWS" },
  { label: "Highlights", value: "HIGHLIGHT" },
];

const ICONS: Record<FeedKind, typeof Calendar> = {
  EVENT: Calendar,
  POST: Megaphone,
  NEWS: Newspaper,
  HIGHLIGHT: Sparkles,
};

export default function Feed() {
  const { feed } = useAppStore();
  const [filter, setFilter] = useState<FeedKind | "ALL">("ALL");

  const items = useMemo(
    () => (filter === "ALL" ? feed : feed.filter((f) => f.kind === filter)),
    [feed, filter],
  );

  return (
    <section id="feed" className="relative py-20 px-6">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={fadeIn("up")} className="text-center mb-10">
          <p className="text-[10px] tracking-[0.4em] text-secondary mb-3">// SECTION 03</p>
          <h2 className="font-display text-5xl md:text-7xl font-black italic uppercase tracking-tight gradient-text">
            Events &amp; News
          </h2>
          <p className="text-sm text-white/60 mt-3 max-w-xl mx-auto">
            Community events, posts, news drops and key highlights from NBKRIST AI COMMUNITY.
          </p>
        </motion.div>

        <motion.div variants={fadeIn("up", 0.1)} className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-[10px] tracking-[0.3em] uppercase px-4 py-2 rounded-full border transition-all ${
                filter === f.value
                  ? "bg-gradient-to-r from-primary to-accent border-transparent text-white"
                  : "border-white/10 text-white/60 hover:border-primary/50 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {items.length === 0 ? (
          <div className="glass-morphism rounded-[2rem] p-12 text-center text-white/50 text-sm">
            No items in this stream yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it, i) => {
              const Icon = ICONS[it.kind];
              return (
                <motion.article
                  key={it.id}
                  variants={fadeIn("up", i * 0.06)}
                  whileHover={{ y: -4 }}
                  className="glass-morphism rounded-3xl overflow-hidden group flex flex-col"
                >
                  {it.image && (
                    <div className="aspect-video overflow-hidden bg-black/40">
                      <img src={it.image} alt={it.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.3em] uppercase text-primary">
                        <Icon className="w-3 h-3" /> {it.kind}
                      </span>
                      <time className="text-[9px] tracking-widest text-white/40 uppercase">
                        {new Date(it.date).toLocaleDateString()}
                      </time>
                    </div>
                    <h3 className="font-display font-black uppercase italic text-lg leading-tight">{it.title}</h3>
                    <p className="text-sm text-white/65 mt-2 flex-1">{it.body}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      <span className="text-[9px] tracking-widest text-white/40 uppercase">@{it.author}</span>
                      {it.link && (
                        <a href={it.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase text-accent hover:text-primary">
                          Open <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </motion.div>
    </section>
  );
}
