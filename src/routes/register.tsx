import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";

const NeuralNetwork = lazy(() => import("@/components/NeuralNetwork"));

const GOOGLE_FORM = "https://forms.gle/example";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — AI COMMUNITY" },
      { name: "description", content: "Join the AI COMMUNITY at NBKRIST. Sign up to access research, events, and the member network." },
      { property: "og:title", content: "Register — AI COMMUNITY" },
      { property: "og:description", content: "Apply to join the AI & Data Science network at NBKRIST." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <Suspense fallback={null}>
        <NeuralNetwork />
      </Suspense>
      <div className="relative z-10 max-w-xl mx-auto px-6 py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/60 hover:text-white mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to portal
        </Link>
        <div className="relative rounded-[2rem] overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent" />
          <div className="glass-strong rounded-[2rem] p-8 md:p-10">
            <p className="text-[10px] tracking-[0.4em] text-primary mb-2">// FORM 01</p>
            <h1 className="font-display text-4xl font-black italic uppercase tracking-tight gradient-text">Initiate Registration</h1>
            <p className="text-sm text-white/60 mt-2">Become part of the AI COMMUNITY at NBKRIST.</p>

            <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-4">
              <Field label="Full Name" placeholder="A. STUDENT" />
              <Field label="Roll Number" placeholder="22XXXAXXXX" />
              <div>
                <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-1.5">Department</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary">
                  <option>AI&amp;DS</option><option>CS</option><option>IT</option><option>Other</option>
                </select>
              </div>
              <Field label="Email" placeholder="you@institute.edu" type="email" />
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-xs font-bold tracking-widest uppercase hover:opacity-90">
                Initiate Registration
              </button>
              <a href={GOOGLE_FORM} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-[11px] tracking-widest uppercase text-white/50 hover:text-accent">
                Open official Google Form <ExternalLink className="w-3 h-3" />
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-1.5">{label}</label>
      <input {...rest} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-white/30" />
    </div>
  );
}
