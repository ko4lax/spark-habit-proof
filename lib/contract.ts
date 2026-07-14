// HabitProof contract config + ABI.
// Deployed on Monad Testnet (chainId 10143).
// After deploying the contract (see DEPLOY.md), set NEXT_PUBLIC_CONTRACT_ADDRESS
// and rebuild so the UI can talk to your instance.

export const MONAD_TESTNET = {
  chainId: "0x279F", // 10143
  chainName: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  blockExplorerUrls: ["https://testnet.monadexplorer.com"],
};

export const CONTRACT_ADDRESS: string =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000";

export const HABITPROOF_ABI = [
  "event HabitCreated(address indexed user, uint256 indexed habitId, string name, uint256 timestamp)",
  "event CheckedIn(address indexed user, uint256 indexed habitId, uint256 streak, uint256 timestamp)",
  "function createHabit(string name) returns (uint256)",
  "function checkIn(uint256 habitId)",
  "function habits(address, uint256) view returns (string name, uint256 streak, uint256 count, uint256 lastCheckIn, uint256 createdAt, bool active)",
  "function habitCount(address) view returns (uint256)",
] as const;
