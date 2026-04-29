import { useState } from "react";
import { Plus, X, ArrowLeft, ArrowRight, RotateCw, Lock, Home, ExternalLink, Globe } from "lucide-react";

type Tab = { id: string; title: string; url: string | null; input: string; key: number };

const QUICK = [
  { name: "Google", url: "https://www.google.com/search?igu=1" },
  { name: "DuckDuckGo", url: "https://duckduckgo.com" },
  { name: "Wikipedia", url: "https://en.wikipedia.org" },
  { name: "YouTube", url: "https://www.youtube.com" },
  { name: "Reddit", url: "https://www.reddit.com" },
  { name: "GitHub", url: "https://github.com" },
  { name: "Bing", url: "https://www.bing.com" },
  { name: "Twitch", url: "https://www.twitch.tv" },
];

const newTab = (): Tab => ({ id: crypto.randomUUID(), title: "New Tab", url: null, input: "", key: 0 });

const normalize = (raw: string): string => {
  const t = raw.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  if (t.includes(".") && !t.includes(" ")) return `https://${t}`;
  return `https://duckduckgo.com/?q=${encodeURIComponent(t)}`;
};

export const BrowserView = () => {
  const [tabs, setTabs] = useState<Tab[]>([newTab()]);
  const [activeId, setActiveId] = useState(tabs[0].id);
  const active = tabs.find(t => t.id === activeId)!;

  const update = (id: string, patch: Partial<Tab>) =>
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));

  const addTab = () => {
    const t = newTab();
    setTabs(prev => [...prev, t]);
    setActiveId(t.id);
  };

  const closeTab = (id: string) => {
    setTabs(prev => {
      const idx = prev.findIndex(t => t.id === id);
      const next = prev.filter(t => t.id !== id);
      if (next.length === 0) { const n = newTab(); setActiveId(n.id); return [n]; }
      if (id === activeId) setActiveId(next[Math.max(0, idx - 1)].id);
      return next;
    });
  };

  const navigate = (raw: string) => {
    const url = normalize(raw);
    if (!url) return;
    let host = "Page";
    try { host = new URL(url).hostname.replace(/^www\./, ""); } catch {}
    update(active.id, { url, input: url, title: host });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Tab strip */}
      <div className="flex items-end gap-1 px-2 pt-2 bg-background/40 overflow-x-auto">
        {tabs.map(t => (
          <div
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`group flex items-center gap-2 px-3 py-2 rounded-t-lg max-w-[200px] min-w-[120px] cursor-pointer text-sm transition-smooth ${
              t.id === activeId ? "glass border-b-0 text-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted/70"
            }`}
          >
            <Globe className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="truncate flex-1">{t.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); closeTab(t.id); }}
              className="opacity-50 hover:opacity-100 hover:text-destructive shrink-0"
            ><X className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        <button
          onClick={addTab}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
          title="New tab"
        ><Plus className="h-4 w-4" /></button>
      </div>

      {/* Address bar */}
      <div className="glass border-x-0 rounded-none flex items-center gap-2 px-3 py-2">
        <button
          onClick={() => history.back()}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
        ><ArrowLeft className="h-4 w-4" /></button>
        <button
          onClick={() => history.forward()}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
        ><ArrowRight className="h-4 w-4" /></button>
        <button
          onClick={() => active.url && update(active.id, { key: active.key + 1 })}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
        ><RotateCw className="h-4 w-4" /></button>
        <button
          onClick={() => update(active.id, { url: null, input: "", title: "New Tab" })}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
        ><Home className="h-4 w-4" /></button>

        <form
          onSubmit={(e) => { e.preventDefault(); navigate(active.input); }}
          className="flex-1 flex items-center bg-input rounded-full px-4 py-1.5 gap-2"
        >
          <Lock className="h-3.5 w-3.5 text-accent shrink-0" />
          <input
            value={active.input}
            onChange={(e) => update(active.id, { input: e.target.value })}
            placeholder="Search or enter address..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </form>

        {active.url && (
          <a
            href={active.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
            title="Open in new tab"
          ><ExternalLink className="h-4 w-4" /></a>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 bg-background/30 overflow-hidden">
        {active.url ? (
          <iframe
            key={`${active.id}-${active.key}`}
            src={active.url}
            title={active.title}
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-presentation allow-pointer-lock"
            className="w-full h-full bg-white border-0"
          />
        ) : (
          <div className="h-full overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
                <span className="text-gradient">Nexus</span> Browser
              </h1>
              <p className="text-muted-foreground mb-8">Type a URL or search above. Use the side panels for AI & chat.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                {QUICK.map(q => (
                  <button
                    key={q.name}
                    onClick={() => navigate(q.url)}
                    className="glass rounded-xl p-4 hover:scale-105 hover:shadow-blue transition-smooth"
                  >
                    <Globe className="h-5 w-5 mx-auto mb-2 text-accent" />
                    <div className="text-sm font-semibold">{q.name}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Tip: some sites block embedding — use <ExternalLink className="inline h-3 w-3" /> to open in a new tab.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};