'use client';

import { useWallet } from '../lib/walletProvider';

export default function HomePage() {
  const { isConnected, accountId, connectWallet, disconnectWallet } = useWallet();

  const handleWalletAction = async () => {
    try {
      if (isConnected) {
        await disconnectWallet();
      } else {
        await connectWallet();
      }
    } catch (error) {
      console.error('Wallet action failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            <span className="text-[#F5F5F5]">Echoin</span>
            <span className="text-[#a855f7]">Whispr</span>
          </h1>
        </div>

        {/* Tagline */}
        <div className="text-center">
          <h3 className="text-xl font-normal text-[#737373] mt-4">
            Connect by Merit. Not by Status.
          </h3>
        </div>

        {/* Body Text */}
        <div className="text-center">
          <p className="text-base text-[#F5F5F5]">
            Welcome. EchoinWhispr is a decentralized, anonymous social network. Connect your Hedera wallet to begin.
          </p>
        </div>

        {/* Wallet Status */}
        {isConnected && accountId && (
          <div className="text-center">
            <p className="text-sm text-[#737373]">
              Connected: {accountId}
            </p>
          </div>
        )}

        {/* Connect Wallet Button */}
        <div className="space-y-4">
          <button
            onClick={handleWalletAction}
            className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white px-6 py-3 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:ring-offset-2 focus:ring-offset-[#171717]"
          >
            {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
          </button>

          {/* Link */}
          <div className="text-center">
            <a
              href="#"
              className="text-sm text-[#c084fc] underline hover:text-[#c084fc]/80"
            >
              What is a Hedera wallet?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}