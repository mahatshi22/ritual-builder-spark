import { Builder } from "@/hooks/useBuilders";
import { Button } from "@/components/ui/button";
import { Loader2, ThumbsUp, ExternalLink } from "lucide-react";
import ritualLogo from "@/assets/ritual-logo.png";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface Props {
  builder: Builder;
  rank: number;
  canVote: boolean;
  voting: boolean;
  onVote: () => void;
}

const medals: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export const BuilderCard = ({ builder, rank, canVote, voting, onVote }: Props) => {
  const medal = medals[rank];

  return (
    <div className="group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-glow transition-smooth hover:-translate-y-1 border border-border/60">
      {medal && (
        <div className="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-card shadow-elevated flex items-center justify-center text-xl border border-border/60">
          {medal}
        </div>
      )}
      <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground">#{rank}</div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full gradient-primary opacity-0 group-hover:opacity-30 blur-xl transition-smooth" />
          <div className="relative h-24 w-24 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary/40 transition-smooth bg-muted">
            {builder.avatar ? (
              <img
                src={builder.avatar}
                alt={builder.name}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            ) : (
              <div className="h-full w-full gradient-soft flex items-center justify-center text-2xl font-semibold text-primary">
                {builder.name[0]}
              </div>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-lg leading-tight">{builder.name}</h3>
        <a
          href={`https://x.com/${builder.username}`}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/60 hover:bg-accent text-xs font-medium text-foreground/80 hover:text-primary transition-smooth border border-border/60 hover:border-primary/40"
        >
          <XIcon className="h-3 w-3" />
          @{builder.username}
          <ExternalLink className="h-3 w-3 opacity-60" />
        </a>

        <div className="my-4 flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-gradient tabular-nums">{builder.voteCount}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">votes</span>
        </div>

        <Button
          onClick={onVote}
          disabled={!canVote || voting}
          className="w-full rounded-full gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:bg-muted disabled:bg-none disabled:text-muted-foreground"
        >
          {voting ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Voting…</>
          ) : (
            <><ThumbsUp className="h-4 w-4 mr-2" />Vote</>
          )}
        </Button>
      </div>
    </div>
  );
};

export const BuilderCardSkeleton = () => (
  <div className="bg-card rounded-2xl p-6 shadow-card border border-border/60">
    <div className="flex flex-col items-center">
      <div className="h-24 w-24 rounded-full animate-shimmer mb-4" />
      <div className="h-5 w-24 animate-shimmer rounded mb-2" />
      <div className="h-4 w-20 animate-shimmer rounded mb-4" />
      <div className="h-8 w-16 animate-shimmer rounded mb-4" />
      <div className="h-10 w-full animate-shimmer rounded-full" />
    </div>
  </div>
);
