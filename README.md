# HabitProof

**Own your streaks. Permanently.**

Centralized habit apps hold your streak hostage: they can reset it, fake it, or
delete it when they shut down. HabitProof stores every check-in onchain on
**Monad Testnet**, so your streak is a permanent, public, tamper-proof record
that nobody but the chain can touch.

Built for the [Spark hackathon](https://buildanything.so/hackathons/spark) by
Build Anything (2026). Theme: *something that solves a daily problem* — winning
back your own consistency.

## The problem

You show up every day. The app that's supposed to celebrate that can quietly
reset your 200-day streak, lock your data behind a paywall, or vanish. Your
consistency deserves better than a private database you don't control.

## The solution

A dead-simple smart contract on Monad Testnet:

- `createHabit(name)` — start a habit, get a permanent record.
- `checkIn(habitId)` — once per day, extends your streak onchain.
- Everything is public and verifiable on the block explorer. No backend, no
  database, no middleman.

The UI is the product: a calm, focused dashboard that makes consistency feel
good (emotional-design principles — visceral, behavioral, reflective). Your
streaks live on a chain you don't run, so they outlive any single app.

## Stack

- **Frontend:** Next.js 15 + React 19 + Tailwind CSS (warm-dark editorial theme)
- **Chain:** Monad Testnet (EVM, chainId 10143)
- **Wallet:** MetaMask via ethers.js v6
- **Contract:** Solidity `HabitProof.sol` (Remix-deployable)

## Local dev

```bash
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_CONTRACT_ADDRESS
npm run dev                        # http://localhost:3000
```

## Deploy the contract (your 10-minute step)

1. Add Monad Testnet to MetaMask: RPC `https://testnet-rpc.monad.xyz`,
   chainId `10143`, symbol `MON`.
2. Get free testnet MON: <https://faucets.chain.link/monad-testnet>
3. Open <https://remix.ethereum.org>, create `HabitProof.sol` with the
   contract in `contracts/`, compile (Solidity 0.8.24+).
4. Deploy tab → Environment: *Injected Provider - MetaMask* → connect to Monad
   Testnet → Deploy.
5. Copy the deployed contract address, set `NEXT_PUBLIC_CONTRACT_ADDRESS`, rebuild.

Full steps in `DEPLOY.md`.

## Submission requirements (Spark)

- ✅ Live hosted web app (`spark.ko4lax.dev`)
- ✅ Public GitHub repo
- ✅ Deployed Monad Testnet contract
- ✅ Demo video (< 3 min)
- ✅ Social post (for the Most Viral Solution prize)

## License

MIT
