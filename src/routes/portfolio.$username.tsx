import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Linkedin, ExternalLink, Mail } from "lucide-react";
import { useAppStore } from "@/lib/store";

const NeuralNetwork = lazy(() => import("@/components/NeuralNetwork"));

export const Route = createFileRoute("/portfolio/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.username.toUpperCase()} — AI COMMUNITY Portfolio` },
      { name: "description", content: `Portfolio of ${params.username} on the AI COMMUNITY network at NBKRIST.` },
      { property: "og:title", content: `${params.username.toUpperCase()} — AI COMMUNITY` },
      { property: "og:description", content: `Member portfolio — AI & Data Science · NBKRIST.` },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { username } = useParams({ from: "/portfolio/$username" });
  const { users } = useAppStore();
  const member = users.find((u) => u.username.toLowerCase() === username.toLowerCase());

  if (!member) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display text-5xl font-black italic uppercase gradient-text">Not Found</h1>
          <p className="text-white/60 mt-3 text-sm">No member portfolio for "{username}".</p>
          <Link to="/" className="inline-flex items-center gap-2 mt-6 text-xs tracking-widest uppercase text-primary">
            <ArrowLeft className="w-3 h-3" /> Back to portal
          </Link>
        </div>
      </div>
    );
  }

  const projects = member.projects && member.projects.length > 0
    ? member.projects
    : [
        { title: "Neural Sandbox", body: "Interactive playground for visualizing small networks in real time." },
        { title: "Vision Pipeline", body: "End-to-end CV stack tuned for low-bandwidth campus deployments." },
        { title: "Community OS", body: "Internal tooling powering AI COMMUNITY's events and member roster." },
      ];

  return (
    <div className="relative min-h-screen bg-black text-white">
      <Suspense fallback={null}><NeuralNetwork /></Suspense>
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/60 hover:text-white mb-10">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to portal
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] tracking-[0.4em] text-primary mb-3">// MEMBER</p>
          <h1
            className="font-display font-black italic uppercase tracking-tighter leading-[0.85] gradient-text glow-text"
            style={{ fontSize: "clamp(3rem, 10vw, 7rem)" }}
          >
            {member.username}
          </h1>
          <span className="inline-block mt-4 text-[10px] tracking-[0.3em] px-3 py-1 rounded-full neon-border text-primary">
            {member.role}
          </span>
          <p className="text-white/70 max-w-2xl mt-6">{member.bio}</p>

          <div className="flex flex-wrap gap-3 mt-6">
            {member.github && (
              <a href={member.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-primary text-xs">
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-secondary text-xs">
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
            {member.portfolio && !member.portfolio.startsWith("/") && (
              <a href={member.portfolio} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-xs font-bold tracking-widest uppercase">
                External Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>

        <section className="mt-20">
          <p className="text-[10px] tracking-[0.4em] text-accent mb-3">// WORK</p>
          <h2 className="font-display text-4xl md:text-5xl font-black italic uppercase tracking-tight gradient-text mb-8">
            Selected Projects
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {projects.map((p, i) => (
              <motion.div
                key={p.title + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-morphism rounded-3xl p-6"
              >
                <p className="text-[9px] tracking-[0.3em] text-white/40 uppercase">0{i + 1}</p>
                <h3 className="font-display font-black uppercase italic text-lg mt-2">{p.title}</h3>
                <p className="text-sm text-white/60 mt-2">{p.body}</p>
                {"link" in p && p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-3 text-[10px] tracking-widest uppercase text-accent">
                    Open <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20 glass-morphism rounded-[3rem] p-8 md:p-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-2">Contact</p>
            <p className="font-display text-2xl font-black italic uppercase">Let's build something.</p>
          </div>
          <a href={`mailto:${member.username.toLowerCase().replace(/\s+/g, "")}@aicommunity.dev`} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-xs font-bold tracking-widest uppercase">
            <Mail className="w-3.5 h-3.5" /> Reach out
          </a>
        </section>
      </div>
    </div>
  );
}
