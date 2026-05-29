import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SITE_CONTENT } from "@/data/department";
import { OFFICIAL_LEADERS } from "@/data/coordinators";

export type Role = "SUPER ADMIN" | "FACULTY" | "PANEL MEMBER" | "USER" | "";

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  navbarBrand: string;
  aboutDescription: string;
  aboutVision: string;
  aboutMission: string;
}

export interface Coordinator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  photo: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  portfolio?: string;
}

export interface AppUser {
  username: string;
  password: string;
  role: Role;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  bio?: string;
  projects?: { title: string; body: string; link?: string }[];
}

export type RequestStatus = "pending" | "approved" | "rejected";

export interface RequestItem {
  id: string;
  type: string;
  data: any;
  user: string;
  timestamp: number;
  status: RequestStatus;
  reviewedBy?: string;
  reviewedAt?: number;
}

export type FeedKind = "EVENT" | "POST" | "NEWS" | "HIGHLIGHT";

export interface FeedItem {
  id: string;
  kind: FeedKind;
  title: string;
  body: string;
  date: string; // ISO
  image?: string;
  link?: string;
  author: string;
}

export interface JoinRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  roll: string;
  year: string;
  branch: string;
  interests: string;
  motivation: string;
  github?: string;
  linkedin?: string;
  timestamp: number;
  status: RequestStatus;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target?: string;
  timestamp: number;
}

const SEED_USERS: AppUser[] = [
  { username: "MANOJ", password: "manoj@007", role: "SUPER ADMIN", portfolio: "https://manoj-nexus.netlify.app", github: "https://github.com/naralamanoj", linkedin: "https://linkedin.com/in/naralamanoj", bio: "Root authority. Web tech lead. Founder of AI COMMUNITY portal." },
  { username: "SIVAPRATHAP", password: "siva@007", role: "FACULTY", portfolio: "/portfolio/sivaprathap", bio: "Faculty mentor — AI & Data Science." },
  { username: "NARALA", password: "narala@007", role: "PANEL MEMBER", portfolio: "https://manoj-nexus.netlify.app", github: "https://github.com/naralamanoj", bio: "Panel member. Web architect." },
  { username: "SRINIVAS", password: "srinivas@007", role: "PANEL MEMBER", portfolio: "https://Portfoliobysrinu.netlify.app", bio: "Panel member. Vision systems." },
  { username: "LIKHITH", password: "likhith@007", role: "PANEL MEMBER", portfolio: "https://devlikhith.vercel.app/", bio: "Panel member. Design systems." },
  { username: "SIVATHMIKA", password: "sivathmika@007", role: "USER", portfolio: "https://sivathmika-01.github.io/sivathmika_portfolio-/", bio: "AI&DS student." },
  { username: "AMRUTHA VARSHINI", password: "varshini@007", role: "USER", portfolio: "https://my-portfolio-07-theta.vercel.app/", bio: "AI&DS student." },
  { username: "CHAITANYA", password: "chaitu@007", role: "USER", portfolio: "/portfolio/chaitanya", bio: "AI&DS student." },
];

const SEED_FEED: FeedItem[] = [];

interface AppState {
  isLoaded: boolean;
  user: { username: string; role: Role } | null;
  siteContent: SiteContent;
  coordinators: Coordinator[];
  users: AppUser[];
  requests: RequestItem[];
  requestHistory: RequestItem[];
  joinRequests: JoinRequest[];
  feed: FeedItem[];
  audit: AuditEntry[];
  showWebsite: boolean;
  showLogin: boolean;
  showJoin: boolean;
  adminAllowList: string[];

  setShowWebsite: (show: boolean) => void;
  setShowLogin: (show: boolean) => void;
  setShowJoin: (show: boolean) => void;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  submitRequest: (type: string, data: any) => Promise<void>;
  approveRequest: (request: RequestItem) => Promise<void>;
  rejectRequest: (request: RequestItem) => Promise<void>;
  updateSiteContentDirectly: (content: SiteContent) => Promise<void>;
  updateCoordinatorsDirectly: (coords: Coordinator[]) => Promise<void>;
  updateUsersDirectly: (users: AppUser[]) => Promise<void>;
  updateMyProfile: (patch: Partial<AppUser>) => void;
  addAdminUsername: (username: string) => void;

  addFeedItem: (item: Omit<FeedItem, "id" | "author" | "date"> & { date?: string }) => void;
  removeFeedItem: (id: string) => void;
  updateFeedItem: (id: string, patch: Partial<FeedItem>) => void;

  submitJoinRequest: (req: Omit<JoinRequest, "id" | "timestamp" | "status">) => void;
  setJoinStatus: (id: string, status: RequestStatus) => void;

  logAudit: (action: string, target?: string) => void;
}

function makeAudit(actor: string, action: string, target?: string): AuditEntry {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, actor, action, target, timestamp: Date.now() };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isLoaded: true,
      user: null,
      siteContent: DEFAULT_SITE_CONTENT,
      coordinators: OFFICIAL_LEADERS,
      users: SEED_USERS,
      requests: [],
      requestHistory: [],
      joinRequests: [],
      feed: SEED_FEED,
      audit: [],
      showWebsite: true,
      showLogin: false,
      showJoin: false,
      adminAllowList: ["MANOJ"],

      setShowWebsite: (show) => set({ showWebsite: show }),
      setShowLogin: (show) => set({ showLogin: show }),
      setShowJoin: (show) => set({ showJoin: show }),

      login: (username, password) => {
        const u = username.trim().toUpperCase();
        const match = get().users.find(
          (x) => x.username.toUpperCase() === u && x.password === password,
        );
        if (!match) return { ok: false, error: "Invalid credentials." };
        const role = u === "MANOJ" ? "SUPER ADMIN" : match.role;
        set({ user: { username: match.username, role }, showWebsite: false });
        set({ audit: [makeAudit(match.username, "LOGIN"), ...get().audit].slice(0, 500) });
        return { ok: true };
      },

      logout: () => {
        const u = get().user;
        if (u) set({ audit: [makeAudit(u.username, "LOGOUT"), ...get().audit].slice(0, 500) });
        set({ user: null, showWebsite: true });
      },

      submitRequest: async (type, data) => {
        const user = get().user;
        if (!user) return;
        const req: RequestItem = {
          id: Date.now().toString(),
          type,
          data,
          user: user.username,
          timestamp: Date.now(),
          status: "pending",
        };
        set({
          requests: [...get().requests, req],
          audit: [makeAudit(user.username, `REQUEST_${type}`), ...get().audit].slice(0, 500),
        });
      },

      approveRequest: async (request) => {
        const state = get();
        const actor = state.user?.username || "system";
        switch (request.type) {
          case "ADD_USER":
            set({ users: [...state.users, request.data] });
            break;
          case "DELETE_USER":
            set({ users: state.users.filter((u) => u.username !== request.data.username && u.username !== "MANOJ") });
            break;
          case "ADD_COORD":
            set({ coordinators: [...state.coordinators, request.data] });
            break;
          case "DELETE_COORD":
            set({ coordinators: state.coordinators.filter((c) => c.id !== request.data.id) });
            break;
          case "EDIT_COORD":
            set({ coordinators: state.coordinators.map((c) => (c.id === request.data.id ? request.data : c)) });
            break;
          case "EDIT_SITE":
            set({ siteContent: request.data });
            break;
        }
        const reviewed: RequestItem = { ...request, status: "approved", reviewedBy: actor, reviewedAt: Date.now() };
        set({
          requests: state.requests.filter((r) => r.id !== request.id),
          requestHistory: [reviewed, ...state.requestHistory].slice(0, 200),
          audit: [makeAudit(actor, `APPROVE_${request.type}`, request.user), ...state.audit].slice(0, 500),
        });
      },

      rejectRequest: async (request) => {
        const state = get();
        const actor = state.user?.username || "system";
        const reviewed: RequestItem = { ...request, status: "rejected", reviewedBy: actor, reviewedAt: Date.now() };
        set({
          requests: state.requests.filter((r) => r.id !== request.id),
          requestHistory: [reviewed, ...state.requestHistory].slice(0, 200),
          audit: [makeAudit(actor, `REJECT_${request.type}`, request.user), ...state.audit].slice(0, 500),
        });
      },

      updateSiteContentDirectly: async (content) => {
        const actor = get().user?.username || "system";
        set({
          siteContent: content,
          audit: [makeAudit(actor, "EDIT_SITE_DIRECT"), ...get().audit].slice(0, 500),
        });
      },
      updateCoordinatorsDirectly: async (coords) => {
        const actor = get().user?.username || "system";
        set({
          coordinators: coords,
          audit: [makeAudit(actor, "EDIT_COORDS_DIRECT"), ...get().audit].slice(0, 500),
        });
      },
      updateUsersDirectly: async (users) => {
        const safe = users.map((u) => (u.username === "MANOJ" ? { ...u, role: "SUPER ADMIN" as Role } : u));
        const actor = get().user?.username || "system";
        set({
          users: safe,
          audit: [makeAudit(actor, "EDIT_USERS_DIRECT"), ...get().audit].slice(0, 500),
        });
      },

      updateMyProfile: (patch) => {
        const me = get().user;
        if (!me) return;
        const users = get().users.map((u) =>
          u.username === me.username ? { ...u, ...patch, username: u.username, role: u.role } : u,
        );
        set({
          users,
          audit: [makeAudit(me.username, "EDIT_OWN_PROFILE"), ...get().audit].slice(0, 500),
        });
      },

      addAdminUsername: (username) => {
        const u = username.trim().toUpperCase();
        if (!u) return;
        const list = get().adminAllowList;
        if (!list.includes(u)) {
          const actor = get().user?.username || "system";
          set({
            adminAllowList: [...list, u],
            audit: [makeAudit(actor, "ADD_ADMIN_ALLOW", u), ...get().audit].slice(0, 500),
          });
        }
      },

      addFeedItem: (item) => {
        const actor = get().user?.username || "system";
        const it: FeedItem = {
          id: Date.now().toString(),
          author: actor,
          date: item.date || new Date().toISOString(),
          kind: item.kind,
          title: item.title,
          body: item.body,
          image: item.image,
          link: item.link,
        };
        set({
          feed: [it, ...get().feed],
          audit: [makeAudit(actor, `FEED_ADD_${item.kind}`, item.title), ...get().audit].slice(0, 500),
        });
      },
      removeFeedItem: (id) => {
        const actor = get().user?.username || "system";
        set({
          feed: get().feed.filter((f) => f.id !== id),
          audit: [makeAudit(actor, "FEED_REMOVE", id), ...get().audit].slice(0, 500),
        });
      },
      updateFeedItem: (id, patch) => {
        const actor = get().user?.username || "system";
        set({
          feed: get().feed.map((f) => (f.id === id ? { ...f, ...patch } : f)),
          audit: [makeAudit(actor, "FEED_EDIT", id), ...get().audit].slice(0, 500),
        });
      },

      submitJoinRequest: (req) => {
        const j: JoinRequest = { ...req, id: Date.now().toString(), timestamp: Date.now(), status: "pending" };
        set({
          joinRequests: [j, ...get().joinRequests],
          audit: [makeAudit(req.email, "JOIN_REQUEST", req.name), ...get().audit].slice(0, 500),
        });
      },
      setJoinStatus: (id, status) => {
        const actor = get().user?.username || "system";
        set({
          joinRequests: get().joinRequests.map((j) => (j.id === id ? { ...j, status } : j)),
          audit: [makeAudit(actor, `JOIN_${status.toUpperCase()}`, id), ...get().audit].slice(0, 500),
        });
      },

      logAudit: (action, target) => {
        const actor = get().user?.username || "system";
        set({ audit: [makeAudit(actor, action, target), ...get().audit].slice(0, 500) });
      },
    }),
    {
      name: "ai-community-store",
      partialize: (s) => ({
        user: s.user,
        showWebsite: s.showWebsite,
        siteContent: s.siteContent,
        coordinators: s.coordinators,
        users: s.users,
        requests: s.requests,
        requestHistory: s.requestHistory,
        joinRequests: s.joinRequests,
        feed: s.feed,
        audit: s.audit,
        adminAllowList: s.adminAllowList,
      }),
    },
  ),
);
