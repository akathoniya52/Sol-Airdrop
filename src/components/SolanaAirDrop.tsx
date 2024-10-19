"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const SolanaAirdrop: React.FC = () => {
  const { publicKey, disconnect } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [airdropStatus, setAirdropStatus] = useState<string | null>(null);

  const connection = new Connection(
    "https://bessy-frq4bq-fast-devnet.helius-rpc.com/",
    "confirmed"
  );

  useEffect(() => {
    if (publicKey) {
      updateBalance();
    } else {
      setBalance(null);
    }
  }, [publicKey]);

  const updateBalance = async () => {
    if (publicKey) {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setBalance(null);
    setAirdropStatus(null);
  };

  const handleAirdrop = async () => {
    if (!publicKey) return;

    setIsAirdropping(true);
    setAirdropStatus("Requesting airdrop...");

    try {
      const airdropSignature = await connection.requestAirdrop(
        publicKey,
        LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(airdropSignature);
      setAirdropStatus("Airdrop successful!");
      updateBalance();
    } catch (error) {
      console.error("Airdrop failed:", error);
      setAirdropStatus("Airdrop failed. Please try again.");
    } finally {
      setIsAirdropping(false);
      let timeOut = setTimeout(() => {
        setAirdropStatus(null);
        clearTimeout(timeOut);
      }, 5000);
    }
  };

  return (
    <div className="min-[90vh] flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Solana Airdrop
        </h1>
        <div className="space-y-4">
          {publicKey ? (
            <>
              <p className="text-center text-gray-600">
                Connected: {publicKey.toBase58().slice(0, 4)}...
                {publicKey.toBase58().slice(-4)}
              </p>
              <p className="text-center text-gray-600">
                Balance: {balance !== null ? `${balance} SOL` : "Loading..."}
              </p>
              <div className="text-[red]">
                Note : You can request 1 SOL at a time.
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleDisconnect}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                >
                  Disconnect
                </button>
                <button
                  onClick={handleAirdrop}
                  disabled={isAirdropping}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200 disabled:opacity-50"
                >
                  {isAirdropping ? "Airdropping..." : "Request Airdrop"}
                </button>
              </div>
              {airdropStatus && (
                <p className="text-center text-sm text-gray-600">
                  {airdropStatus}
                </p>
              )}
            </>
          ) : (
            <WalletMultiButton className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-200" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SolanaAirdrop;
