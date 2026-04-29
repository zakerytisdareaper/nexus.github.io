import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, X } from "lucide-react";

type Ann = { id: string; message: string; author: string; created_at: string };

export const AnnouncementBanner = () => {
  const [items, setItems] = useState<Ann[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    supabase.from("announcements").select("*").gte("created_at", cutoff).order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => { if (data) setItems(data as Ann[]); });

    const ch = supabase
      .channel("announcements_live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "announcements" }, (p) => {
        setItems(prev => [p.new as Ann, ...prev].slice(0, 5));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "announcements" }, (p) => {
        setItems(prev => prev.filter(a => a.id !== (p.old as Ann).id));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const visible = items.filter(a => !dismissed.has(a.id));
  if (!visible.length) return null;

  return (
    <div className="space-y-2 mb-6">
      {visible.map(a => (
        <div key={a.id} className="glass rounded-2xl p-4 flex items-start gap-3 border border-primary/40 shadow-glow animate-float">
          <div className="bg-gradient-primary p-2 rounded-lg shrink-0">
            <Megaphone className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-accent font-semibold mb-0.5">📢 Announcement · {a.author}</div>
            <div className="text-sm break-words">{a.message}</div>
          </div>
          <button onClick={() => setDismissed(prev => new Set(prev).add(a.id))} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};