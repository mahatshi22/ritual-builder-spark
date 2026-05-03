import { Button } from "@/components/ui/button";
import { Copy, LogOut, Wallet } from "lucide-react";
import { toast } from "sonner";

interface Props {
  address: string | null;
  connecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export const Navbar = ({ address, connecting, onConnect, onDisconnect }: Props) => {
  const copy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    toast.success("Address copied");
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl gradient-primary shadow-glow flex items-center justify-center">
            <span className="text-primary-foreground font-bold">R</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight">Ritual Builder Spotlight</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">Vote on the Ritual chain</span>
          </div>
        </div>

        {address ? (
          <div className="flex items-center gap-2">
            <button
              onClick={copy}
              className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-full bg-secondary hover:bg-accent transition-smooth text-sm font-medium"
            >
              <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
              {short(address)}
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <Button variant="ghost" size="sm" onClick={onDisconnect} className="rounded-full">
              <LogOut className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Disconnect</span>
            </Button>
          </div>
        ) : (
          <Button onClick={onConnect} disabled={connecting} className="rounded-full gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
            <Wallet className="h-4 w-4 mr-2" />
            {connecting ? "Connecting…" : "Connect Wallet"}
          </Button>
        )}
      </div>
    </header>
  );
};
