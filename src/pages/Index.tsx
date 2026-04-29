import { useState } from "react";
import { NexusHeader } from "@/components/NexusHeader";
import { HomeView } from "@/components/HomeView";
import { ProxyView } from "@/components/ProxyView";
import { GamesView } from "@/components/GamesView";
import { AIView } from "@/components/AIView";
import { ChatView } from "@/components/ChatView";

const Index = () => {
  const [tab, setTab] = useState("home");

  return (
    <div className="min-h-screen">
      <NexusHeader active={tab} onChange={setTab} />
      <main>
        {tab === "home" && <HomeView onNavigate={setTab} />}
        {tab === "proxy" && <ProxyView />}
        {tab === "games" && <GamesView />}
        {tab === "ai" && <AIView />}
        {tab === "chat" && <ChatView />}
      </main>
      <footer className="border-t border-border mt-16 py-6 text-center text-xs text-muted-foreground">
        Nexus Proxy · Browse free · Stay anonymous
      </footer>
    </div>
  );
};

export default Index;
