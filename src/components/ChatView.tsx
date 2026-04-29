import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

type Msg = { id: string; username: string; content: string; created_at: string };

export const ChatView = () => {
  const [username, setUsername] = useState(() => localStorage.getItem("nexus_username") || "");
  const [draftName, setDraftName] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (!username) return;
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("chat_messages").select("*")
        .order("created_at", { ascending: true }).limit(100);
      if (alive && data) setMessages(data as Msg[]);
    })();

    const channel = supabase
      .channel("chat_messages_live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (p) => {
        setMessages(prev => [...prev, p.new as Msg]);
      })
      .subscribe();

    return () => { alive = false; supabase.removeChannel(channel); };
  }, [username]);

  const join = (e: React.FormEvent) => {
    e.preventDefault();
    const n = draftName.trim().slice(0, 32);
    if (!n) return;
    localStorage.setItem("nexus_username", n);
    setUsername(n);
  };

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const { error } = await supabase.from("chat_messages").insert({ username, content: text.slice(0, 500) });
    if (error) { toast.error("Failed to send"); console.error(error); }
  };

  if (!username) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <MessageCircle className="h-10 w-10 mb-3 text-accent animate-float" />
        <h3 className="font-display font-bold mb-1">Join the lobby</h3>
        <p className="text-muted-foreground text-xs mb-4">Pick a handle to chat.</p>
        <form onSubmit={join} className="w-full space-y-2">
          <input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            maxLength={32}
            placeholder="Username"
            className="w-full bg-input rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-sm text-center"
          />
          <button className="w-full bg-gradient-primary text-primary-foreground text-sm font-semibold py-2 rounded-lg hover:scale-[1.02] transition-smooth">
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-xs pt-10">No messages yet — say hi 👋</p>
        )}
        {messages.map((m) => {
          const mine = m.username === username;
          return (
            <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              <span className="text-[10px] text-muted-foreground mb-0.5 px-1">{m.username}</span>
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