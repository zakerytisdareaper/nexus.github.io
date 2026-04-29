import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

const signUpSchema = z.object({
  username: z.string().trim().min(2, "Username too short").max(24, "Max 24 chars").regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, _ only"),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
});
const signInSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(1, "Required").max(72),
});

export const AuthScreen = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const parsed = signUpSchema.safeParse({ username, email, password });
        if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { username: parsed.data.username },
          },
        });
        if (error) { toast.error(error.message); return; }
        toast.success("Check your email to verify your account.");
      } else {
        const parsed = signInSchema.safeParse({ email, password });
        if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) { toast.error(error.message); return; }
      }
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <div className="w-full max-w-md glass rounded-3xl p-8 shadow-purple animate-float">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-70" />
            <div className="relative bg-gradient-primary p-3.5 rounded-2xl">
              <Zap className="h-7 w-7 text-primary-foreground" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            NƎXUS<span className="text-gradient"> · PRØXY</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {mode === "signin" ? "Welcome back. Sign in to continue." : "Create your account to begin."}
          </p>
        </div>

        <div className="flex p-1 rounded-xl bg-muted mb-6">
          {(["signin", "signup"] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-smooth ${
                mode === m ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
              }`}
            >{m === "signin" ? "Sign In" : "Sign Up"}</button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input
              value={username} onChange={e => setUsername(e.target.value)}
              maxLength={24} placeholder="Username" autoComplete="username"
              className="w-full bg-input rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          )}
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            maxLength={255} placeholder="Email" autoComplete="email" required
            className="w-full bg-input rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            maxLength={72} placeholder="Password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required
            className="w-full bg-input rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button
            disabled={busy}
            className="w-full bg-gradient-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-glow hover:scale-[1.02] transition-smooth flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {mode === "signin" ? "New here? " : "Already have an account? "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-accent hover:underline">
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};