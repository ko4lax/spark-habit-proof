# Deploy guide — HabitProof (Monad Testnet)

Two things the agent can't do headless: deploy the contract (needs your
MetaMask) and create the DNS record (needs your DNS host). Everything else is
prepped. This is your ~10 minute handoff.

## 1. Deploy the contract

You need a browser + MetaMask with Monad Testnet MON (free).

1. **Add Monad Testnet to MetaMask** (if not already):
   - Network name: `Monad Testnet`
   - RPC URL: `https://testnet-rpc.monad.xyz`
   - Chain ID: `10143`
   - Currency: `MON`
   - Explorer: `https://testnet.monadexplorer.com`

2. **Get testnet MON** (no real money):
   - <https://faucets.chain.link/monad-testnet> — connect MetaMask, claim.

3. **Open Remix:** <https://remix.ethereum.org>

4. **Create the contract:** in Remix, make a new file `HabitProof.sol` and
   paste the contents of `contracts/HabitProof.sol` from this repo.

5. **Compile:** Solidity compiler tab → pick `0.8.24` or newer → Compile.

6. **Deploy:** Deploy tab → Environment: *Injected Provider - MetaMask* → make
   sure MetaMask is on Monad Testnet → click **Deploy**. Confirm the tx in
   MetaMask.

7. **Copy the address:** after deploy, the Deployed Contracts panel shows your
   contract address (copy it).

## 2. Wire the address into the app

```bash
cd /root/projects/spark-habit-proof
cp .env.local.example .env.local
# edit .env.local: set NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOURADDRESS
npx next build
pm2 restart spark-habit-proof   # if already running; see step 4 for first run
```

## 3. Create the DNS record

In your ko4lax.dev DNS host, add:

```
A   spark.ko4lax.dev   159.89.195.134
```

Wait for propagation (~5-15 min) before step 4's certbot.

## 4. Host it on the VPS (agent will run this, or you can)

```bash
# 1. install deps + build (agent runs)
cd /root/projects/spark-habit-proof && npm install && npm run build

# 2. nginx conf (write under project, cp to sites-enabled)
#    see infra/ files, server_name spark.ko4lax.dev, proxy_pass 127.0.0.1:3470

# 3. certbot
certbot certonly --nginx -d spark.ko4lax.dev --non-interactive --agree-tos -m hanifnugraha69@gmail.com
nginx -s reload

# 4. PM2 (port 3470, free per infra inventory)
pm2 start npm --name spark-habit-proof -- run start
# set PORT=3470 via ecosystem.config.js
```

## 5. Verify

```bash
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3470/   # expect 200
curl -s -o /dev/null -w "%{http_code}" https://spark.ko4lax.dev/  # expect 200
```

## Done

You now have: live app, deployed contract, repo, and (separately) a demo video
+ social post to submit at <https://buildanything.so/hackathons/spark>.
