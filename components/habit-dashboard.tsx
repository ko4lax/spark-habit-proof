"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import {
  CONTRACT_ADDRESS,
  HABITPROOF_ABI,
  MONAD_TESTNET,
} from "@/lib/contract";

type Habit = {
  id: number;
  name: string;
  streak: number;
  count: number;
  lastCheckIn: number; // unix seconds
  createdAt: number;
  active: boolean;
  checkedToday: boolean;
};

const DAY = 86400;

export default function HabitDashboard() {
  const [account, setAccount] = useState<string>("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newName, setNewName] = useState("");
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const connect = useCallback(async () => {
    try {
      setStatus("Connecting wallet…");
      if (!window.ethereum) {
        setStatus("No wallet found. Install MetaMask.");
        return;
      }
      const p = new ethers.BrowserProvider(window.ethereum);
      const net = await p.getNetwork();
      if (net.chainId !== 10143n) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: MONAD_TESTNET.chainId }],
          });
        } catch {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [MONAD_TESTNET],
          });
        }
      }
      const signer = await p.getSigner();
      const addr = await signer.getAddress();
      setProvider(p);
      setAccount(addr);
      setStatus(`Connected: ${addr.slice(0, 6)}…${addr.slice(-4)}`);
    } catch (e: unknown) {
      setStatus(`Connect failed: ${(e as Error).message}`);
    }
  }, []);

  const loadHabits = useCallback(
    async (p: ethers.BrowserProvider, addr: string) => {
      try {
        const c = new ethers.Contract(CONTRACT_ADDRESS, HABITPROOF_ABI, p);
        const count: bigint = await c.habitCount(addr);
        const now = Math.floor(Date.now() / 1000);
        const out: Habit[] = [];
        for (let i = 0; i < Number(count); i++) {
          const h = await c.habits(addr, i);
          const last = Number(h.lastCheckIn);
          out.push({
            id: i,
            name: h.name,
            streak: Number(h.streak),
            count: Number(h.count),
            lastCheckIn: last,
            createdAt: Number(h.createdAt),
            active: h.active,
            checkedToday: last > 0 && now - last < DAY && now - last >= 0,
          });
        }
        setHabits(out);
      } catch (e: unknown) {
        setStatus(`Load failed: ${(e as Error).message}`);
      }
    },
    []
  );

  useEffect(() => {
    if (account && provider) loadHabits(provider, account);
  }, [account, provider, loadHabits]);

  const createHabit = async () => {
    if (!provider || !newName.trim()) return;
    setBusy(true);
    setStatus("Creating habit onchain…");
    try {
      const signer = await provider.getSigner();
      const c = new ethers.Contract(CONTRACT_ADDRESS, HABITPROOF_ABI, signer);
      const tx = await c.createHabit(newName.trim());
      await tx.wait();
      setNewName("");
      setStatus("Habit created. Your streak starts now.");
      await loadHabits(provider, account);
    } catch (e: unknown) {
      setStatus(`Create failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const checkIn = async (id: number) => {
    if (!provider) return;
    setBusy(true);
    setStatus("Signing your check-in…");
    try {
      const signer = await provider.getSigner();
      const c = new ethers.Contract(CONTRACT_ADDRESS, HABITPROOF_ABI, signer);
      const tx = await c.checkIn(id);
      await tx.wait();
      setStatus("Checked in. Streak extended onchain.");
      await loadHabits(provider, account);
    } catch (e: unknown) {
      setStatus(`Check-in failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const totalStreak = useMemo(
    () => habits.reduce((s, h) => s + h.streak, 0),
    [habits]
  );

  if (!account) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-[#94a99b]">
          HabitProof
        </h1>
        <p className="mt-4 max-w-md text-[#7a7068]">
          Habit apps own your streaks. They can reset them, fake them, or take
          them when they shut down. HabitProof stores every check-in onchain on
          Monad Testnet, so your streak is yours, permanently and verifiably.
        </p>
        <button
          onClick={connect}
          className="mt-8 rounded-xl bg-[#94a99b] px-6 py-3 font-semibold text-[#0d0b08] transition-colors hover:bg-[#a8bfb2]"
        >
          Connect Wallet
        </button>
        <p className="mt-3 text-xs text-[#5c5449]">
          Needs MetaMask + Monad Testnet MON (free from faucet).
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#94a99b]">
            HabitProof
          </h1>
          <p className="text-sm text-[#7a7068]">
            {account.slice(0, 6)}…{account.slice(-4)} · {totalStreak} total
            streak days
          </p>
        </div>
        <span className="rounded-full border border-[#2a2520] bg-[#13110e] px-3 py-1 text-xs text-[#6a7a72]">
          Monad Testnet
        </span>
      </header>

      <section className="mt-8 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New habit (e.g. Read 20 min)"
          className="flex-1 rounded-xl border border-[#2a2520] bg-[#13110e] px-4 py-3 text-[#6a7a72] outline-none placeholder:text-[#5c5449] focus:border-[#94a99b]/40"
        />
        <button
          onClick={createHabit}
          disabled={busy || !newName.trim()}
          className="rounded-xl bg-[#94a99b] px-5 py-3 font-semibold text-[#0d0b08] transition-colors hover:bg-[#a8bfb2] disabled:opacity-40"
        >
          Add
        </button>
      </section>

      <section className="mt-8 space-y-3">
        {habits.length === 0 && (
          <p className="text-sm text-[#5c5449]">
            No habits yet. Add one and check in daily to build your proof.
          </p>
        )}
        {habits.map((h) => (
          <div
            key={h.id}
            className="flex items-center justify-between rounded-xl border border-[#2a2520] bg-[#13110e] p-4"
          >
            <div>
              <p className="text-[#6a7a72] font-medium">{h.name}</p>
              <p className="text-sm text-[#5c5449]">
                🔥 {h.streak} day streak · {h.count} total check-ins
              </p>
            </div>
            <button
              onClick={() => checkIn(h.id)}
              disabled={busy || h.checkedToday}
              className="rounded-lg border border-[#2a2520] px-4 py-2 text-sm font-semibold text-[#94a99b] transition-colors hover:border-[#94a99b]/40 disabled:opacity-40"
            >
              {h.checkedToday ? "Done today" : "Check in"}
            </button>
          </div>
        ))}
      </section>

      {status && (
        <p className="mt-6 text-xs text-[#7a7068]">{status}</p>
      )}
      <footer className="mt-12 border-t border-[#2a2520] pt-6 text-xs text-[#5c5449]">
        Every check-in is a permanent, public record on Monad Testnet. No app,
        no company, no update can take it from you.
      </footer>
    </main>
  );
}
