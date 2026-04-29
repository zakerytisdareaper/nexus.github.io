import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Send, Users } from "lucide-react";
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
      <div className="container py-20 max-w-md mx-auto">
        <div className="glass rounded-2xl p-8 text-center shadow-blue">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-accent animate-float" />
          <h2 className="font-display text-2xl font-bold mb-2">Join the Lobby</h2>
          <p className="text-muted-foreground text-sm mb-6">Pick a handle to chat with everyone on Nexus.</p>
          <form onSubmit={join} className="space-y-3">
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              maxLength={32}
              placeholder="Your username"
              className="w-full bg-input rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-center"
            />
            <button className="w-full bg-gradient-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-glow hover:scale-[1.02] transition-smooth">
              Enter Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Live <span className="text-gradient">Chat</span>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 justify-center text-sm">
            <Users className="h-4 w-4" /> Chatting as <span className="text-foreground font-semibold">{username}</span>
          </p>
        </div>

        <div className="glass rounded-2xl shadow-blue flex flex-col h-[65vh]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.length === 0 && (
              <p className="text-center text-muted-foreground text-sm pt-10">No messages yet — say hi 👋</p>
            )}
            {messages.map((m) => {
              const mine = m.username === username;
              return (
                <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                  <span className="text-[11px] text-muted-foreground mb-1 px-2">{m.username}</span>
                  <div className={`px-4 py-2.5 rounded-2xl max-w-[75%] text-sm break-words ${
                    mine ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}>
                    {m.content}
                  </div>
                </div>
              );
            })}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t border-border p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Type a message..."
              className="flex-1 bg-input rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-gradient-primary text-primary-foreground font-semibold px-5 rounded-xl hover:scale-105 transition-smooth disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};