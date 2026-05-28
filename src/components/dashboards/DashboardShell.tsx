import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Eye, EyeOff } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { tabTransition } from "@/lib/animations";

export interface DashTab {
  id: string;
  label: string;
  icon: ReactNode;
  hint?: string;
  accent?: string;
}

interface Props {
  title: string;
  subtitle: string;
  tabs: DashTab[];
  active: string;
  onTab: (id: string) => void;
  children: ReactNode;
}

export default function DashboardShell({ title, subtitle, tabs, active, onTab, children }: Props) {
  const { user, logout, showWebsite, setShowWebsite, addAdminUsername, adminAllowList } = useAppStore();
  const [adminInput, setAdminInput] = useState("");

  const canManageAdmins = user?.role === "SUPER ADMIN" || user?.role === "FACULTY";

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col lg:flex-row">
      <aside className="lg:w-80 w-full lg:min-h-screen bg-[#050505] border-r border-white/5 flex flex-col p-6 gap-2">
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.4em] text-primary mb-1">// AUTHENTICATED</p>
          <h1 className="font-display text-3xl font-black italic uppercase tracking-tight gradient-text leading-none">
            {title}
          </h1>
          <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mt-2">{subtitle}</p>
        </div>

        <div className="glass-morphism rounded-2xl p-4 mb-4">
          <p className="text-[9px] tracking-[0.3em] text-white/40 uppercase">Operator</p>
          <p className="font-black uppercase italic text-lg">{user?.username}</p>
          <p className="text-[10px] tracking-[0.3em] text-accent mt-1">{user?.role}</p>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {tabs.map((t) => {
            const isActive = t.id === active;
            return (
              <button
                key={t.id}
                onClick={() => onTab(t.id)}
                className={`group text-left flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                  isActive
                    ? "bg-white/10 border-white/10"
                    : "bg-transparent border-transparent hover:bg-white/5"
                }`}
              >
                <span className={`text-${t.accent || "primary"}`}>{t.icon}</span>
                <span className="flex-1">
                  <span className="block text-sm font-black uppercase italic tracking-tight">{t.label}</span>
                  {t.hint && <span className="block text-[9px] tracking-[0.2em] text-white/40 uppercase">{t.hint}</span>}
                </span>
              </button>
            );
          })}
        </nav>

        {canManageAdmins && (
          <div className="glass-morphism rounded-2xl p-3 mt-2">
            <p className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-2">Add Admin</p>
            <div className="flex gap-2">
              <input
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
                placeholder="USERNAME"
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] tracking-widest uppercase outline-none focus:border-primary"
              />
              <button
                onClick={() => {
                  addAdminUsername(adminInput);
                  setAdminInput("");
                }}
                className="text-[10px] tracking-widest uppercase px-2 py-1.5 rounded-lg bg-primary/30 border border-primary/40"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {adminAllowList.map((a) => (
                <span key={a} className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowWebsite(!showWebsite)}
          className="flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-2xl border border-white/10 text-[10px] tracking-[0.3em] uppercase hover:bg-white/5"
        >
          {showWebsite ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showWebsite ? "Hide Web Preview" : "Live Web Preview"}
        </button>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-destructive/40 to-destructive/20 border border-destructive/30 text-[10px] tracking-[0.3em] uppercase"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 custom-scrollbar overflow-x-hidden">
        <AnimatePresence mode="wait">
          {showWebsite ? (
            <motion.div key="preview" {...tabTransition} className="h-full flex items-center justify-center">
              <div className="glass-morphism rounded-[3rem] p-12 text-center max-w-xl">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 animate-pulse-glow">
                  <Eye className="w-8 h-8" />
                </div>
                <p className="text-[10px] tracking-[0.4em] text-primary mb-2">// SIGNAL</p>
                <h2 className="font-display text-3xl font-black italic uppercase gradient-text">Live Web Interface Connected</h2>
                <p className="text-sm text-white/60 mt-3">
                  The public portal is rendered in a separate tab. Disable Live Web Preview to return to operator console.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div key={active} {...tabTransition}>{children}</motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
