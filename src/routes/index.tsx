import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Newspaper } from "lucide-react";
import { useAppStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Department from "@/components/Department";
import Coordinators from "@/components/Coordinators";
import Feed from "@/components/Feed";
import Footer from "@/components/Footer";

const NeuralNetwork = lazy(() => import("@/components/NeuralNetwork"));
const SuperAdminDashboard = lazy(() => import("@/components/dashboards/SuperAdminDashboard"));
const FacultyDashboard = lazy(() => import("@/components/dashboards/FacultyDashboard"));
const PanelDashboard = lazy(() => import("@/components/dashboards/PanelDashboard"));
const UserDashboard = lazy(() => import("@/components/dashboards/UserDashboard"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NBKRIST AI Community — AI & Data Science Portal | NBKR AI" },
      { name: "description", content: "Official NBKRIST AI Community — the AI & Data Science portal of NBKR Institute. Events, news, coordinators, member portfolios, and join requests for NBKR AI Community." },
      { name: "keywords", content: "nbkrist ai community, ai community nbkrist, nbkrist community, nbkr ai community, nbkr community, nbkr ai, nbkrist ai, nbkrist artificial intelligence, nbkr data science, ai community nbkr, nbkrist ai and data science" },
      { property: "og:title", content: "NBKRIST AI Community — NBKR AI & Data Science" },
      { property: "og:description", content: "The official AI Community of NBKRIST — events, news, member portfolios and more." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "NBKRIST AI Community" },
      { name: "twitter:description", content: "Official portal of NBKR AI & Data Science Community." },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "NBKRIST AI Community",
          alternateName: ["NBKR AI Community", "NBKRIST AI & Data Science", "NBKR AI"],
          description: "Official AI & Data Science community at NBKR Institute of Science and Technology (NBKRIST).",
          url: "/",
          email: "clgevents7@gmail.com",
          parentOrganization: {
            "@type": "CollegeOrUniversity",
            name: "NBKR Institute of Science and Technology",
            alternateName: "NBKRIST",
          },
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { user, showWebsite, showLogin, showJoin } = useAppStore();
  const isDashboard = user && !showWebsite;
  const showBackground = !isDashboard && !showLogin && !showJoin;
  const [feedOpen, setFeedOpen] = useState(false);

  const dashFor = (role: string) => {
    switch (role) {
      case "SUPER ADMIN": return <SuperAdminDashboard />;
      case "FACULTY": return <FacultyDashboard />;
      case "PANEL MEMBER": return <PanelDashboard />;
      default: return <UserDashboard />;
    }
  };

  return (
    <div className="relative bg-black text-white min-h-screen">
      {showBackground && (
        <Suspense fallback={null}>
          <NeuralNetwork />
        </Suspense>
      )}

      {isDashboard ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-[1640px] mx-auto"
        >
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/40 text-xs tracking-widest uppercase">Booting console…</div>}>
            {dashFor(user!.role)}
          </Suspense>
        </motion.div>
      ) : (
        <div className="relative z-10">
          <Navbar />
          <Hero />
          <Department />
          <section className="py-10 px-6 flex justify-center">
            <button
              onClick={() => setFeedOpen((v) => !v)}
              aria-expanded={feedOpen}
              aria-controls="feed"
              className="group inline-flex items-center gap-3 glass-morphism rounded-full px-6 py-3 border border-white/10 hover:border-primary/50 transition-all"
            >
              <Newspaper className="w-4 h-4 text-primary" />
              <span className="text-[11px] tracking-[0.4em] uppercase">
                {feedOpen ? "Hide Events & News" : "Open Events & News"}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${feedOpen ? "rotate-180" : ""}`} />
            </button>
          </section>
          <AnimatePresence initial={false}>
            {feedOpen && (
              <motion.div
                key="feed"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <Feed />
              </motion.div>
            )}
          </AnimatePresence>
          <Coordinators />
          <Footer />
        </div>
      )}
    </div>
  );
}
