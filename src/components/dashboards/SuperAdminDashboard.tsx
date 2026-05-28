import { useState } from "react";
import {
  Inbox, Palette, Users2, Star, Check, X, Plus, Trash2,
  Newspaper, ShieldAlert, UserPlus, ExternalLink,
} from "lucide-react";
import {
  useAppStore, type AppUser, type Coordinator, type Role,
  type FeedKind, type FeedItem, type RequestStatus,
} from "@/lib/store";
import DashboardShell, { type DashTab } from "./DashboardShell";

const TABS: DashTab[] = [
  { id: "queue", label: "Pending Queue", icon: <Inbox className="w-4 h-4" />, hint: "Requests", accent: "secondary" },
  { id: "joins", label: "Join Requests", icon: <UserPlus className="w-4 h-4" />, hint: "Members", accent: "accent" },
  { id: "feed", label: "Events & News", icon: <Newspaper className="w-4 h-4" />, hint: "Publish", accent: "primary" },
  { id: "branding", label: "Branding Stats", icon: <Palette className="w-4 h-4" />, hint: "Site content", accent: "primary" },
  { id: "users", label: "User Registry", icon: <Users2 className="w-4 h-4" />, hint: "Identity", accent: "primary" },
  { id: "team", label: "Team Assets", icon: <Star className="w-4 h-4" />, hint: "Coordinators", accent: "accent" },
  { id: "audit", label: "Audit Log", icon: <ShieldAlert className="w-4 h-4" />, hint: "Trail", accent: "secondary" },
];

export default function SuperAdminDashboard() {
  const [tab, setTab] = useState("queue");
  return (
    <DashboardShell
      title="Super Admin"
      subtitle="Root Console"
      tabs={TABS}
      active={tab}
      onTab={setTab}
    >
      {tab === "queue" && <QueueTab />}
      {tab === "joins" && <JoinsTab />}
      {tab === "feed" && <FeedTab />}
      {tab === "branding" && <BrandingTab />}
      {tab === "users" && <UsersTab />}
      {tab === "team" && <TeamTab />}
      {tab === "audit" && <AuditTab />}
    </DashboardShell>
  );
}

function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="text-[10px] tracking-[0.4em] text-primary mb-2">// {kicker}</p>
      <h2 className="font-display text-4xl md:text-6xl font-black italic uppercase tracking-tight gradient-text">
        {title}
      </h2>
    </div>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const map: Record<RequestStatus, string> = {
    pending: "bg-accent/20 text-accent border-accent/30",
    approved: "bg-primary/20 text-primary border-primary/30",
    rejected: "bg-destructive/20 text-destructive border-destructive/30",
  };
  return (
    <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full border ${map[status]}`}>
      {status}
    </span>
  );
}

function QueueTab() {
  const { requests, requestHistory, approveRequest, rejectRequest } = useAppStore();
  return (
    <div>
      <SectionHeader kicker="INBOX" title="Pending Queue" />
      {requests.length === 0 ? (
        <div className="glass-morphism rounded-[2rem] p-12 text-center text-white/50">No pending proposals.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {requests.map((r) => (
            <div key={r.id} className="glass-morphism rounded-[2rem] p-6 border-l-2 border-secondary">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.3em] text-secondary uppercase">{r.type}</span>
                <span className="text-[9px] tracking-widest text-white/40">{new Date(r.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-xs text-white/60 mb-3">By <b className="text-white">{r.user}</b></p>
              <pre className="text-[10px] font-mono bg-black/40 rounded-xl p-3 overflow-auto max-h-32 text-white/70 custom-scrollbar">
{JSON.stringify(r.data, null, 2)}
              </pre>
              <div className="flex gap-2 mt-4">
                <button onClick={() => approveRequest(r)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-primary/30 border border-primary/40 text-[10px] tracking-widest uppercase font-bold">
                  <Check className="w-3 h-3" /> Approve
                </button>
                <button onClick={() => rejectRequest(r)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-destructive/30 border border-destructive/40 text-[10px] tracking-widest uppercase font-bold">
                  <X className="w-3 h-3" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {requestHistory.length > 0 && (
        <div className="mt-12">
          <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-3">// HISTORY</p>
          <div className="glass-morphism rounded-[2rem] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-[10px] tracking-[0.3em] uppercase text-white/40">
                <tr><th className="p-3 text-left">Type</th><th className="p-3 text-left">By</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Reviewed</th></tr>
              </thead>
              <tbody>
                {requestHistory.slice(0, 30).map((r) => (
                  <tr key={r.id} className="border-t border-white/5">
                    <td className="p-3 text-xs">{r.type}</td>
                    <td className="p-3 text-xs">{r.user}</td>
                    <td className="p-3"><StatusBadge status={r.status} /></td>
                    <td className="p-3 text-xs text-white/40">{r.reviewedAt ? new Date(r.reviewedAt).toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function JoinsTab() {
  const { joinRequests, setJoinStatus } = useAppStore();
  return (
    <div>
      <SectionHeader kicker="MEMBERS" title="Join Requests" />
      {joinRequests.length === 0 ? (
        <div className="glass-morphism rounded-[2rem] p-12 text-center text-white/50">No join requests yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {joinRequests.map((j) => (
            <div key={j.id} className="glass-morphism rounded-[2rem] p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-black uppercase italic">{j.name}</h3>
                <StatusBadge status={j.status} />
              </div>
              <div className="text-xs text-white/70 space-y-1">
                <p><span className="text-white/40">EMAIL</span> · {j.email}</p>
                <p><span className="text-white/40">PHONE</span> · {j.phone}</p>
                <p><span className="text-white/40">ROLL</span> · {j.roll} · {j.year} · {j.branch}</p>
                {j.interests && <p><span className="text-white/40">INTEREST</span> · {j.interests}</p>}
                {j.motivation && <p className="text-white/60 italic mt-2">"{j.motivation}"</p>}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setJoinStatus(j.id, "approved")} className="flex-1 py-2 rounded-xl bg-primary/30 border border-primary/40 text-[10px] tracking-widest uppercase font-bold">Approve</button>
                <button onClick={() => setJoinStatus(j.id, "rejected")} className="flex-1 py-2 rounded-xl bg-destructive/30 border border-destructive/40 text-[10px] tracking-widest uppercase font-bold">Reject</button>
                <a href={`mailto:${j.email}`} className="px-3 py-2 rounded-xl border border-white/10 text-[10px] tracking-widest uppercase inline-flex items-center gap-1"><ExternalLink className="w-3 h-3" /></a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const KINDS: FeedKind[] = ["EVENT", "POST", "NEWS", "HIGHLIGHT"];
const EMPTY_FEED = { kind: "EVENT" as FeedKind, title: "", body: "", image: "", link: "" };

function FeedTab() {
  const { feed, addFeedItem, removeFeedItem, updateFeedItem } = useAppStore();
  const [draft, setDraft] = useState(EMPTY_FEED);

  const submit = () => {
    if (!draft.title.trim() || !draft.body.trim()) return;
    addFeedItem(draft);
    setDraft(EMPTY_FEED);
  };

  return (
    <div>
      <SectionHeader kicker="PUBLISH" title="Events & News" />

      <div className="glass-morphism rounded-[2rem] p-6 max-w-3xl mb-8 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-1">Type</span>
            <select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as FeedKind })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary">
              {KINDS.map((k) => <option key={k}>{k}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-1">Title</span>
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
        </div>
        <label className="block">
          <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-1">Body</span>
          <textarea rows={3} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary resize-none" />
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-1">Image URL (optional)</span>
            <input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="https://..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <label className="block">
            <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-1">Link (optional)</span>
            <input value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} placeholder="https://..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
        </div>
        <button onClick={submit} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-xs font-bold tracking-widest uppercase">
          <Plus className="w-3.5 h-3.5" /> Publish to Feed
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {feed.map((f: FeedItem) => (
          <div key={f.id} className="glass-morphism rounded-2xl p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[9px] tracking-[0.3em] text-primary uppercase">{f.kind}</span>
                <h4 className="font-display font-black uppercase italic mt-1">{f.title}</h4>
              </div>
              <button onClick={() => removeFeedItem(f.id)} className="text-destructive/70 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
            <textarea
              value={f.body}
              onChange={(e) => updateFeedItem(f.id, { body: e.target.value })}
              rows={2}
              className="w-full mt-2 bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white/70 resize-none outline-none focus:border-primary"
            />
            <p className="text-[9px] tracking-widest text-white/40 uppercase mt-2">@{f.author} · {new Date(f.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandingTab() {
  const { siteContent, updateSiteContentDirectly } = useAppStore();
  const [draft, setDraft] = useState(siteContent);
  return (
    <div>
      <SectionHeader kicker="SIGNAL" title="Branding Stats" />
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
        <button onClick={() => updateSiteContentDirectly(draft)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-xs font-bold tracking-widest uppercase">
          Push to Network
        </button>
      </div>
    </div>
  );
}

function UsersTab() {
  const { users, updateUsersDirectly } = useAppStore();

  const update = (i: number, patch: Partial<AppUser>) => {
    const next = users.map((u, idx) => (idx === i ? { ...u, ...patch } : u));
    updateUsersDirectly(next);
  };
  const remove = (username: string) => {
    if (username === "MANOJ") return;
    updateUsersDirectly(users.filter((u) => u.username !== username));
  };
  const add = () => {
    const username = prompt("Username (uppercase)")?.trim().toUpperCase();
    const password = prompt("Password");
    if (!username || !password) return;
    updateUsersDirectly([...users, { username, password, role: "USER" }]);
  };

  return (
    <div>
      <SectionHeader kicker="IDENTITY" title="User Registry" />
      <button onClick={add} className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/30 border border-primary/40 text-[10px] tracking-widest uppercase font-bold">
        <Plus className="w-3 h-3" /> Commission Identity
      </button>
      <div className="glass-morphism rounded-[2rem] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-[10px] tracking-[0.3em] uppercase text-white/40">
            <tr><th className="text-left p-3">Username</th><th className="text-left p-3">Password</th><th className="text-left p-3">Role</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.username} className="border-t border-white/5">
                <td className="p-2"><input value={u.username} onChange={(e) => update(i, { username: e.target.value })} className="bg-transparent w-full px-2 py-1 rounded uppercase font-bold" disabled={u.username === "MANOJ"} /></td>
                <td className="p-2"><input value={u.password} onChange={(e) => update(i, { password: e.target.value })} className="bg-transparent w-full px-2 py-1 rounded" /></td>
                <td className="p-2">
                  <select value={u.role} onChange={(e) => update(i, { role: e.target.value as Role })} disabled={u.username === "MANOJ"} className="bg-black border border-white/10 rounded px-2 py-1 text-xs">
                    <option>SUPER ADMIN</option><option>FACULTY</option><option>PANEL MEMBER</option><option>USER</option>
                  </select>
                </td>
                <td className="p-2 text-right">
                  {u.username !== "MANOJ" && (
                    <button onClick={() => remove(u.username)} className="text-destructive/80 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
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

function TeamTab() {
  const { coordinators, updateCoordinatorsDirectly } = useAppStore();
  const update = (i: number, patch: Partial<Coordinator>) => {
    const next = coordinators.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    updateCoordinatorsDirectly(next);
  };
  const remove = (id: string) => updateCoordinatorsDirectly(coordinators.filter((c) => c.id !== id));
  const add = () => {
    const name = prompt("Name (UPPER)")?.trim();
    const role = prompt("Role (e.g. RESEARCH LEAD)")?.trim();
    if (!name || !role) return;
    updateCoordinatorsDirectly([
      ...coordinators,
      { id: Date.now().toString(), name, role, avatar: name.slice(0, 2).toUpperCase(), photo: "" },
    ]);
  };

  return (
    <div>
      <SectionHeader kicker="ASSETS" title="Team Assets" />
      <button onClick={add} className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/30 border border-accent/40 text-[10px] tracking-widest uppercase font-bold">
        <Plus className="w-3 h-3" /> Deploy Asset
      </button>
      <div className="glass-morphism rounded-[2rem] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-[10px] tracking-[0.3em] uppercase text-white/40">
            <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Role</th><th className="text-left p-3">Photo URL</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {coordinators.map((c, i) => (
              <tr key={c.id} className="border-t border-white/5">
                <td className="p-2"><input value={c.name} onChange={(e) => update(i, { name: e.target.value })} className="bg-transparent w-full px-2 py-1 rounded uppercase font-bold" /></td>
                <td className="p-2"><input value={c.role} onChange={(e) => update(i, { role: e.target.value })} className="bg-transparent w-full px-2 py-1 rounded uppercase" /></td>
                <td className="p-2"><input value={c.photo} onChange={(e) => update(i, { photo: e.target.value })} className="bg-transparent w-full px-2 py-1 rounded text-[11px]" placeholder="https://..." /></td>
                <td className="p-2 text-right"><button onClick={() => remove(c.id)} className="text-destructive/80 hover:text-destructive"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuditTab() {
  const { audit } = useAppStore();
  const [q, setQ] = useState("");
  const filtered = audit.filter(
    (a) => !q.trim() || [a.actor, a.action, a.target || ""].join(" ").toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div>
      <SectionHeader kicker="TRAIL" title="Audit Log" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by actor, action or target…"
        className="w-full max-w-md mb-4 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-white/30"
      />
      <div className="glass-morphism rounded-[2rem] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-[10px] tracking-[0.3em] uppercase text-white/40">
            <tr>
              <th className="p-3 text-left">When</th>
              <th className="p-3 text-left">Actor</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Target</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-white/50 text-xs">No audit entries.</td></tr>
            )}
            {filtered.map((a) => (
              <tr key={a.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="p-3 text-xs text-white/50">{new Date(a.timestamp).toLocaleString()}</td>
                <td className="p-3 text-xs font-bold uppercase">{a.actor}</td>
                <td className="p-3 text-xs"><span className="text-[10px] tracking-widest uppercase text-accent">{a.action}</span></td>
                <td className="p-3 text-xs text-white/60">{a.target || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
