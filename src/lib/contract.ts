export const RITUAL_CHAIN = {
  chainId: 1979,
  chainIdHex: "0x7BB",
  name: "Ritual",
  currency: { name: "RITUAL", symbol: "RITUAL", decimals: 18 },
  rpcUrl: "https://rpc.ritualfoundation.org",
  explorer: "https://explorer.ritualfoundation.org",
};

export const CONTRACT_ADDRESS = "0xB4FBcaB3D42acD1c3d490382246e7C8B30d146d4";

export const CONTRACT_ABI = [
  "function vote(uint256 builderIndex) external",
  "function getBuilders() external view returns (tuple(string name, string username, uint256 voteCount)[])",
  "function remainingVotes(address user) external view returns (uint256)",
];

export const BUILDERS = [
  { name: "Meison", username: "meison_mswen" },
  { name: "Devarshi", username: "devarshi8539" },
  { name: "Zhugelyang", username: "zhugelyang" },
  { name: "Tanoy", username: "0xtanoy" },
  { name: "Seyoj", username: "seyoj7" },
  { name: "Cripson", username: "cripson01" },
  { name: "Decka", username: "decka_chan" },
  { name: "Tanjiro", username: "tanjiro3060" },
  { name: "Johntol", username: "johntolxbt" },
  { name: "Dayzer", username: "dayzer__" },
];

export const MAX_VOTES = 3;
