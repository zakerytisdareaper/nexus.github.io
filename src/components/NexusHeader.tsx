import { Zap } from "lucide-react";

interface Props {
  active: string;
  onChange: (id: string) => void;
}

const tabs = [
  { id: "home", label: "Home" },
  { id: "proxy", label: "Proxy" },
  { id: "games", label: "Games" },
  { id: "ai", label: "AI" },
  { id: "chat", label: "Chat" },
];

export const NexusHeader = ({ active, onChange }: Props) => (
  <header className="sticky top-0 z-50 glass">
    <div className="container flex h-16 items-center justify-between">
      <button onClick={() => onChange("home")} className="flex items-center gap-2 group">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary rounded-lg blur-md opacity-70 group-hover:opacity-100 transition-smooth" />
          <div className="relative bg-gradient-primary p-2 rounded-lg">
            <Zap className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
        </div>
        <span className="font-display text-xl font-bold tracking-tight">
          NEXUS<span className="text-gradient">PROXY</span>
        </span>
      </button>
      <nav className="hidden md:flex items-center gap-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
              active === t.id
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <select
        value={active}
        onChange={(e) => onChange(e.target.value)}
        className="md:hidden bg-muted text-foreground rounded-lg px-3 py-2 text-sm border border-border"
      >
        {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
      </select>
    </div>
  </header>
);