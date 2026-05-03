import { Builder } from "@/hooks/useBuilders";
import { Button } from "@/components/ui/button";
import { Loader2, ThumbsUp } from "lucide-react";

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
          href={`https://twitter.com/${builder.username}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted-foreground hover:text-primary transition-smooth"
        >
          @{builder.username}
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
