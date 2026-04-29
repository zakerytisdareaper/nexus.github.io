import { useState, useEffect, useRef } from "react";
import { Sparkles, MessageCircle } from "lucide-react";
import { NexusHeader } from "@/components/NexusHeader";
import { HomeView } from "@/components/HomeView";
import { BrowserView } from "@/components/BrowserView";
import { GamesView } from "@/components/GamesView";
import { AIView } from "@/components/AIView";
import { ChatView } from "@/components/ChatView";
import { SidePanel } from "@/components/SidePanel";
import { SettingsView } from "@/components/SettingsView";
import { DotsBackground } from "@/components/DotsBackground";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AuthScreen } from "@/components/AuthScreen";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const InnerApp = () => {
  const { user, username, loading, signOut } = useAuth();
  const [tab, setTab] = useState("home");
  const [aiOpen, setAiOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const greetedFor = useRef<string | null>(null);

  useEffect(() => {
    if (user && username && greetedFor.current !== user.id) {
      greetedFor.current = user.id;
      toast.success(`Welcome, ${username}! ✨`, {
        description: "You're connected to Nexus Proxy.",
      });
    }
  }, [user, username]);

  const openAI = () => { setAiOpen(true); setChatOpen(false); };
  const openChat = () => { setChatOpen(true); setAiOpen(false); };

  const handleNav = (id: string) => {
    if (id === "ai") return openAI();
    if (id === "chat") return openChat();
    setTab(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <DotsBackground />
        <Loader2 className="h-8 w-8 animate-spin text-primary relative z-10" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative">
        <DotsBackground />
        <AuthScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <DotsBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
      <NexusHeader
        active={tab}
        onChange={setTab}
        aiOpen={aiOpen}
        chatOpen={chatOpen}
        onToggleAI={() => { aiOpen ? setAiOpen(false) : openAI(); }}
        onToggleChat={() => { chatOpen ? setChatOpen(false) : openChat(); }}
        onSignOut={signOut}
        username={username}
      />
      <main className="flex-1">
        {tab === "home" && <HomeView onNavigate={handleNav} />}
        {tab === "browser" && <BrowserView />}
        {tab === "games" && <GamesView />}
        {tab === "settings" && <SettingsView />}
      </main>

      <SidePanel
        open={aiOpen}
        title="Nexus AI"
        icon={<Sparkles className="h-3.5 w-3.5 text-primary-foreground" />}
        onClose={() => setAiOpen(false)}
      >
        <AIView />
      </SidePanel>

      <SidePanel
        open={chatOpen}
        title="Live Chat"
        icon={<MessageCircle className="h-3.5 w-3.5 text-primary-foreground" />}
        onClose={() => setChatOpen(false)}
      >
        <ChatView />
      </SidePanel>
      </div>
    </div>
  );
};

const Index = () => (
  <AuthProvider>
    <SettingsProvider>
      <InnerApp />
    </SettingsProvider>
  </AuthProvider>
);

export default Index;
