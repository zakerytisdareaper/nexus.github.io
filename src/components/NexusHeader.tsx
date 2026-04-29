import { Zap, Sparkles, MessageCircle, Settings, LogOut } from "lucide-react";

interface Props {
  active: string;
  onChange: (id: string) => void;
  aiOpen: boolean;
  chatOpen: boolean;
  onToggleAI: () => void;
  onToggleChat: () => void;
  onSignOut?: () => void;
  username?: string | null;
}

const tabs = [
  { id: "home", label: "Home" },
  { id: "browser", label: "Browser" },
  { id: "games", label: "Games" },
  { id: "settings", label: "Settings" },
];

export const NexusHeader = ({ active, onChange, aiOpen, chatOpen, onToggleAI, onToggleChat, onSignOut, username }: Props) => (
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
          NƎXUS<span className="text-gradient"> · PRØXY</span>
        </span>
      </button>
      <nav className="hidden sm:flex items-center gap-1">
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
      <div className="flex items-center gap-1">
        <select
          value={active}
          onChange={(e) => onChange(e.target.value)}
          className="sm:hidden bg-muted text-foreground rounded-lg px-2 py-1.5 text-sm border border-border mr-1"
        >
          {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        <button
          onClick={onToggleAI}
          title="Nexus AI"
          className={`p-2 rounded-lg transition-smooth ${aiOpen ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
        ><Sparkles className="h-4 w-4" /></button>
        <button
          onClick={onToggleChat}
          title="Live Chat"
          className={`p-2 rounded-lg transition-smooth ${chatOpen ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
        ><MessageCircle className="h-4 w-4" /></button>
        <button
          onClick={() => onChange("settings")}
          title="Settings"
          className={`p-2 rounded-lg transition-smooth sm:hidden ${active === "settings" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
        ><Settings className="h-4 w-4" /></button>
        {username && (
          <span className="hidden md:inline text-xs text-muted-foreground px-2 truncate max-w-[120px]" title={username}>
            {username}
          </span>
        )}
        {onSignOut && (
          <button
            onClick={onSignOut}
            title="Sign out"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
          ><LogOut className="h-4 w-4" /></button>
        )}
      </div>
    </div>
  </header>
);