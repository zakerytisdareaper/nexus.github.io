import { Palette, MousePointer2, EyeOff, Check } from "lucide-react";
import { useSettings, THEMES, CURSORS, CLOAKS } from "@/contexts/SettingsContext";

export const SettingsView = () => {
  const { theme, cursor, cloak, setTheme, setCursor, setCloak } = useSettings();

  const openCloak = () => {
    const c = CLOAKS.find(x => x.id === cloak);
    if (!c || c.id === "none") return;
    const win = window.open("about:blank", "_blank");
    if (!win) return;
    win.document.write(`<!doctype html><html><head><title>${c.title}</title><link rel="icon" href="${c.favicon}"></head><body style="margin:0"><iframe src="${location.href}" style="border:0;width:100vw;height:100vh"></iframe></body></html>`);
  };

  return (
    <div className="container py-10 max-w-5xl">
      <header className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
          <span className="text-gradient">Settings</span>
        </h1>
        <p className="text-muted-foreground">Personalize your Nexus experience.</p>
      </header>

      {/* THEMES */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl font-bold">Themes</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {THEMES.map(t => {
            const active = t.id === theme;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`relative glass rounded-2xl p-5 text-left transition-smooth hover:scale-[1.02] ${active ? "ring-2 ring-primary shadow-glow" : ""}`}
              >
                <div className="flex gap-1.5 mb-3">
                  {t.swatch.map((s, i) => (
                    <span key={i} className="w-8 h-8 rounded-lg" style={{ background: `hsl(${s})` }} />
                  ))}
                </div>
                <div className="font-semibold">{t.name}</div>
                {active && (
                  <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* CURSORS */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <MousePointer2 className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl font-bold">Custom Cursor</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {CURSORS.map(c => {
            const active = c.id === cursor;
            return (
              <button
                key={c.id}
                onClick={() => setCursor(c.id)}
                style={{ cursor: c.css }}
                className={`glass rounded-xl p-4 text-center transition-smooth hover:bg-muted ${active ? "ring-2 ring-primary" : ""}`}
              >
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-1">Hover me</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CLOAKING */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <EyeOff className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl font-bold">Tab Cloaking</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Disguises this tab's title and icon. Pick a cloak, then optionally open a new cloaked tab.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {CLOAKS.map(c => {
            const active = c.id === cloak;
            return (
              <button
                key={c.id}
                onClick={() => setCloak(c.id)}
                className={`glass rounded-xl p-4 flex items-center gap-3 transition-smooth hover:bg-muted text-left ${active ? "ring-2 ring-primary" : ""}`}
              >
                <img src={c.favicon} alt="" className="w-6 h-6 rounded" onError={(e) => ((e.currentTarget.style.visibility = "hidden"))} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.title}</div>
                </div>
                {active && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
        {cloak !== "none" && (
          <button
            onClick={openCloak}
            className="bg-gradient-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-lg shadow-glow hover:scale-105 transition-smooth"
          >
            Open cloaked tab
          </button>
        )}
      </section>
    </div>
  );
};