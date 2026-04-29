import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeId = "nexus" | "midnight" | "neon" | "matrix" | "sunset" | "mono";
export type CursorId = "default" | "crosshair" | "pointer" | "neon" | "ghost";
export type CloakId = "none" | "google" | "classroom" | "drive" | "docs" | "canvas";

interface ThemeDef {
  id: ThemeId;
  name: string;
  vars: Record<string, string>;
  swatch: [string, string, string];
}

export const THEMES: ThemeDef[] = [
  {
    id: "nexus",
    name: "Nexus (Default)",
    vars: {
      "--background": "230 25% 5%",
      "--card": "232 25% 8%",
      "--popover": "232 28% 7%",
      "--primary": "252 90% 66%",
      "--secondary": "222 80% 56%",
      "--accent": "270 95% 70%",
      "--muted": "232 20% 14%",
      "--border": "232 25% 18%",
      "--input": "232 25% 14%",
      "--ring": "252 90% 66%",
      "--gradient-primary": "linear-gradient(135deg, hsl(252 90% 60%), hsl(220 100% 60%))",
      "--gradient-hero": "linear-gradient(135deg, hsl(270 95% 60%) 0%, hsl(220 100% 55%) 50%, hsl(252 90% 65%) 100%)",
      "--gradient-radial": "radial-gradient(circle at 30% 20%, hsl(270 95% 50% / 0.25), transparent 60%), radial-gradient(circle at 80% 80%, hsl(220 100% 55% / 0.25), transparent 60%)",
    },
    swatch: ["252 90% 66%", "270 95% 70%", "222 80% 56%"],
  },
  {
    id: "midnight",
    name: "Midnight",
    vars: {
      "--background": "220 30% 4%",
      "--card": "220 30% 7%",
      "--popover": "220 30% 6%",
      "--primary": "210 100% 60%",
      "--secondary": "200 90% 50%",
      "--accent": "190 95% 55%",
      "--muted": "220 25% 12%",
      "--border": "220 25% 18%",
      "--input": "220 25% 12%",
      "--ring": "210 100% 60%",
      "--gradient-primary": "linear-gradient(135deg, hsl(210 100% 55%), hsl(190 95% 50%))",
      "--gradient-hero": "linear-gradient(135deg, hsl(190 95% 55%), hsl(210 100% 55%), hsl(230 90% 60%))",
      "--gradient-radial": "radial-gradient(circle at 30% 20%, hsl(210 100% 50% / 0.25), transparent 60%), radial-gradient(circle at 80% 80%, hsl(190 95% 50% / 0.25), transparent 60%)",
    },
    swatch: ["210 100% 60%", "190 95% 55%", "200 90% 50%"],
  },
  {
    id: "neon",
    name: "Neon Pink",
    vars: {
      "--background": "300 30% 5%",
      "--card": "300 25% 8%",
      "--popover": "300 28% 7%",
      "--primary": "320 100% 65%",
      "--secondary": "280 95% 60%",
      "--accent": "180 100% 60%",
      "--muted": "300 20% 14%",
      "--border": "300 25% 18%",
      "--input": "300 25% 14%",
      "--ring": "320 100% 65%",
      "--gradient-primary": "linear-gradient(135deg, hsl(320 100% 60%), hsl(280 95% 55%))",
      "--gradient-hero": "linear-gradient(135deg, hsl(180 100% 55%), hsl(320 100% 60%), hsl(280 95% 60%))",
      "--gradient-radial": "radial-gradient(circle at 30% 20%, hsl(320 100% 50% / 0.3), transparent 60%), radial-gradient(circle at 80% 80%, hsl(180 100% 50% / 0.25), transparent 60%)",
    },
    swatch: ["320 100% 65%", "180 100% 60%", "280 95% 60%"],
  },
  {
    id: "matrix",
    name: "Matrix",
    vars: {
      "--background": "140 25% 4%",
      "--card": "140 25% 7%",
      "--popover": "140 25% 6%",
      "--primary": "140 100% 50%",
      "--secondary": "150 90% 45%",
      "--accent": "120 100% 55%",
      "--muted": "140 20% 12%",
      "--border": "140 25% 16%",
      "--input": "140 25% 12%",
      "--ring": "140 100% 50%",
      "--gradient-primary": "linear-gradient(135deg, hsl(140 100% 45%), hsl(120 100% 50%))",
      "--gradient-hero": "linear-gradient(135deg, hsl(120 100% 50%), hsl(140 100% 45%), hsl(160 90% 45%))",
      "--gradient-radial": "radial-gradient(circle at 30% 20%, hsl(140 100% 40% / 0.25), transparent 60%), radial-gradient(circle at 80% 80%, hsl(120 100% 40% / 0.2), transparent 60%)",
    },
    swatch: ["140 100% 50%", "120 100% 55%", "150 90% 45%"],
  },
  {
    id: "sunset",
    name: "Sunset",
    vars: {
      "--background": "20 25% 5%",
      "--card": "20 25% 8%",
      "--popover": "20 25% 7%",
      "--primary": "20 100% 60%",
      "--secondary": "350 90% 60%",
      "--accent": "40 100% 60%",
      "--muted": "20 20% 14%",
      "--border": "20 25% 18%",
      "--input": "20 25% 14%",
      "--ring": "20 100% 60%",
      "--gradient-primary": "linear-gradient(135deg, hsl(20 100% 55%), hsl(350 90% 55%))",
      "--gradient-hero": "linear-gradient(135deg, hsl(40 100% 55%), hsl(20 100% 55%), hsl(350 90% 55%))",
      "--gradient-radial": "radial-gradient(circle at 30% 20%, hsl(20 100% 50% / 0.3), transparent 60%), radial-gradient(circle at 80% 80%, hsl(350 90% 50% / 0.25), transparent 60%)",
    },
    swatch: ["20 100% 60%", "40 100% 60%", "350 90% 60%"],
  },
  {
    id: "mono",
    name: "Monochrome",
    vars: {
      "--background": "0 0% 5%",
      "--card": "0 0% 9%",
      "--popover": "0 0% 8%",
      "--primary": "0 0% 95%",
      "--secondary": "0 0% 70%",
      "--accent": "0 0% 80%",
      "--muted": "0 0% 15%",
      "--border": "0 0% 20%",
      "--input": "0 0% 14%",
      "--ring": "0 0% 95%",
      "--gradient-primary": "linear-gradient(135deg, hsl(0 0% 90%), hsl(0 0% 60%))",
      "--gradient-hero": "linear-gradient(135deg, hsl(0 0% 95%), hsl(0 0% 60%), hsl(0 0% 80%))",
      "--gradient-radial": "radial-gradient(circle at 30% 20%, hsl(0 0% 50% / 0.2), transparent 60%), radial-gradient(circle at 80% 80%, hsl(0 0% 70% / 0.15), transparent 60%)",
    },
    swatch: ["0 0% 95%", "0 0% 70%", "0 0% 40%"],
  },
];

export const CURSORS: { id: CursorId; name: string; css: string }[] = [
  { id: "default", name: "Default", css: "auto" },
  { id: "pointer", name: "Pointer", css: "pointer" },
  { id: "crosshair", name: "Crosshair", css: "crosshair" },
  {
    id: "neon",
    name: "Neon Dot",
    css: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='12' cy='12' r='5' fill='%23a855f7' stroke='white' stroke-width='2'/></svg>") 12 12, auto`,
  },
  {
    id: "ghost",
    name: "Ghost Ring",
    css: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'><circle cx='14' cy='14' r='10' fill='none' stroke='%2360a5fa' stroke-width='2'/><circle cx='14' cy='14' r='2' fill='%2360a5fa'/></svg>") 14 14, auto`,
  },
];

export const CLOAKS: { id: CloakId; name: string; title: string; favicon: string }[] = [
  { id: "none", name: "None (Nexus Proxy)", title: "NƎXUS · PRØXY", favicon: "/favicon.ico" },
  { id: "google", name: "Google", title: "Google", favicon: "https://www.google.com/favicon.ico" },
  { id: "classroom", name: "Google Classroom", title: "Home", favicon: "https://ssl.gstatic.com/classroom/favicon.png" },
  { id: "drive", name: "Google Drive", title: "My Drive - Google Drive", favicon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png" },
  { id: "docs", name: "Google Docs", title: "Docs", favicon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
  { id: "canvas", name: "Canvas", title: "Dashboard", favicon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico" },
];

interface SettingsState {
  theme: ThemeId;
  cursor: CursorId;
  cloak: CloakId;
  setTheme: (t: ThemeId) => void;
  setCursor: (c: CursorId) => void;
  setCloak: (c: CloakId) => void;
}

const Ctx = createContext<SettingsState | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeId>(() => (localStorage.getItem("nx-theme") as ThemeId) || "nexus");
  const [cursor, setCursor] = useState<CursorId>(() => (localStorage.getItem("nx-cursor") as CursorId) || "default");
  const [cloak, setCloak] = useState<CloakId>(() => (localStorage.getItem("nx-cloak") as CloakId) || "none");

  useEffect(() => {
    const def = THEMES.find(t => t.id === theme) ?? THEMES[0];
    const root = document.documentElement;
    Object.entries(def.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    localStorage.setItem("nx-theme", theme);
  }, [theme]);

  useEffect(() => {
    const def = CURSORS.find(c => c.id === cursor) ?? CURSORS[0];
    document.documentElement.style.cursor = def.css;
    localStorage.setItem("nx-cursor", cursor);
    return () => { document.documentElement.style.cursor = ""; };
  }, [cursor]);

  useEffect(() => {
    const def = CLOAKS.find(c => c.id === cloak) ?? CLOAKS[0];
    document.title = def.title;
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = def.favicon;
    localStorage.setItem("nx-cloak", cloak);
  }, [cloak]);

  return (
    <Ctx.Provider value={{ theme, cursor, cloak, setTheme, setCursor, setCloak }}>
      {children}
    </Ctx.Provider>
  );
};

export const useSettings = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSettings must be used within SettingsProvider");
  return v;
};