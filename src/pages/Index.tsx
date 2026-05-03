import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BuilderCard, BuilderCardSkeleton } from "@/components/BuilderCard";
import { useWallet } from "@/hooks/useWallet";
import { useBuilders } from "@/hooks/useBuilders";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { MAX_VOTES, RITUAL_CHAIN } from "@/lib/contract";

const Index = () => {
  const { address, signer, connecting, isCorrectChain, connect, disconnect, ensureRitualChain } = useWallet();
  const { builders, loading, remaining, refreshing, refresh, vote, applyOptimistic } = useBuilders(signer, address);
  const [votingIndex, setVotingIndex] = useState<number | null>(null);
  const [votedFor, setVotedFor] = useState<Set<number>>(new Set());

  const ranked = useMemo(() => {
    return [...builders]
      .sort((a, b) => b.voteCount - a.voteCount)
      .map((b, i) => ({ ...b, rank: i + 1 }));
  }, [builders]);

  const handleVote = async (index: number) => {
    if (!address) {
      toast.error("Connect your wallet first");
      connect();
      return;
    }
    if (!isCorrectChain) {
      const ok = await ensureRitualChain();
      if (!ok) return;
    }
    if (remaining <= 0) {
      toast.error("You've used all your votes");
      return;
    }
    setVotingIndex(index);
    try {
      const tx = await vote(index);
      toast("Transaction submitted", {
        description: (
          <a href={`${RITUAL_CHAIN.explorer}/tx/${tx.hash}`} target="_blank" rel="noreferrer" className="underline inline-flex items-center gap-1">
            View on explorer <ExternalLink className="h-3 w-3" />
          </a>
        ),
      });
      await tx.wait();
      // Optimistic UI update — instant feedback
      applyOptimistic(index);
      setVotedFor((prev) => new Set(prev).add(index));
      toast.success("Vote successful!");
      // Refresh from chain (with a small delay so RPC node has the new state)
      setTimeout(() => refresh(), 800);
      setTimeout(() => refresh(), 2500);
    } catch (err: any) {
      const msg = err?.shortMessage || err?.reason || err?.message || "Transaction failed";
      toast.error(msg.length > 120 ? msg.slice(0, 120) + "…" : msg);
    } finally {
      setVotingIndex(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar address={address} connecting={connecting} onConnect={connect} onDisconnect={disconnect} />

      {/* Hero */}
      <section className="container pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6 border border-primary/10">
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Ritual Chain
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Top Builders on <span className="text-gradient">Ritual</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
          Vote for the builders shaping the ecosystem. Each wallet gets {MAX_VOTES} votes.
        </p>

        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-card shadow-card border border-border/60">
          <div className="text-sm text-muted-foreground">Votes left</div>
          <div className="text-2xl font-bold text-gradient tabular-nums">
            {address ? remaining : MAX_VOTES}
          </div>
          <div className="text-sm text-muted-foreground">/ {MAX_VOTES}</div>
          <Button variant="ghost" size="sm" onClick={refresh} disabled={refreshing} className="rounded-full ml-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </section>

      {/* Sticky mobile vote counter */}
      {address && (
        <div className="sm:hidden sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border/60 py-2 px-4 text-center text-sm">
          <span className="text-muted-foreground">Votes left: </span>
          <span className="font-bold text-gradient">{remaining}/{MAX_VOTES}</span>
        </div>
      )}

      {/* Grid */}
      <section className="container pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <BuilderCardSkeleton key={i} />)
            : ranked.map((b) => (
                <BuilderCard
                  key={b.index}
                  builder={b}
                  rank={b.rank}
                  canVote={!!address && remaining > 0 && !votedFor.has(b.index)}
                  voting={votingIndex === b.index}
                  onVote={() => handleVote(b.index)}
                />
              ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        <div className="container">
          Built on{" "}
          <a href={RITUAL_CHAIN.explorer} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Ritual Chain
          </a>{" "}
          · Chain ID {RITUAL_CHAIN.chainId}
        </div>
      </footer>
    </div>
  );
};

export default Index;
