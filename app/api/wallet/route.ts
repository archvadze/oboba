import { NextResponse } from "next/server";
import WalletManagerSolana from "@tetherto/wdk-wallet-solana";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_RPC = "https://api.devnet.solana.com";
const LAMPORTS_PER_SOL = 1_000_000_000n;

function lamportsToSol(lamports: bigint): string {
  const whole = lamports / LAMPORTS_PER_SOL;

  const fraction = (lamports % LAMPORTS_PER_SOL)
    .toString()
    .padStart(9, "0");

  return `${whole}.${fraction}`;
}

export async function GET() {
  const seedPhrase = process.env.OBOBA_SEED_PHRASE;

  if (!seedPhrase) {
    return NextResponse.json(
      {
        error: "OBOBA_SEED_PHRASE is not configured.",
      },
      { status: 500 },
    );
  }

  const rpcUrl =
    process.env.OBOBA_RPC_URL ?? DEFAULT_RPC;

  let wallet: WalletManagerSolana | null = null;

  try {
    wallet = new WalletManagerSolana(seedPhrase, {
      provider: rpcUrl,
      commitment: "confirmed",
    });

    const account = await wallet.getAccount(0);

    const address = await account.getAddress();
    const balance = await account.getBalance();

    return NextResponse.json({
      name: "Oboba",
      network: "Solana Devnet",
      accountIndex: 0,
      address,
      balanceLamports: balance.toString(),
      balanceSol: lamportsToSol(balance),
    });
  } catch (error) {
    console.error("Oboba wallet error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to initialize Oboba wallet.",
      },
      { status: 500 },
    );
  } finally {
    wallet?.dispose();
  }
}
