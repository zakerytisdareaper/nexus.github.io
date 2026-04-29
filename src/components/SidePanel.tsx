import { ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  icon: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

export const SidePanel = ({ open, title, icon, onClose, children }: Props) => (
  <aside
    className={`fixed top-16 right-0 bottom-0 z-40 w-full sm:w-[380px] glass border-l border-border shadow-purple
      transition-transform duration-300 ease-out flex flex-col
      ${open ? "translate-x-0" : "translate-x-full"}`}
    aria-hidden={!open}
  >
    <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
          {icon}
        </div>
        <span className="font-display font-bold">{title}</span>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
        aria-label="Close panel"
      ><X className="h-4 w-4" /></button>
    </div>
    <div className="flex-1 min-h-0">{children}</div>
  </aside>
);