import { useCallback, useEffect, useState } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { toast } from "sonner";
import { RITUAL_CHAIN } from "@/lib/contract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);

  const ensureRitualChain = useCallback(async () => {
    if (!window.ethereum) return false;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: RITUAL_CHAIN.chainIdHex }],
      });
      return true;
    } catch (err: any) {
      if (err.code === 4902 || err?.data?.originalError?.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: RITUAL_CHAIN.chainIdHex,
                chainName: RITUAL_CHAIN.name,
                nativeCurrency: RITUAL_CHAIN.currency,
                rpcUrls: [RITUAL_CHAIN.rpcUrl],
                blockExplorerUrls: [RITUAL_CHAIN.explorer],
              },
            ],
          });
          return true;
        } catch (e) {
          toast.error("Failed to add Ritual network");
          return false;
        }
      }
      toast.error("Failed to switch to Ritual network");
      return false;
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected. Please install a Web3 wallet.");
      return;
    }
    setConnecting(true);
    try {
      const ok = await ensureRitualChain();
      if (!ok) {
        setConnecting(false);
        return;
      }
      const browserProvider = new BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const network = await browserProvider.getNetwork();
      const newSigner = await browserProvider.getSigner();
      setProvider(browserProvider);
      setSigner(newSigner);
      setAddress(accounts[0]);
      setChainId(Number(network.chainId));
      toast.success("Wallet connected");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  }, [ensureRitualChain]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setSigner(null);
    setProvider(null);
    setChainId(null);
    toast("Wallet disconnected");
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccounts = (accounts: string[]) => {
      if (accounts.length === 0) disconnect();
      else setAddress(accounts[0]);
    };
    const handleChain = (cid: string) => {
      setChainId(parseInt(cid, 16));
      window.location.reload();
    };
    window.ethereum.on?.("accountsChanged", handleAccounts);
    window.ethereum.on?.("chainChanged", handleChain);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccounts);
      window.ethereum?.removeListener?.("chainChanged", handleChain);
    };
  }, [disconnect]);

  const isCorrectChain = chainId === RITUAL_CHAIN.chainId;

  return { address, provider, signer, chainId, connecting, isCorrectChain, connect, disconnect, ensureRitualChain };
}
