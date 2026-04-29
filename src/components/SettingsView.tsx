import { Palette, MousePointer2, EyeOff, Check, User, Mail, ShieldCheck, KeyRound, Crown, Megaphone, Loader2, BadgeCheck, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSettings, THEMES, CURSORS, CLOAKS } from "@/contexts/SettingsContext";

const ADMIN_PASSWORD = "SoccerKid17181223";

export const SettingsView = () => {
  const { theme, cursor, cloak, setTheme, setCursor, setCloak } = useSettings();
  const { user, username, isAdmin, refreshAdmin } = useAuth();

  const verified = !!user?.email_confirmed_at;

  const [resending, setResending] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  const [adminPw, setAdminPw] = useState("");
  const [adminBusy, setAdminBusy] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);

  const [announcement, setAnnouncement] = useState("");
  const [annBusy, setAnnBusy] = useState(false);

  const resendVerification = async () => {
    if (!user?.email) return;
    setResending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email: user.email });
    setResending(false);
    if (error) toast.error(error.message);
    else toast.success("Verification email sent!");
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !currentPw || newPw.length < 6) {
      toast.error("New password must be 6+ characters");
      return;
    }
    setPwBusy(true);
    // Verify current password first
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPw });
    if (signInErr) { setPwBusy(false); toast.error("Current password is incorrect"); return; }
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwBusy(false);
    if (error) { toast.error(error.message); return; }
    setCurrentPw(""); setNewPw("");
    toast.success("Password updated");
  };

  const unlockAdmin = async () => {
    if (!user) return;
    if (adminPw !== ADMIN_PASSWORD) { toast.error("Wrong admin password"); return; }
    setAdminBusy(true);
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
    setAdminBusy(false);
    setAdminPw(""); setShowAdminInput(false);
    if (error && !error.message.includes("duplicate")) { toast.error(error.message); return; }
    await refreshAdmin();
    toast.success("👑 Admin unlocked");
  };

  const postAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim() || !username) return;
    setAnnBusy(true);
    const { error } = await supabase.from("announcements").insert({
      message: announcement.trim().slice(0, 500),
      author: username,
    });
    setAnnBusy(false);
    if (error) { toast.error(error.message); return; }
    setAnnouncement("");
    toast.success("Announcement broadcast!");
  };

  const openCloak = () => {
    const c = CLOAKS.find(x => x.id === cloak);
    if (!c || c.id === "none") return;
    const win = window.open("about:blank", "_blank");
    if (!win) return;
    win.document.write(`<!doctype html><html><head><title>${c.title}</title><link rel="icon" href="${c.favicon}"></head><body style="margin:0"><iframe src="${location.href}" style="border:0;width:100vw;height:100vh"></iframe></body></html>`);
  };

  return (
    <div className="container py-10 max-w-5xl">
      <header className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
          <span className="text-gradient">Settings</span>
        </h1>
        <p className="text-muted-foreground">Personalize your Nexus experience.</p>
      </header>

      {/* ACCOUNT */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl font-bold">Account</h2>
          {isAdmin && (
            <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-gradient-primary text-primary-foreground px-2 py-0.5 rounded-full">
              <Crown className="h-3 w-3" /> Admin
            </span>
          )}
        </div>
        <div className="glass rounded-2xl p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Username</div>
              <div className="font-semibold flex items-center gap-2"><User className="h-4 w-4 text-accent" /> {username ?? "—"}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Email</div>
              <div className="font-semibold flex items-center gap-2 break-all"><Mail className="h-4 w-4 text-accent" /> {user?.email}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
            {verified ? (
              <span className="inline-flex items-center gap-2 text-sm text-green-400">
                <BadgeCheck className="h-4 w-4" /> Email verified
              </span>
            ) : (
              <>
                <span className="inline-flex items-center gap-2 text-sm text-yellow-400">
                  <AlertCircle className="h-4 w-4" /> Email not verified (optional)
                </span>
                <button
                  onClick={resendVerification}
                  disabled={resending}
                  className="bg-gradient-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg shadow-glow hover:scale-105 transition-smooth disabled:opacity-60 flex items-center gap-2"
                >
                  {resending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <ShieldCheck className="h-3.5 w-3.5" /> Verify email
                </button>
              </>
            )}
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="glass rounded-2xl p-5 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <KeyRound className="h-4 w-4 text-accent" />
            <h3 className="font-semibold">Change password</h3>
          </div>
          <form onSubmit={changePassword} className="grid sm:grid-cols-2 gap-3">
            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Current password"
              className="bg-input rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary text-sm" autoComplete="current-password" />
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="New password (6+ chars)"
              className="bg-input rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary text-sm" autoComplete="new-password" />
            <button disabled={pwBusy} className="sm:col-span-2 bg-gradient-primary text-primary-foreground font-semibold py-2.5 rounded-xl shadow-glow hover:scale-[1.02] transition-smooth flex items-center justify-center gap-2 disabled:opacity-60">
              {pwBusy && <Loader2 className="h-4 w-4 animate-spin" />} Update password
            </button>
          </form>
        </div>

        {/* ADMIN */}
        <div className="glass rounded-2xl p-5 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-4 w-4 text-yellow-400" />
            <h3 className="font-semibold">Admin access</h3>
          </div>
          {isAdmin ? (
            <>
              <p className="text-sm text-muted-foreground mb-3">You have admin powers. You can delete chat messages and post announcements.</p>
              <form onSubmit={postAnnouncement} className="flex flex-col sm:flex-row gap-2">
                <input
                  value={announcement}
                  onChange={e => setAnnouncement(e.target.value)}
                  maxLength={500}
                  placeholder="Broadcast a message to everyone…"
                  className="flex-1 bg-input rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button disabled={annBusy || !announcement.trim()} className="bg-gradient-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl shadow-glow hover:scale-105 transition-smooth disabled:opacity-60 flex items-center justify-center gap-2">
                  {annBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4" />} Post
                </button>
              </form>
            </>
          ) : !showAdminInput ? (
            <button
              onClick={() => setShowAdminInput(true)}
              className="bg-gradient-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl shadow-glow hover:scale-105 transition-smooth flex items-center gap-2"
            >
              <Crown className="h-4 w-4" /> Admin
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password" value={adminPw} onChange={e => setAdminPw(e.target.value)}
                placeholder="Admin password" autoFocus
                className="flex-1 bg-input rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button onClick={unlockAdmin} disabled={adminBusy} className="bg-gradient-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl shadow-glow hover:scale-105 transition-smooth disabled:opacity-60 flex items-center justify-center gap-2">
                {adminBusy && <Loader2 className="h-4 w-4 animate-spin" />} Unlock
              </button>
              <button onClick={() => { setShowAdminInput(false); setAdminPw(""); }} className="glass px-4 py-2.5 rounded-xl text-sm">Cancel</button>
            </div>
          )}
        </div>
      </section>

      {/* THEMES */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl font-bold">Themes</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {THEMES.map(t => {
            const active = t.id === theme;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`relative glass rounded-2xl p-5 text-left transition-smooth hover:scale-[1.02] ${active ? "ring-2 ring-primary shadow-glow" : ""}`}
              >
                <div className="flex gap-1.5 mb-3">
                  {t.swatch.map((s, i) => (
                    <span key={i} className="w-8 h-8 rounded-lg" style={{ background: `hsl(${s})` }} />
                  ))}
                </div>
                <div className="font-semibold">{t.name}</div>
                {active && (
                  <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* CURSORS */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <MousePointer2 className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl font-bold">Custom Cursor</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {CURSORS.map(c => {
            const active = c.id === cursor;
            return (
              <button
                key={c.id}
                onClick={() => setCursor(c.id)}
                style={{ cursor: c.css }}
                className={`glass rounded-xl p-4 text-center transition-smooth hover:bg-muted ${active ? "ring-2 ring-primary" : ""}`}
              >
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-1">Hover me</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CLOAKING */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <EyeOff className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl font-bold">Tab Cloaking</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Disguises this tab's title and icon. Pick a cloak, then optionally open a new cloaked tab.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {CLOAKS.map(c => {
            const active = c.id === cloak;
            return (
              <button
                key={c.id}
                onClick={() => setCloak(c.id)}
                className={`glass rounded-xl p-4 flex items-center gap-3 transition-smooth hover:bg-muted text-left ${active ? "ring-2 ring-primary" : ""}`}
              >
                <img src={c.favicon} alt="" className="w-6 h-6 rounded" onError={(e) => ((e.currentTarget.style.visibility = "hidden"))} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.title}</div>
                </div>
                {active && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
        {cloak !== "none" && (
          <button
            onClick={openCloak}
            className="bg-gradient-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-lg shadow-glow hover:scale-105 transition-smooth"
          >
            Open in about:blank
          </button>
        )}
      </section>
    </div>
  );
};