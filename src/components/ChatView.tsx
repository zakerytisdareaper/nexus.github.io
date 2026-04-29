import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type Msg = { id: string; username: string; content: string; created_at: string };

const ONE_HOUR = 60 * 60 * 1000;
const isFresh = (iso: string) => Date.now() - new Date(iso).getTime() < ONE_HOUR;
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export const ChatView = () => {
  const { username } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (!username) return;
    let alive = true;
    const cutoff = new Date(Date.now() - ONE_HOUR).toISOString();
    (async () => {
      const { data } = await supabase
        .from("chat_messages").select("*")
        .gte("created_at", cutoff)
        .order("created_at", { ascending: true }).limit(100);
      if (alive && data) setMessages(data as Msg[]);
    })();

    const channel = supabase
      .channel("chat_messages_live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (p) => {
        setMessages(prev => [...prev, p.new as Msg]);
      })
      .subscribe();

    // Periodically prune messages older than 1 hour from local view
    const prune = setInterval(() => {
      setMessages(prev => prev.filter(m => isFresh(m.created_at)));
    }, 60_000);

    return () => { alive = false; clearInterval(prune); supabase.removeChannel(channel); };
  }, [username]);

  const send = async () => {
    if (!username) return;
    const text = input.trim();
    if (!text) return;
    setInput("");
    const { error } = await supabase.from("chat_messages").insert({ username, content: text.slice(0, 500) });
    if (error) { toast.error("Failed to send"); console.error(error); }
  };

  if (!username) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <p className="text-muted-foreground text-xs">Loading your account…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border text-center">
        Messages auto-delete after 1 hour
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-xs pt-10">No messages yet — say hi 👋</p>
        )}
        {messages.map((m) => {
          const mine = m.username === username;
          return (
            <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              <span className="text-[10px] text-muted-foreground mb-0.5 px-1 flex items-center gap-1.5">
                <span>{m.username}</span>
                <span className="opacity-60">· {formatTime(m.created_at)}</span>
              </span>
              <div className={`px-3 py-2 rounded-xl max-w-[85%] text-sm break-words ${
                mine ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}>
                {m.content}
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t border-border p-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          placeholder={`Message as ${username}`}
          className="flex-1 bg-input rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-gradient-primary text-primary-foreground font-semibold px-3 rounded-lg hover:scale-105 transition-smooth disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};