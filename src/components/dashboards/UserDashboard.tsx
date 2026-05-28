import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { User, Crown, Github, Linkedin, ExternalLink, Mail, Save, Plus, Trash2, FileText, History } from "lucide-react";
import { useAppStore } from "@/lib/store";
import DashboardShell, { type DashTab } from "./DashboardShell";

const TABS: DashTab[] = [
  { id: "profile", label: "My Profile", icon: <User className="w-4 h-4" /> },
  { id: "portfolio", label: "Portfolio Content", icon: <FileText className="w-4 h-4" />, accent: "secondary" },
  { id: "status", label: "Request Status", icon: <History className="w-4 h-4" />, accent: "accent" },
  { id: "root", label: "Root Authority", icon: <Crown className="w-4 h-4" />, accent: "accent" },
];

export default function UserDashboard() {
  const [tab, setTab] = useState("profile");
  return (
    <DashboardShell title="User" subtitle="Member Console" tabs={TABS} active={tab} onTab={setTab}>
      {tab === "profile" && <ProfileTab />}
      {tab === "portfolio" && <PortfolioTab />}
      {tab === "status" && <StatusTab />}
      {tab === "root" && <RootTab />}
    </DashboardShell>
  );
}

function ProfileTab() {
  const { user, users, updateMyProfile } = useAppStore();
  const me = users.find((u) => u.username === user?.username);
  const [draft, setDraft] = useState({
    bio: me?.bio || "",
    github: me?.github || "",
    linkedin: me?.linkedin || "",
    portfolio: me?.portfolio || "",
  });
  const [saved, setSaved] = useState(false);

  if (!me) return null;

  const isInternal = me.portfolio?.startsWith("/");

  const save = () => {
    updateMyProfile(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl">
      <p className="text-[10px] tracking-[0.4em] text-primary mb-2">// IDENTITY</p>
      <h2 className="font-display text-4xl md:text-6xl font-black italic uppercase tracking-tight gradient-text mb-8">
        My Profile
      </h2>

      <div className="glass-morphism rounded-[3rem] p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-32 h-32 shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-[2px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <span className="text-4xl font-black gradient-text">{me.username.slice(0, 2)}</span>
              </div>
            </div>
            <div className="absolute -inset-3 rounded-full bg-primary/30 blur-2xl -z-10 animate-pulse-glow" />
          </div>

          <div className="flex-1 w-full">
            <h3 className="font-display text-3xl font-black italic uppercase tracking-tight">{me.username}</h3>
            <span className="inline-block mt-2 text-[10px] tracking-[0.3em] px-3 py-1 rounded-full neon-border text-primary">{me.role}</span>

            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              <Field label="GitHub" value={draft.github} onChange={(v) => setDraft({ ...draft, github: v })} />
              <Field label="LinkedIn" value={draft.linkedin} onChange={(v) => setDraft({ ...draft, linkedin: v })} />
              <Field label="Portfolio URL" value={draft.portfolio} onChange={(v) => setDraft({ ...draft, portfolio: v })} className="sm:col-span-2" />
              <label className="block sm:col-span-2">
                <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-1">Bio</span>
                <textarea rows={3} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary resize-none" />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button onClick={save} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-xs font-bold tracking-widest uppercase">
                <Save className="w-3.5 h-3.5" /> Save Profile
              </button>
              {saved && <span className="text-xs text-primary tracking-widest uppercase">Saved ✓</span>}
              {me.github && (
                <a href={me.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-primary text-xs"><Github className="w-3.5 h-3.5" /> GitHub</a>
              )}
              {me.linkedin && (
                <a href={me.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-secondary text-xs"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</a>
              )}
              {me.portfolio && (
                isInternal ? (
                  <Link to={me.portfolio} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-accent text-xs">
                    Open Portfolio <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <a href={me.portfolio} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-accent text-xs">
                    Open Portfolio <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-8">
              {[
                { label: "AI Fluency", v: 78 },
                { label: "Community", v: 62 },
                { label: "Research", v: 45 },
              ].map((s, i) => (
                <div key={s.label} className="bg-black/40 rounded-2xl p-4 border border-white/5">
                  <p className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-2">{s.label}</p>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.v}%` }} transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }} className="h-full bg-gradient-to-r from-primary via-secondary to-accent" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioTab() {
  const { user, users, updateMyProfile } = useAppStore();
  const me = users.find((u) => u.username === user?.username);
  const [projects, setProjects] = useState(me?.projects || []);
  const [saved, setSaved] = useState(false);

  if (!me) return null;

  const update = (i: number, patch: Partial<{ title: string; body: string; link: string }>) => {
    setProjects(projects.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  };
  const add = () => setProjects([...projects, { title: "", body: "", link: "" }]);
  const remove = (i: number) => setProjects(projects.filter((_, idx) => idx !== i));
  const save = () => {
    updateMyProfile({ projects });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl">
      <p className="text-[10px] tracking-[0.4em] text-secondary mb-2">// PORTFOLIO</p>
      <h2 className="font-display text-4xl md:text-6xl font-black italic uppercase tracking-tight gradient-text mb-3">
        Portfolio Content
      </h2>
      <p className="text-xs text-white/50 mb-8">Manage the projects displayed on your /portfolio/{me.username.toLowerCase()} page.</p>

      <div className="space-y-3">
        {projects.length === 0 && (
          <div className="glass-morphism rounded-2xl p-8 text-center text-white/50 text-sm">
            No projects yet. Add one to populate your public portfolio.
          </div>
        )}
        {projects.map((p, i) => (
          <div key={i} className="glass-morphism rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] tracking-widest text-white/40 uppercase">Project {i + 1}</span>
              <button onClick={() => remove(i)} className="text-destructive/70 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
            <input value={p.title} placeholder="Title" onChange={(e) => update(i, { title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
            <textarea rows={2} value={p.body} placeholder="Short description" onChange={(e) => update(i, { body: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary resize-none" />
            <input value={p.link || ""} placeholder="Link (optional)" onChange={(e) => update(i, { link: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary" />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button onClick={add} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/30 border border-secondary/40 text-[10px] tracking-widest uppercase font-bold">
          <Plus className="w-3 h-3" /> Add Project
        </button>
        <button onClick={save} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-xs font-bold tracking-widest uppercase">
          <Save className="w-3.5 h-3.5" /> Save Portfolio
        </button>
        {saved && <span className="text-xs text-primary tracking-widest uppercase">Saved ✓</span>}
      </div>
    </div>
  );
}

function StatusTab() {
  const { requests, requestHistory, joinRequests, user } = useAppStore();
  const mine = requests.filter((r) => r.user === user?.username);
  const myHistory = requestHistory.filter((r) => r.user === user?.username);
  const myJoins = joinRequests.filter((j) => j.email && user && j.name.toUpperCase().includes(user.username.toUpperCase()));

  return (
    <div className="max-w-4xl">
      <p className="text-[10px] tracking-[0.4em] text-accent mb-2">// TRACKING</p>
      <h2 className="font-display text-4xl md:text-6xl font-black italic uppercase tracking-tight gradient-text mb-8">
        Request Status
      </h2>

      <Block title="In Review" empty="Nothing pending.">
        {mine.map((r) => (
          <Row key={r.id} type={r.type} time={r.timestamp} status="pending" />
        ))}
      </Block>

      <Block title="History" empty="No reviewed requests yet.">
        {myHistory.map((r) => (
          <Row key={r.id} type={r.type} time={r.reviewedAt || r.timestamp} status={r.status} />
        ))}
      </Block>

      <Block title="Join Requests" empty="No join requests linked.">
        {myJoins.map((j) => (
          <Row key={j.id} type={`JOIN · ${j.name}`} time={j.timestamp} status={j.status} />
        ))}
      </Block>
    </div>
  );
}

function Block({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const arr = Array.isArray(children) ? children : [children];
  const has = arr.filter(Boolean).length > 0;
  return (
    <div className="mb-8">
      <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-3">// {title}</p>
      <div className="glass-morphism rounded-2xl overflow-hidden">
        {has ? children : <div className="p-6 text-center text-white/40 text-xs tracking-widest uppercase">{empty}</div>}
      </div>
    </div>
  );
}

function Row({ type, time, status }: { type: string; time: number; status: "pending" | "approved" | "rejected" }) {
  const tone =
    status === "approved" ? "text-primary border-primary/30 bg-primary/10" :
    status === "rejected" ? "text-destructive border-destructive/30 bg-destructive/10" :
    "text-accent border-accent/30 bg-accent/10";
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-xs font-bold">{type}</p>
        <p className="text-[10px] tracking-widest text-white/40">{new Date(time).toLocaleString()}</p>
      </div>
      <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full border ${tone}`}>{status}</span>
    </div>
  );
}

function Field({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-1">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
    </label>
  );
}

function RootTab() {
  return (
    <div className="max-w-3xl">
      <p className="text-[10px] tracking-[0.4em] text-accent mb-2">// HIERARCHY</p>
      <h2 className="font-display text-4xl md:text-6xl font-black italic uppercase tracking-tight gradient-text mb-8">
        Root Authority
      </h2>
      <div className="glass-morphism rounded-[3rem] p-8">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-accent" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-accent">Super Admin</span>
        </div>
        <h3 className="font-display text-3xl font-black italic uppercase">NARALA MANOJ</h3>
        <p className="text-white/70 mt-2 text-sm">Founder · Web Tech Lead · Root Authority of the AI COMMUNITY portal.</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
            <p className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-1">Mail</p>
            <p className="text-sm flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary" /> clgevents7@gmail.com</p>
          </div>
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
            <p className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-1">Terminal ID</p>
            <p className="text-sm font-mono">root@manoj-007</p>
          </div>
        </div>
      </div>
    </div>
  );
}
