import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Brain, Menu, X, LogOut, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/lib/store";
import JoinCommunityModal from "./JoinCommunityModal";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Events", href: "#feed" },
  { label: "Coordinators", href: "#coordinators" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const clicks = useRef<number[]>([]);
  const { siteContent, user, login, logout } = useAppStore();

  const handleLogoClick = () => {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 800), now];
    if (clicks.current.length >= 3) {
      clicks.current = [];
      setShowLogin(true);
    }
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-gradient-to-r from-primary via-secondary to-accent"
        style={{ scaleX }}
      />
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 select-none cursor-pointer"
            aria-label="Brand · triple-tap to sign in"
            title="Triple-tap to sign in"
          >
            <div className="relative">
              <Brain className="w-7 h-7 text-primary" />
              <div className="absolute inset-0 blur-xl bg-primary/40 -z-10" />
            </div>
            <span className="font-display text-lg font-black tracking-tight gradient-text">
              {siteContent.navbarBrand}
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map((n) => (
              <a key={n.href} href={n.href} className="text-sm text-white/70 hover:text-white transition-colors">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-[10px] tracking-[0.2em] px-3 py-1.5 rounded-full neon-border text-primary">
                  {user.role}
                </span>
                <button
                  onClick={logout}
                  className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowJoin(true)}
                className="text-xs font-medium px-4 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
              >
                Join Community
              </button>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-white/10 glass-strong"
            >
              <div className="px-6 py-4 flex flex-col gap-3">
                {NAV_ITEMS.map((n) => (
                  <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-sm text-white/80">
                    {n.label}
                  </a>
                ))}
                {user ? (
                  <button onClick={logout} className="text-xs text-left text-white/60">
                    Sign out
                  </button>
                ) : (
                  <button onClick={() => { setShowJoin(true); setOpen(false); }} className="text-xs text-left text-primary">
                    Join Community
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} onSubmit={login} />
      <JoinCommunityModal open={showJoin} onClose={() => setShowJoin(false)} />
    </>
  );
}

function LoginModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (u: string, p: string) => { ok: boolean; error?: string };
}) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number>(0);

  const locked = Date.now() < lockedUntil;
  const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);

  const reset = () => {
    setU(""); setP(""); setErr(""); setShow(false); setBusy(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => { reset(); onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass-strong neon-border rounded-3xl p-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <p className="text-[10px] tracking-[0.4em] text-primary">// SECURE GATEWAY</p>
            </div>
            <h2 className="text-2xl font-black italic uppercase gradient-text mb-1">Authenticate</h2>
            <p className="text-[11px] text-white/50 mb-6">Encrypted local session · case-insensitive username</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (locked) return;
                setErr("");
                setBusy(true);
                // Tiny artificial delay smooths UX and discourages rapid brute-force.
                setTimeout(() => {
                  const res = onSubmit(u, p);
                  setBusy(false);
                  if (!res.ok) {
                    const next = attempts + 1;
                    setAttempts(next);
                    if (next >= 5) {
                      setLockedUntil(Date.now() + 30_000);
                      setErr("Too many attempts. Locked for 30s.");
                    } else {
                      setErr(`${res.error || "Access denied."} (${5 - next} attempts left)`);
                    }
                  } else {
                    setAttempts(0);
                    reset();
                    onClose();
                  }
                }, 250);
              }}
              className="space-y-4"
            >
              <input
                value={u}
                onChange={(e) => setU(e.target.value)}
                autoFocus
                autoComplete="username"
                placeholder="USERNAME"
                disabled={busy || locked}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm tracking-widest uppercase placeholder:text-white/30 focus:border-primary outline-none disabled:opacity-50"
              />
              <div className="relative">
                <input
                  value={p}
                  onChange={(e) => setP(e.target.value)}
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="PASSWORD"
                  disabled={busy || locked}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm placeholder:text-white/30 focus:border-primary outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {err && !locked && <p className="text-xs text-destructive">{err}</p>}
              {locked && <p className="text-xs text-destructive">Locked. Try again in {remaining}s.</p>}
              <button
                type="submit"
                disabled={busy || locked || !u || !p}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-sm font-bold tracking-widest uppercase hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating</> : "Initialize Session"}
              </button>
              <p className="text-[10px] text-center text-white/30 tracking-widest uppercase">
                No account yet? Use Join Community on the homepage.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
