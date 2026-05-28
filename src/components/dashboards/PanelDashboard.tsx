import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, Palette, Users2, Star, Plus, Send, Trash2, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import DashboardShell, { type DashTab } from "./DashboardShell";

const TABS: DashTab[] = [
  { id: "queue", label: "My Proposals", icon: <Inbox className="w-4 h-4" />, hint: "In review" },
  { id: "branding", label: "Branding Stats", icon: <Palette className="w-4 h-4" /> },
  { id: "identity", label: "Identity Flow", icon: <Users2 className="w-4 h-4" /> },
  { id: "assets", label: "Strategic Assets", icon: <Star className="w-4 h-4" />, accent: "accent" },
];

export default function PanelDashboard() {
  const [tab, setTab] = useState("queue");
  const [toast, setToast] = useState("");

  const fireToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  return (
    <>
      <DashboardShell title="Panel Member" subtitle="Proposal Console" tabs={TABS} active={tab} onTab={setTab}>
        {tab === "queue" && <MyProposals />}
        {tab === "branding" && <BrandingProposal onSent={() => fireToast("Branding proposal submitted")} />}
        {tab === "identity" && <IdentityFlow onSent={() => fireToast("Identity proposal submitted")} />}
        {tab === "assets" && <AssetsFlow onSent={() => fireToast("Asset proposal submitted")} />}
      </DashboardShell>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[100] glass-strong neon-border rounded-2xl px-5 py-3 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-xs tracking-widest uppercase">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="text-[10px] tracking-[0.4em] text-accent mb-2">// {kicker}</p>
      <h2 className="font-display text-4xl md:text-6xl font-black italic uppercase tracking-tight gradient-text">{title}</h2>
    </div>
  );
}

function MyProposals() {
  const { requests, user } = useAppStore();
  const mine = requests.filter((r) => r.user === user?.username);
  return (
    <div>
      <SectionHeader kicker="REVIEW" title="My Proposals" />
      {mine.length === 0 ? (
        <div className="glass-morphism rounded-[2rem] p-12 text-center text-white/50">No proposals in review.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {mine.map((r) => (
            <div key={r.id} className="glass-morphism rounded-[2rem] p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.3em] text-secondary uppercase">{r.type}</span>
                <span className="text-[10px] tracking-widest uppercase text-accent inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" /> In Review
                </span>
              </div>
              <pre className="text-[10px] font-mono bg-black/40 rounded-xl p-3 overflow-auto max-h-40 text-white/70 custom-scrollbar">
{JSON.stringify(r.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BrandingProposal({ onSent }: { onSent: () => void }) {
  const { siteContent, submitRequest } = useAppStore();
  const [draft, setDraft] = useState(siteContent);
  return (
    <div>
      <SectionHeader kicker="PROPOSE" title="Branding Stats" />
      <div className="glass-morphism rounded-[2rem] p-8 max-w-3xl space-y-4">
        {(["navbarBrand", "heroSubtitle", "heroTitle", "aboutVision", "aboutMission", "aboutDescription"] as const).map((k) => (
          <div key={k}>
            <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-1">{k}</label>
            <textarea
              rows={k.startsWith("about") ? 3 : 1}
              value={draft[k]}
              onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary resize-none"
            />
          </div>
        ))}
        <button
          onClick={async () => { await submitRequest("EDIT_SITE", draft); onSent(); }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-primary text-xs font-bold tracking-widest uppercase"
        >
          <Send className="w-4 h-4" /> Push Proposal
        </button>
      </div>
    </div>
  );
}

function IdentityFlow({ onSent }: { onSent: () => void }) {
  const { users, submitRequest } = useAppStore();
  const propose = async () => {
    const username = prompt("Username (uppercase)")?.trim().toUpperCase();
    const password = prompt("Password");
    if (!username || !password) return;
    await submitRequest("ADD_USER", { username, password, role: "USER" });
    onSent();
  };
  return (
    <div>
      <SectionHeader kicker="PROPOSE" title="Identity Flow" />
      <button onClick={propose} className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/30 border border-accent/40 text-[10px] tracking-widest uppercase font-bold">
        <Plus className="w-3 h-3" /> Propose Identity
      </button>
      <div className="glass-morphism rounded-[2rem] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-[10px] tracking-[0.3em] uppercase text-white/40">
            <tr><th className="text-left p-3">Username</th><th className="text-left p-3">Role</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.username} className="border-t border-white/5">
                <td className="p-3 font-bold uppercase">{u.username}</td>
                <td className="p-3 text-white/60">{u.role}</td>
                <td className="p-3 text-right">
                  {u.username !== "MANOJ" && (
                    <button
                      onClick={async () => { await submitRequest("DELETE_USER", { username: u.username }); onSent(); }}
                      className="text-destructive/80 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AssetsFlow({ onSent }: { onSent: () => void }) {
  const { coordinators, submitRequest } = useAppStore();
  const propose = async () => {
    const name = prompt("Name (UPPER)")?.trim();
    const role = prompt("Role")?.trim();
    if (!name || !role) return;
    await submitRequest("ADD_COORD", {
      id: Date.now().toString(),
      name,
      role,
      avatar: name.slice(0, 2).toUpperCase(),
      photo: "",
    });
    onSent();
  };
  return (
    <div>
      <SectionHeader kicker="PROPOSE" title="Strategic Assets" />
      <button onClick={propose} className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/30 border border-accent/40 text-[10px] tracking-widest uppercase font-bold">
        <Plus className="w-3 h-3" /> Propose Asset
      </button>
      <div className="glass-morphism rounded-[2rem] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-[10px] tracking-[0.3em] uppercase text-white/40">
            <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Role</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {coordinators.map((c) => (
              <tr key={c.id} className="border-t border-white/5">
                <td className="p-3 font-bold uppercase">{c.name}</td>
                <td className="p-3 text-white/60 uppercase">{c.role}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={async () => { await submitRequest("DELETE_COORD", { id: c.id }); onSent(); }}
                    className="text-destructive/80 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
