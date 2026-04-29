import { useState } from "react";
import { Gamepad2, X, Play, Shield, Globe } from "lucide-react";

type Game = { id: string; name: string; tag: string; url: string };

const GAMES: Game[] = [
  { id: "2048", name: "2048", tag: "Puzzle", url: "https://play2048.co/" },
  { id: "slither", name: "Slither.io", tag: "IO", url: "https://slither.io/" },
  { id: "krunker", name: "Krunker", tag: "FPS", url: "https://krunker.io/" },
  { id: "agar", name: "Agar.io", tag: "IO", url: "https://agar.io/" },
  { id: "chess", name: "Chess", tag: "Classic", url: "https://lichess.org/" },
  { id: "tetris", name: "Tetris", tag: "Classic", url: "https://tetris.com/play-tetris" },
  { id: "wordle", name: "Wordle", tag: "Word", url: "https://wordleunlimited.org/" },
  { id: "snake", name: "Google Snake", tag: "Classic", url: "https://playsnake.org/" },
  { id: "pacman", name: "Pac-Man", tag: "Arcade", url: "https://www.google.com/logos/2010/pacman10-i.html" },
  { id: "minesweeper", name: "Minesweeper", tag: "Puzzle", url: "https://minesweeper.online/" },
  { id: "sudoku", name: "Sudoku", tag: "Puzzle", url: "https://sudoku.com/" },
  { id: "solitaire", name: "Solitaire", tag: "Card", url: "https://www.solitr.com/" },
  { id: "checkers", name: "Checkers", tag: "Classic", url: "https://www.247checkers.com/" },
  { id: "drift", name: "Drift Hunters", tag: "Racing", url: "https://drifthunters.io/" },
  { id: "tanks", name: "Tank Trouble", tag: "Action", url: "https://tanktrouble.com/" },
  { id: "basket", name: "Basketball", tag: "Sports", url: "https://basketrandom.io/" },
  { id: "soccer", name: "Soccer Random", tag: "Sports", url: "https://soccerrandom.io/" },
  { id: "geo", name: "GeoGuessr Free", tag: "Trivia", url: "https://www.geoguessr.com/free" },
  { id: "typing", name: "Typing Test", tag: "Skill", url: "https://monkeytype.com/" },
  { id: "flappy", name: "Flappy Bird", tag: "Arcade", url: "https://flappybird.io/" },
  { id: "cookie", name: "Cookie Clicker", tag: "Idle", url: "https://orteil.dashnet.org/cookieclicker/" },
  { id: "shellshock", name: "Shell Shockers", tag: "FPS", url: "https://shellshock.io/" },
  { id: "smashkarts", name: "Smash Karts", tag: "Racing", url: "https://smashkarts.io/" },
  { id: "paper", name: "Paper.io 2", tag: "IO", url: "https://paper-io.com/" },
];

const TAGS = ["All", ...Array.from(new Set(GAMES.map(g => g.tag)))];

const faviconFor = (url: string) => {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=128&domain=${host}`;
  } catch { return ""; }
};

// Server-side proxy strips X-Frame-Options/CSP so blocked sites embed cleanly.
const NEXUS_PROXY = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/proxy?url=`;
const PROXIES = [
  { id: "nexus", name: "Nexus (recommended)", wrap: (u: string) => `${NEXUS_PROXY}${encodeURIComponent(u)}` },
  { id: "direct", name: "Direct", wrap: (u: string) => u },
  { id: "croxy", name: "CroxyProxy", wrap: (u: string) => `https://www.croxyproxy.com/_public/api/url?u=${encodeURIComponent(u)}` },
] as const;
type ProxyId = typeof PROXIES[number]["id"];

export const GamesView = () => {
  const [active, setActive] = useState<Game | null>(null);
  const [filter, setFilter] = useState("All");
  const [proxy, setProxy] = useState<ProxyId>("nexus");
  const list = filter === "All" ? GAMES : GAMES.filter(g => g.tag === filter);
  const wrap = PROXIES.find(p => p.id === proxy)!.wrap;

  return (
    <div className="container py-10">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
          <span className="text-gradient">{GAMES.length}+</span> Unblocked Games
        </h1>
        <p className="text-muted-foreground">Click any game to play instantly inside Nexus.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-center mb-4">
        <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Shield className="h-3 w-3" /> Proxy
        </span>
        {PROXIES.map(p => (
          <button
            key={p.id}
            onClick={() => setProxy(p.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth ${
              proxy === p.id ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:text-foreground"
            }`}
          >{p.name}</button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {TAGS.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
              filter === t
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {list.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(g)}
            className="glass rounded-2xl p-5 text-center hover:scale-105 hover:shadow-purple transition-smooth group"
          >
            <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center overflow-hidden group-hover:animate-float ring-1 ring-border">
              <img
                src={faviconFor(g.url)}
                alt=""
                loading="lazy"
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = "none";
                  t.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-accent"><path d="M6 12h12M12 6v12"/></svg>';
                }}
              />
            </div>
            <div className="font-display font-semibold text-sm mb-1">{g.name}</div>
            <div className="text-[10px] uppercase tracking-wider text-accent">{g.tag}</div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src={faviconFor(active.url)} alt="" className="w-8 h-8 rounded" />
              <div>
                <h2 className="font-display font-bold text-lg">{active.name}</h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3" /> {active.tag} · {PROXIES.find(p => p.id === proxy)!.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={active.url} target="_blank" rel="noopener noreferrer" className="glass px-4 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-muted transition-smooth">
                <Play className="h-3 w-3" /> New tab
              </a>
              <button onClick={() => setActive(null)} className="glass p-2 rounded-lg hover:bg-muted transition-smooth">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <iframe
            src={wrap(active.url)}
            title={active.name}
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-pointer-lock allow-presentation"
            className="flex-1 w-full rounded-2xl bg-black border border-border"
          />
          <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-2">
            <Gamepad2 className="h-3 w-3" /> Blocked? Switch the proxy above or open in a new tab.
          </p>
        </div>
      )}
    </div>
  );
};