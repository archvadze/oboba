"use client";

import { useEffect, useState } from "react";

type WalletData = {
  name: string;
  network: string;
  chain: string;
  accountIndex: number;
  address: string;
  derivationPath: string;
  balanceLamports: string;
  balanceSol: string;
};

export default function Home() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadWallet() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/wallet", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Wallet konnte nicht geladen werden.");
      }

      setWallet(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unbekannter Fehler",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyAddress() {
    if (!wallet?.address) return;

    await navigator.clipboard.writeText(wallet.address);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  useEffect(() => {
    loadWallet();
  }, []);

  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">

        {/* Header */}

        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-bold">
              O
            </div>

            <div>
              <div className="text-sm font-semibold">
                Oboba
              </div>

              <div className="text-xs text-zinc-500">
                Wallet Laboratory
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-300">
              DEVNET
            </span>
          </div>
        </header>

        {/* Hero */}

        <section className="mt-20 max-w-3xl">
          <div className="text-sm font-medium text-violet-400">
            SOLANA × TETHER WDK
          </div>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            Your wallet.
            <br />
            Your keys.
            <br />
            Your control.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Oboba ist unser experimentelles Solana-Wallet,
            mit dem wir WDK, Accounts, Transaktionen, Tokens
            und Programme praktisch untersuchen.
          </p>
        </section>

        {/* Error */}

        {error && (
          <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-red-300">
            {error}
          </div>
        )}

        {/* Wallet */}

        <section className="mt-12 grid gap-5 lg:grid-cols-3">

          {/* Main Card */}

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-7 lg:col-span-2">

            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

            <div className="relative">

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500">
                    Wallet
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold">
                    {wallet?.name ?? "Oboba"}
                  </h2>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-zinc-400">
                  Account {wallet?.accountIndex ?? 0}
                </div>
              </div>

              <div className="mt-10">
                <p className="text-xs uppercase tracking-widest text-zinc-600">
                  Public address
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <code className="min-w-0 flex-1 break-all rounded-xl bg-black/30 px-4 py-3 text-sm text-zinc-200">
                    {loading
                      ? "Loading..."
                      : wallet?.address ?? "—"}
                  </code>

                  <button
                    onClick={copyAddress}
                    disabled={!wallet}
                    className="shrink-0 rounded-xl border border-white/10 px-4 py-3 text-sm transition hover:bg-white/5 disabled:opacity-40"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
                  <p className="text-xs text-zinc-600">
                    Network
                  </p>

                  <p className="mt-2 font-medium">
                    Solana Devnet
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
                  <p className="text-xs text-zinc-600">
                    Derivation path
                  </p>

                  <code className="mt-2 block text-sm text-zinc-300">
                    {wallet?.derivationPath ?? "—"}
                  </code>
                </div>

              </div>

            </div>
          </div>

          {/* Balance */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">

            <p className="text-sm text-zinc-500">
              SOL Balance
            </p>

            <div className="mt-8">
              <div className="text-4xl font-semibold tracking-tight">
                {loading
                  ? "—"
                  : wallet?.balanceSol ?? "0.000000000"}
              </div>

              <div className="mt-2 text-sm text-zinc-500">
                SOL
              </div>
            </div>

            <div className="mt-10 border-t border-white/5 pt-5">
              <p className="text-xs text-zinc-600">
                Native unit
              </p>

              <p className="mt-2 font-mono text-sm text-zinc-400">
                {wallet?.balanceLamports ?? "0"} lamports
              </p>
            </div>

          </div>

        </section>

        {/* Controls */}

        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.02] p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="font-medium">
                Wallet session
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                WDK initialisiert Account 0 auf Solana Devnet.
              </p>
            </div>

            <button
              onClick={loadWallet}
              disabled={loading}
              className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh wallet"}
            </button>

          </div>
        </section>

        {/* Security */}

        <section className="mt-5 rounded-3xl border border-amber-500/10 bg-amber-500/[0.025] p-6">

          <p className="text-sm font-medium text-amber-300">
            Development wallet
          </p>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
            Oboba verwendet ausschließlich eine lokale Devnet-Seed-Phrase.
            Die geheime Seed-Phrase wird nicht an den Browser gesendet
            und darf niemals veröffentlicht werden.
          </p>

        </section>

        {/* Footer */}

        <footer className="mt-16 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Oboba Wallet Laboratory
          </span>

          <span>
            Solana Devnet · Tether WDK
          </span>
        </footer>

      </div>
    </main>
  );
}