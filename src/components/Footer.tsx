import { Brain, Mail, Phone, MapPin, Github, Linkedin, Instagram, Twitter } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function Footer() {
  const { siteContent } = useAppStore();
  return (
    <footer id="contact" className="relative border-t border-white/10 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-display font-black text-lg gradient-text">{siteContent.navbarBrand}</span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            {siteContent.aboutDescription}
          </p>
          <div className="flex items-center gap-3 mt-5">
            {[Github, Linkedin, Instagram, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary text-white/60 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-4">Quick Links</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><a href="#home" className="hover:text-primary">Home</a></li>
            <li><a href="#about" className="hover:text-primary">About</a></li>
            <li><a href="#feed" className="hover:text-primary">Events &amp; News</a></li>
            <li><a href="#coordinators" className="hover:text-primary">Coordinators</a></li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-4">Contact</p>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-primary" /> clgevents7@gmail.com</li>
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-secondary" /> 8106905004</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-accent" /> NBKRIST · AI&amp;DS Block</li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-4">Newsletter</p>
          <p className="text-sm text-white/60 mb-3">Get research drops and event invites.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              placeholder="your@email"
              className="flex-1 bg-black/40 border border-white/10 rounded-full px-4 py-2 text-xs outline-none focus:border-primary"
            />
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-xs font-bold uppercase tracking-widest">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-[10px] tracking-[0.3em] text-white/30 uppercase">
        © {new Date().getFullYear()} AI COMMUNITY · NBKRIST · Built with neural intent
      </div>
    </footer>
  );
}
