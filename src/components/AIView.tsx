import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, User, Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

export const AIView = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hey, I'm **Nexus AI**. Ask me anything — homework, code, ideas, jokes. Let's go." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
      });

      if (resp.status === 429) { toast.error("Rate limited. Slow down a moment."); setLoading(false); return; }
      if (resp.status === 402) { toast.error("AI credits exhausted."); setLoading(false); return; }
      if (!resp.ok || !resp.body) { toast.error("AI failed to respond."); setLoading(false); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistant = "";
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      let done = false;

      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) {
              assistant += c;
              setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistant } : m));
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-medium uppercase tracking-wider">Custom AI</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            <span className="text-gradient">Nexus</span> AI
          </h1>
          <p className="text-muted-foreground">Built into Nexus. Streaming responses, no signup.</p>
        </div>

        <div className="glass rounded-2xl shadow-purple flex flex-col h-[65vh]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${m.role === "user" ? "bg-secondary" : "bg-gradient-primary"}`}>
                  {m.role === "user" ? <User className="h-4 w-4 text-secondary-foreground" /> : <Bot className="h-4 w-4 text-primary-foreground" />}
                </div>
                <div className={`px-4 py-3 rounded-2xl max-w-[80%] whitespace-pre-wrap text-sm leading-relaxed ${
                  m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-muted text-foreground"
                }`}>
                  {m.content || (loading && i === messages.length - 1 ? <Loader2 className="h-4 w-4 animate-spin" /> : "")}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="border-t border-border p-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nexus AI anything..."
              disabled={loading}
              className="flex-1 bg-input rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-primary text-primary-foreground font-semibold px-5 rounded-xl hover:scale-105 transition-smooth disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};