import { useCallback, useEffect, useState } from "react";
import { Contract, JsonRpcProvider, BrowserProvider, JsonRpcSigner } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS, BUILDERS, RITUAL_CHAIN, MAX_VOTES } from "@/lib/contract";

export interface Builder {
  index: number;
  name: string;
  username: string;
  voteCount: number;
  avatar?: string;
}

const avatarCache = new Map<string, string>();

async function fetchAvatar(username: string): Promise<string | undefined> {
  if (avatarCache.has(username)) return avatarCache.get(username);
  try {
    const res = await fetch(`https://api.fxtwitter.com/${username}`);
    if (!res.ok) return undefined;
    const data = await res.json();
    const url = data?.user?.avatar_url ?? data?.user?.profile_image_url;
    if (url) {
      const hi = String(url).replace("_normal", "_400x400");
      avatarCache.set(username, hi);
      return hi;
    }
  } catch {}
  return undefined;
}

function getReadProvider() {
  return new JsonRpcProvider(RITUAL_CHAIN.rpcUrl, RITUAL_CHAIN.chainId);
}

export function useBuilders(signer: JsonRpcSigner | null, address: string | null) {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  const [remaining, setRemaining] = useState<number>(MAX_VOTES);
  const [refreshing, setRefreshing] = useState(false);

  const loadAvatars = useCallback(async (list: Builder[]) => {
    const withAvatars = await Promise.all(
      list.map(async (b) => ({ ...b, avatar: await fetchAvatar(b.username) }))
    );
    setBuilders(withAvatars);
  }, []);

  const fetchData = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const provider = getReadProvider();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      let onChain: Array<{ name: string; username: string; voteCount: bigint }> = [];
      try {
        const result = await contract.getBuilders();
        onChain = result.map((b: any) => ({
          name: b.name ?? b[0],
          username: b.username ?? b[1],
          voteCount: b.voteCount ?? b[2],
        }));
      } catch {
        onChain = [];
      }

      const merged: Builder[] = BUILDERS.map((b, i) => {
        const chain = onChain[i];
        return {
          index: i,
          name: chain?.name || b.name,
          username: chain?.username || b.username,
          voteCount: chain ? Number(chain.voteCount) : 0,
        };
      });

      setBuilders((prev) => {
        // preserve avatars while we refetch
        return merged.map((m) => ({ ...m, avatar: prev.find((p) => p.index === m.index)?.avatar }));
      });
      loadAvatars(merged);

      if (address) {
        try {
          const r = await contract.remainingVotes(address);
          setRemaining(Number(r));
        } catch {
          setRemaining(MAX_VOTES);
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [address, loadAvatars]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const vote = useCallback(
    async (builderIndex: number) => {
      if (!signer) throw new Error("Wallet not connected");
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.vote(builderIndex);
      return tx;
    },
    [signer]
  );

  return { builders, loading, remaining, refreshing, refresh: () => fetchData(true), vote };
}
