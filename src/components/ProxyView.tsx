import { useState } from "react";
import { Globe, ArrowRight, ExternalLink, Lock } from "lucide-react";

const QUICK = [
  { name: "Google", url: "https://www.google.com/search?igu=1" },
  { name: "DuckDuckGo", url: "https://duckduckgo.com" },
  { name: "Wikipedia", url: "https://en.wikipedia.org" },
  { name: "YouTube", url: "https://www.youtube.com" },
  { name: "Reddit", url: "https://www.reddit.com" },
  { name: "GitHub", url: "https://github.com" },
];

export const ProxyView = () => {
  const [input, setInput] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  const go = (raw: string) => {
    let target = raw.trim();
    if (!target) return;
    if (!/^https?:\/\//i.test(target)) {
      // treat as search if no dot
      target = target.includes(".") ? `https://${target}` : `https://duckduckgo.com/?q=${encodeURIComponent(target)}`;
    }
    setUrl(target);
  };

  return (
    <div className="container py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            <span className="text-gradient">Nexus</span> Proxy Browser
          </h1>
          <p className="text-muted-foreground">Enter a URL or search term. Browse cloaked through our embedded frame.</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); go(input); }}
          className="glass rounded-2xl p-2 flex items-center gap-2 mb-6 shadow-blue"
        >
          <Lock className="h-4 w-4 text-accent ml-3" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search or enter URL..."
            className="flex-1 bg-transparent outline-none px-2 py-3 text-foreground placeholder:text-muted-foreground"
          />
          <button type="submit" className="bg-gradient-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl hover:scale-105 transition-smooth flex items-center gap-2">
            Go <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {QUICK.map((q) => (
            <button
              key={q.name}
              onClick={() => { setInput(q.url); go(q.url); }}
              className="glass px-4 py-2 rounded-lg text-sm hover:bg-muted transition-smooth flex items-center gap-2"
            >
              <Globe className="h-3.5 w-3.5 text-accent" /> {q.name}
            </button>
          ))}
        </div>

        {url ? (
          <div className="glass rounded-2xl overflow-hidden shadow-purple">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                <Lock className="h-3 w-3 text-accent" />
                <span className="truncate">{url}</span>
              </div>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                Open <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <iframe
              src={url}
              title="Nexus Proxy Frame"
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-presentation"
              className="w-full h-[70vh] bg-white"
            />
            <p className="text-xs text-muted-foreground p-3 text-center">
              Some sites block embedding. If a page won't load, click "Open" to launch in a new tab.
            </p>
          </div>
        ) : (
          <div className="glass rounded-2xl p-16 text-center">
            <Globe className="h-16 w-16 mx-auto mb-4 text-primary opacity-50 animate-float" />
            <p className="text-muted-foreground">Enter a URL above to start browsing.</p>
          </div>
        )}
      </div>
    </div>
  );
};