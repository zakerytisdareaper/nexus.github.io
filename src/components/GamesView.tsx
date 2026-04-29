import { useState } from "react";
import { Gamepad2, X, Play } from "lucide-react";

type Game = { id: string; name: string; emoji: string; tag: string; url: string };

const GAMES: Game[] = [
  { id: "2048", name: "2048", emoji: "🔢", tag: "Puzzle", url: "https://play2048.co/" },
  { id: "slither", name: "Slither.io", emoji: "🐍", tag: "IO", url: "https://slither.io/" },
  { id: "krunker", name: "Krunker", emoji: "🔫", tag: "FPS", url: "https://krunker.io/" },
  { id: "agar", name: "Agar.io", emoji: "🦠", tag: "IO", url: "https://agar.io/" },
  { id: "chess", name: "Chess", emoji: "♟️", tag: "Classic", url: "https://lichess.org/" },
  { id: "tetris", name: "Tetris", emoji: "🟦", tag: "Classic", url: "https://tetris.com/play-tetris" },
  { id: "wordle", name: "Wordle", emoji: "🟩", tag: "Word", url: "https://wordleunlimited.org/" },
  { id: "snake", name: "Google Snake", emoji: "🟢", tag: "Classic", url: "https://playsnake.org/" },
  { id: "pacman", name: "Pac-Man", emoji: "👻", tag: "Arcade", url: "https://www.google.com/logos/2010/pacman10-i.html" },
  { id: "minesweeper", name: "Minesweeper", emoji: "💣", tag: "Puzzle", url: "https://minesweeper.online/" },
  { id: "sudoku", name: "Sudoku", emoji: "🔠", tag: "Puzzle", url: "https://sudoku.com/" },
  { id: "solitaire", name: "Solitaire", emoji: "🃏", tag: "Card", url: "https://www.solitr.com/" },
  { id: "checkers", name: "Checkers", emoji: "🔴", tag: "Classic", url: "https://www.247checkers.com/" },
  { id: "drift", name: "Drift Hunters", emoji: "🚗", tag: "Racing", url: "https://drifthunters.io/" },
  { id: "tanks", name: "Tank Trouble", emoji: "🚜", tag: "Action", url: "https://tanktrouble.com/" },
  { id: "basket", name: "Basketball", emoji: "🏀", tag: "Sports", url: "https://basketrandom.io/" },
  { id: "soccer", name: "Soccer Random", emoji: "⚽", tag: "Sports", url: "https://soccerrandom.io/" },
  { id: "geo", name: "GeoGuessr Free", emoji: "🌍", tag: "Trivia", url: "https://www.geoguessr.com/free" },
  { id: "typing", name: "Typing Test", emoji: "⌨️", tag: "Skill", url: "https://monkeytype.com/" },
  { id: "flappy", name: "Flappy Bird", emoji: "🐦", tag: "Arcade", url: "https://flappybird.io/" },
  { id: "cookie", name: "Cookie Clicker", emoji: "🍪", tag: "Idle", url: "https://orteil.dashnet.org/cookieclicker/" },
  { id: "shellshock", name: "Shell Shockers", emoji: "🥚", tag: "FPS", url: "https://shellshock.io/" },
  { id: "smashkarts", name: "Smash Karts", emoji: "🏎️", tag: "Racing", url: "https://smashkarts.io/" },
  { id: "paper", name: "Paper.io 2", emoji: "📄", tag: "IO", url: "https://paper-io.com/" },
];

const TAGS = ["All", ...Array.from(new Set(GAMES.map(g => g.tag)))];

export const GamesView = () => {
  const [active, setActive] = useState<Game | null>(null);
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? GAMES : GAMES.filter(g => g.tag === filter);

  return (
    <div className="container py-10">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
          <span className="text-gradient">{GAMES.length}+</span> Unblocked Games
        </h1>
        <p className="text-muted-foreground">Click any game to play instantly inside Nexus.</p>
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
            <div className="text-5xl mb-3 group-hover:animate-float">{g.emoji}</div>
            <div className="font-display font-semibold text-sm mb-1">{g.name}</div>
            <div className="text-[10px] uppercase tracking-wider text-accent">{g.tag}</div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{active.emoji}</span>
              <div>
                <h2 className="font-display font-bold text-lg">{active.name}</h2>
                <p className="text-xs text-muted-foreground">{active.tag}</p>
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
            src={active.url}
            title={active.name}
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-pointer-lock allow-presentation"
            className="flex-1 w-full rounded-2xl bg-black border border-border"
          />
          <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-2">
            <Gamepad2 className="h-3 w-3" /> Some games may block embedding — open in a new tab if so.
          </p>
        </div>
      )}
    </div>
  );
};