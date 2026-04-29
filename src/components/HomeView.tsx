import { Globe, Gamepad2, Sparkles, MessageCircle, Shield, Zap } from "lucide-react";

interface Props { onNavigate: (id: string) => void; }

const features = [
  { id: "proxy", icon: Globe, title: "Web Proxy", desc: "Open any site through our cloaked browser. Bypass filters instantly.", color: "shadow-blue" },
  { id: "games", icon: Gamepad2, title: "20+ Games", desc: "Curated unblocked classics. One click to play, zero install.", color: "shadow-purple" },
  { id: "ai", icon: Sparkles, title: "Nexus AI", desc: "A custom-built assistant for homework, code, and ideas.", color: "shadow-glow" },
  { id: "chat", icon: MessageCircle, title: "Live Chat", desc: "Talk to other Nexus users in realtime. No login required.", color: "shadow-blue" },
];

export const HomeView = ({ onNavigate }: Props) => (
  <div className="container py-12 md:py-20">
    <section className="text-center max-w-4xl mx-auto mb-20">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 animate-pulse-glow">
        <Shield className="h-3.5 w-3.5 text-accent" />
        <span className="text-xs font-medium uppercase tracking-wider">Anonymous • Encrypted • Free</span>
      </div>
      <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05]">
        Break <span className="text-gradient">free</span>.<br/>
        Stay <span className="text-gradient">connected</span>.
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
        Nexus Proxy is your all-in-one unblocked hub. Browse anything, play 20+ games, chat with an AI, and meet people — all behind one beautiful interface.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onNavigate("proxy")}
          className="bg-gradient-primary text-primary-foreground font-semibold px-7 py-3.5 rounded-xl shadow-glow hover:scale-105 transition-smooth flex items-center gap-2"
        >
          <Zap className="h-4 w-4" /> Launch Proxy
        </button>
        <button
          onClick={() => onNavigate("games")}
          className="glass font-semibold px-7 py-3.5 rounded-xl hover:bg-muted transition-smooth"
        >
          Browse Games
        </button>
      </div>
    </section>

    <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
      {features.map((f) => (
        <button
          key={f.id}
          onClick={() => onNavigate(f.id)}
          className={`text-left glass rounded-2xl p-6 hover:scale-[1.03] transition-smooth group ${f.color}`}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:rotate-6 transition-smooth">
            <f.icon className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="font-display text-xl font-bold mb-2">{f.title}</h3>
          <p className="text-sm text-muted-foreground">{f.desc}</p>
        </button>
      ))}
    </section>

    <section className="mt-20 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Powered by</p>
      <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3 text-muted-foreground/70 font-display font-semibold text-sm">
        <span>NEXUS CORE</span>·<span>QUANTUM AI</span>·<span>GHOST RELAY</span>·<span>ZERO TRACE</span>
      </div>
    </section>
  </div>
);