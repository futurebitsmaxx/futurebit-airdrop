'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import WalletModal from '@/components/WalletModal';
import {
  loadVaultAdminConfig, DEFAULT_VAULT_ADMIN_CONFIG, type LuckyVaultAdminConfig,
  submitVaultReg, loadVaultReg, type VaultRegistration,
} from '@/lib/airdropConfig';

export default function StakingPage() {
  const { walletAddress, referralCount } = useAppStore();

  const [amount,     setAmount]     = useState('');
  const [days,       setDays]       = useState(30);
  const [txHash,     setTxHash]     = useState('');
  const [showWallet, setShowWallet] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [regData,    setRegData]    = useState<VaultRegistration | null>(null);
  const [vaultCfg,   setVaultCfg]   = useState<LuckyVaultAdminConfig>(DEFAULT_VAULT_ADMIN_CONFIG);

  useEffect(() => {
    setVaultCfg(loadVaultAdminConfig());
    setRegData(loadVaultReg());
  }, []);

  const calcTickets = (a: number, d: number): number => {
    let t = Math.floor(a / vaultCfg.minStake);
    if (d >= 60) t = Math.floor(t * 1.5);
    if (referralCount > 0) t += 2;
    return Math.min(vaultCfg.maxTickets, t);
  };

  const previewTickets = () => calcTickets(parseFloat(amount) || 0, days);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!walletAddress) { setShowWallet(true); return; }

    const a = parseFloat(amount);
    if (isNaN(a) || a < vaultCfg.minStake) {
      setError(`Minimum stake is $${vaultCfg.minStake}`);
      return;
    }
    if (!txHash.trim()) {
      setError('Please enter your Solana stake transaction hash');
      return;
    }
    // Basic client-side length check before hitting API
    if (txHash.trim().length < 80 || txHash.trim().length > 100) {
      setError('Transaction hash looks invalid — please paste the full Solana tx signature');
      return;
    }

    const reg: VaultRegistration = {
      wallet:       walletAddress,
      txHash:       txHash.trim(),
      amount:       a,
      days,
      tickets:      calcTickets(a, days),
      registeredAt: new Date().toISOString(),
    };

    setLoading(true);
    const result = await submitVaultReg(reg);
    setLoading(false);

    if (!result.ok) {
      setError(result.error ?? 'Registration failed — please try again');
      return;
    }

    setRegData(reg);
  };

  // Already registered
  if (regData) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="staking-success-card rounded-2xl p-10">
          <div className="text-6xl mb-5">🎰</div>
          <h1 className="text-3xl font-extrabold text-white mb-3">You&apos;re Registered!</h1>
          <p className="text-gray-400 mb-6">
            Your stake has been recorded. You hold{' '}
            <span className="text-neon-green font-bold text-2xl">{regData.tickets}</span>{' '}
            lottery ticket{regData.tickets !== 1 ? 's' : ''}.
            <br />Draw date: <strong className="text-white">{vaultCfg.drawDate}</strong>
          </p>

          <div className="staking-ticket-summary rounded-xl p-5 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-gray-500">Wallet</p>
                <p className="text-white font-mono text-xs truncate">{regData.wallet}</p>
              </div>
              <div>
                <p className="text-gray-500">Stake Tx</p>
                <a
                  href={`https://solscan.io/tx/${regData.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-green font-mono text-xs underline truncate block"
                >
                  {regData.txHash.slice(0, 20)}…
                </a>
              </div>
              <div>
                <p className="text-gray-500">Amount Staked</p>
                <p className="text-white font-bold">${regData.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Lock Duration</p>
                <p className="text-white font-bold">{regData.days} days</p>
              </div>
            </div>
            <p className="text-gray-600 text-xs">Registration saved on-chain reference. Admin will verify your stake before the draw.</p>
          </div>

          <p className="text-yellow-500 text-sm font-medium">
            ⚠️ Keep your stake active through the draw date. Early withdrawal = disqualification.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5 staking-badge">
          🎰 LUCKY VAULT — {vaultCfg.isOpen ? 'OPEN' : 'CLOSED'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
          Staking <span className="text-yellow-400">Lucky Vault</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Stake FBiT, hold — and win the <strong className="text-white">{vaultCfg.monthlyPrize} monthly prize</strong>!
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Monthly draw verified by FutureBit Community Team • Draw date: {vaultCfg.drawDate}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Entry Form */}
        <div>
          {/* How it works banner */}
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 mb-5 text-sm text-yellow-300">
            <p className="font-semibold mb-1">📋 How to enter</p>
            <ol className="list-decimal list-inside space-y-1 text-yellow-200/80 text-xs">
              <li>Stake FBiT on Solana (min ${vaultCfg.minStake})</li>
              <li>Copy your stake transaction hash from your wallet or Solscan</li>
              <li>Submit the form below — your entry is stored on our servers</li>
              <li>Admin verifies your on-chain stake before the draw</li>
            </ol>
          </div>

          <div className="staking-form-card rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-5">Register Your Stake</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Staking Amount (Min ${vaultCfg.minStake})
                </label>
                <input
                  type="number"
                  min={vaultCfg.minStake}
                  step="10"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Amount in USD..."
                  className="staking-input w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm"
                />
                <p className="text-gray-600 text-xs mt-1.5">
                  ${vaultCfg.minStake} = 1 ticket • Max {vaultCfg.maxTickets} tickets per wallet
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  Lock Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 60, 90].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDays(d)}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        days === d ? 'staking-days-active' : 'staking-days-inactive'
                      }`}
                    >
                      {d} days
                      {d >= 60 && <span className="block text-xs font-normal mt-0.5">1.5x tickets</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Stake Transaction Hash <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={e => setTxHash(e.target.value)}
                  placeholder="Paste your Solana tx hash here..."
                  className="staking-input w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 text-xs font-mono"
                />
                <p className="text-gray-600 text-xs mt-1.5">
                  Find it in your wallet or on{' '}
                  <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" className="text-neon-green underline">
                    solscan.io
                  </a>
                </p>
              </div>

              {/* Ticket Preview */}
              {parseFloat(amount) >= vaultCfg.minStake && (
                <div className="ticket-card p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">You will receive</p>
                  <p className="text-4xl font-black text-neon-purple">{previewTickets()}</p>
                  <p className="text-gray-400 text-sm">Lottery Tickets 🎟️</p>
                  {referralCount > 0 && (
                    <p className="text-neon-green text-xs mt-1">+2 referral bonus tickets included</p>
                  )}
                </div>
              )}

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={!vaultCfg.isOpen || loading}
                className="btn-primary w-full text-base py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!vaultCfg.isOpen
                  ? '🔴 Vault Closed'
                  : loading
                    ? 'Registering…'
                    : walletAddress
                      ? 'Register My Stake 🎰'
                      : 'Connect Wallet First'}
              </button>
            </form>
          </div>

          {/* Terms */}
          <div className="staking-terms-card rounded-xl p-4">
            <h4 className="text-white text-sm font-semibold mb-3">📋 Terms &amp; Conditions</h4>
            <ul className="space-y-1.5 text-xs text-gray-500">
              <li>• Stake FBiT on Solana — minimum ${vaultCfg.minStake} equivalent</li>
              <li>• Lock period: 30 days minimum (no early withdrawal)</li>
              <li>• Each ${vaultCfg.minStake} staked = 1 ticket (max {vaultCfg.maxTickets} per wallet)</li>
              <li>• 60+ days lock = 1.5x ticket multiplier</li>
              <li>• Active referral member = +2 bonus tickets</li>
              <li>• Monthly draw conducted by FutureBit Community Team — results published on official channels</li>
              <li>• Admin verifies on-chain stake before draw — invalid entries are disqualified</li>
              <li>• Early withdrawal before draw date = automatic disqualification</li>
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Prize Table */}
          <div className="staking-prize-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-1">🏆 Prize Structure</h2>
            <p className="text-gray-500 text-xs mb-5">Total pool: {vaultCfg.monthlyPrize} per draw</p>
            <div className="space-y-3">
              {[
                { tier: 'Grand Prize',   winners: 1,   reward: '~40% of pool', icon: '🥇', color: 'rank-gold'      },
                { tier: 'Silver Prize',  winners: 3,   reward: '~14% each',    icon: '🥈', color: 'rank-silver'    },
                { tier: 'Bronze Prize',  winners: 10,  reward: '~2.8% each',   icon: '🥉', color: 'rank-bronze'    },
                { tier: 'Participation', winners: 999, reward: '50 FBiT + APY Boost', icon: '🎁', color: 'text-neon-green' },
              ].map(p => (
                <div key={p.tier} className="flex items-center gap-4 p-3 rounded-xl staking-prize-row">
                  <span className="text-2xl">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">{p.tier}</p>
                    <p className="text-gray-500 text-xs">
                      {p.winners === 999 ? 'All eligible stakers' : `${p.winners} winner${p.winners > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <span className={`font-bold text-sm text-right ${p.color}`}>{p.reward}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-4">Prize amounts confirmed by the FutureBit Community Team before each draw based on pool size.</p>
          </div>

          {/* Multipliers */}
          <div className="staking-multipliers-card rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">🚀 Ticket Multipliers</h3>
            <div className="space-y-2">
              {[
                { label: 'Stake for 60+ days',     bonus: '1.5x tickets'    },
                { label: 'Active referral member',  bonus: '+2 bonus tickets'},
              ].map(m => (
                <div key={m.label} className="flex justify-between items-center text-sm py-2 border-b border-white/4 last:border-0">
                  <span className="text-gray-400">{m.label}</span>
                  <span className="text-neon-green font-bold">{m.bonus}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Share card — no fake ticket promise */}
          <div className="staking-twitter-card rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">Share on X / Twitter</p>
            <p className="text-gray-300 text-sm leading-relaxed italic">
              &quot;💰 STAKE. HOLD. WIN. 🎰<br />
              Just entered the FutureBit Lucky Vault! Stake ${vaultCfg.minStake}+ FBiT and win
              {' '}{vaultCfg.monthlyPrize} every month!<br />
              #FBiTStaking #CryptoIndia #StakeAndWin&quot;
            </p>
            <a
              href="https://twitter.com/intent/tweet?text=💰 Stake. Hold. Win. %23FBiTStaking %23CryptoIndia"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs btn-outline py-1.5 px-3"
            >
              Share on X →
            </a>
          </div>
        </div>
      </div>

      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
    </div>
  );
}
