import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const STALE_MS = 90_000;

export const usePresence = () => {
  const { user, username } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user || !username) return;
    let alive = true;

    const beat = () => supabase.from("presence").upsert(
      { user_id: user.id, username, last_seen: new Date().toISOString() },
      { onConflict: "user_id" }
    );

    const refresh = async () => {
      const cutoff = new Date(Date.now() - STALE_MS).toISOString();
      const { count: c } = await supabase
        .from("presence")
        .select("user_id", { count: "exact", head: true })
        .gte("last_seen", cutoff);
      if (alive && typeof c === "number") setCount(c);
    };

    beat().then(refresh);
    const i1 = setInterval(beat, 30_000);
    const i2 = setInterval(refresh, 15_000);

    const onLeave = () => { supabase.from("presence").delete().eq("user_id", user.id); };
    window.addEventListener("beforeunload", onLeave);

    return () => {
      alive = false;
      clearInterval(i1); clearInterval(i2);
      window.removeEventListener("beforeunload", onLeave);
      onLeave();
    };
  }, [user, username]);

  return count;
};