import { existsSync, writeFileSync } from "node:fs";
import WDK from "@tetherto/wdk";

const envFile = ".env.local";

if (existsSync(envFile)) {
  console.log(`${envFile} existiert bereits.`);
  console.log("Eine neue Wallet wird nicht erzeugt.");
  process.exit(0);
}

const seedPhrase = WDK.getRandomSeedPhrase(24);

const content = [
  `OBOBA_SEED_PHRASE="${seedPhrase}"`,
  `OBOBA_RPC_URL="https://api.devnet.solana.com"`,
  "",
].join("\n");

writeFileSync(envFile, content, { encoding: "utf8", mode: 0o600 });

console.log("");
console.log("Oboba Devnet Wallet wurde initialisiert.");
console.log("");
console.log("Die Seed-Phrase wurde in .env.local gespeichert.");
console.log("Sie darf NICHT in Git, Screenshots, Chats oder öffentliche Repositories gelangen.");
console.log("");
