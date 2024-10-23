"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import toast, { Toaster } from "react-hot-toast";

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
    // setAirdropStatus("Requesting airdrop...");
    toast.loading("Requesting airdrop...",{
      duration: 3000,
    });
    try {
      const airdropSignature = await connection.requestAirdrop(
        publicKey,
        LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(airdropSignature);
      toast.success("Airdrop successful!");
      updateBalance();
    } catch (error) {
      console.error("Airdrop failed:", error);
      toast.error("Airdrop failed. Please try again.");
    } finally {
      setIsAirdropping(false);
    }
  };

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      toast.success("Copied!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Solana Airdrop
        </h1>
        <div className="space-y-4">
          {publicKey ? (
            <>
              <p className="text-center text-gray-600 flex gap-4 justify-center">
                Connected :{" "}
                <div className="flex items-center gap-2">
                  <p
                    className="font-semibold cursor-pointer"
                    title={publicKey.toBase58()}
                    onClick={handleCopy}
                  >
                    {publicKey.toBase58().slice(0, 4)}...
                    {publicKey.toBase58().slice(-4)}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="rounded hover:bg-black-600 transition duration-200 cursor-pointer text-[0.5rem] border-[1px] px-2 py-1"
                  >
                    {/* <img
                      src="/public/copy.png"
                      alt="copy image"
                      className="object-cover"
                      height={10}
                      width={10}
                    /> */}
                    Copy
                  </button>
                </div>
              </p>
              <Toaster />
              <p className="text-center text-gray-600 font-semibold">
                Balance: {balance !== null ? `${balance} SOL` : "Loading..."}
              </p>
              <div className="text-red-500">
                Note: You can request 1 SOL at a time.
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

      {/* Description Section */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          What is the Solana Airdrop?
        </h2>
        <p className="text-gray-600 text-center">
          Solana Airdrop is a program where eligible users can receive free SOL
          tokens. Connect your wallet to get started.
        </p>
      </div>

      {/* FAQs Section */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          FAQs
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              How does the airdrop work?
            </h3>
            <p className="text-gray-600">
              Once your wallet is connected, you can request 1 SOL per
              transaction. You must wait until the airdrop is completed before
              requesting more SOL.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              How often can I request SOL?
            </h3>
            <p className="text-gray-600">
              You can request 1 SOL once every 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mt-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Testimonials
        </h2>
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            "The Solana Airdrop was seamless. I received my 1 SOL instantly!" –
            User A
          </p>
          <p className="text-gray-600 text-center">
            "A great way to get started with Solana, highly recommend!" – User B
          </p>
        </div>
      </div>
    </div>
  );
};

export default SolanaAirdrop;
