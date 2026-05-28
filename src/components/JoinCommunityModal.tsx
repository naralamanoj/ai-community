import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Send, Mail } from "lucide-react";
import { useAppStore } from "@/lib/store";

export const COMMUNITY_EMAIL = "clgevents7@gmail.com";

interface Props {
  open: boolean;
  onClose: () => void;
}

const INITIAL = {
  name: "",
  email: "",
  phone: "",
  roll: "",
  year: "2nd Year",
  branch: "AI & Data Science",
  interests: "",
  motivation: "",
  github: "",
  linkedin: "",
};

export default function JoinCommunityModal({ open, onClose }: Props) {
  const { submitJoinRequest } = useAppStore();
  const [form, setForm] = useState(INITIAL);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof typeof INITIAL, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const buildMail = () => {
    const subject = encodeURIComponent(`AI COMMUNITY — Join Request from ${form.name}`);
    const lines = [
      `Hello AI COMMUNITY team,`,
      ``,
      `I would like to join the NBKRIST AI COMMUNITY. My details:`,
      ``,
      `Name        : ${form.name}`,
      `Email       : ${form.email}`,
      `Phone       : ${form.phone}`,
      `Roll No.    : ${form.roll}`,
      `Year        : ${form.year}`,
      `Branch      : ${form.branch}`,
      `GitHub      : ${form.github || "-"}`,
      `LinkedIn    : ${form.linkedin || "-"}`,
      ``,
      `Areas of Interest:`,
      form.interests,
      ``,
      `Motivation:`,
      form.motivation,
      ``,
      `Thank you.`,
    ];
    const body = encodeURIComponent(lines.join("\n"));
    return `mailto:${COMMUNITY_EMAIL}?subject=${subject}&body=${body}`;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.roll.trim()) {
      setErr("Please fill all required fields.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setErr("Please enter a valid email address.");
      return;
    }
    submitJoinRequest(form);
    // Open the user's mail client pre-filled to clgevents7@gmail.com.
    window.location.href = buildMail();
    setSent(true);
  };

  const close = () => {
    setSent(false);
    setForm(INITIAL);
    setErr("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl glass-strong neon-border rounded-3xl p-8 my-8"
          >
            {sent ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
                <p className="text-[10px] tracking-[0.4em] text-primary mb-2">// REQUEST SENT</p>
                <h2 className="text-2xl font-black italic uppercase gradient-text mb-3">
                  Thanks, {form.name.split(" ")[0] || "Builder"}!
                </h2>
                <p className="text-sm text-white/70 max-w-md mx-auto">
                  Your join request was sent to <b className="text-primary">{COMMUNITY_EMAIL}</b>. The team
                  will review and revert. You can track status from your dashboard once added.
                </p>
                <a
                  href={`mailto:${COMMUNITY_EMAIL}`}
                  className="inline-flex items-center gap-2 mt-6 text-xs tracking-widest uppercase text-accent"
                >
                  <Mail className="w-3.5 h-3.5" /> {COMMUNITY_EMAIL}
                </a>
                <div className="mt-6">
                  <button
                    onClick={close}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-xs font-bold tracking-widest uppercase"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[10px] tracking-[0.4em] text-primary mb-2">// COMMUNITY ACCESS</p>
                <h2 className="text-2xl md:text-3xl font-black italic uppercase gradient-text mb-2">
                  Join AI COMMUNITY
                </h2>
                <p className="text-xs text-white/60 mb-6">
                  Fill the form. We email your request to{" "}
                  <b className="text-primary">{COMMUNITY_EMAIL}</b> and track its status for you.
                </p>

                <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
                  <Field label="Full Name *" value={form.name} onChange={(v) => set("name", v)} />
                  <Field label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} />
                  <Field label="Phone *" value={form.phone} onChange={(v) => set("phone", v)} />
                  <Field label="Roll No. *" value={form.roll} onChange={(v) => set("roll", v)} />
                  <Select label="Year" value={form.year} onChange={(v) => set("year", v)} options={["1st Year", "2nd Year", "3rd Year", "4th Year", "Alumni"]} />
                  <Select label="Branch" value={form.branch} onChange={(v) => set("branch", v)} options={["AI & Data Science", "CSE", "IT", "ECE", "Other"]} />
                  <Field label="GitHub (optional)" value={form.github} onChange={(v) => set("github", v)} placeholder="https://github.com/..." />
                  <Field label="LinkedIn (optional)" value={form.linkedin} onChange={(v) => set("linkedin", v)} placeholder="https://linkedin.com/in/..." />
                  <TextArea label="Areas of Interest" value={form.interests} onChange={(v) => set("interests", v)} placeholder="e.g. LLMs, Computer Vision, MLOps" className="sm:col-span-2" />
                  <TextArea label="Why do you want to join?" value={form.motivation} onChange={(v) => set("motivation", v)} placeholder="Tell us briefly..." className="sm:col-span-2" />

                  {err && <p className="text-xs text-destructive sm:col-span-2">{err}</p>}

                  <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row gap-3 mt-2">
                    <button
                      type="button"
                      onClick={close}
                      className="flex-1 py-3 rounded-xl border border-white/10 text-xs tracking-widest uppercase hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-xs font-bold tracking-widest uppercase hover:opacity-90"
                    >
                      <Send className="w-3.5 h-3.5" /> Send Join Request
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function baseClass() {
  return "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-white/30";
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-1.5">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={baseClass()} />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-1.5">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={baseClass()}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, className = "" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-1.5">{label}</span>
      <textarea rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={`${baseClass()} resize-none`} />
    </label>
  );
}
