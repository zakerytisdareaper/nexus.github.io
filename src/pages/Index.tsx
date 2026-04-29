import { useState } from "react";
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

const Index = () => {
  const [tab, setTab] = useState("home");
  const [aiOpen, setAiOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const openAI = () => { setAiOpen(true); setChatOpen(false); };
  const openChat = () => { setChatOpen(true); setAiOpen(false); };

  const handleNav = (id: string) => {
    if (id === "ai") return openAI();
    if (id === "chat") return openChat();
    setTab(id);
  };

  return (
    <SettingsProvider>
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
    </SettingsProvider>
  );
};

export default Index;
