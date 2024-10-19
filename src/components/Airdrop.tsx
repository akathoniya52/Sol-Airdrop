import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export function Airdrop() {
  const wallet = useWallet();

  const { connection } = useConnection();

  async function sendAirdropToUser() {
    // @ts-ignore
    const amount: any = document.getElementById("amount")?.value;
    if (wallet) {
      // @ts-ignore
      connection.requestAirdrop(wallet?.publicKey, 1 * 100000000);
    }
  }

  return (
    <div>
      {wallet && <div>hi, {wallet?.publicKey?.toString()}</div>}
      <input type="text" id="amount" placeholder="Amount" value={"1 Sol"} readOnly />
      <button onClick={sendAirdropToUser}>Airdrop</button>
    </div>
  );
}
