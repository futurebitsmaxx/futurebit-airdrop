import Link from 'next/link';

export const metadata = {
  title: 'Docs — FutureBit',
  description: 'FutureBit platform documentation — staking guide, airdrop guide, referral system, FBiT token info, and FAQ.',
};

const TOKEN_MINT = 'CuubBzUTnQ4H2D2fHJCVWGEUEod2fJzq4nAPwfx8UGTu';

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5 live-badge">
            📚 DOCUMENTATION
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            FutureBit <span className="text-neon-green">Docs</span>
          </h1>
          <p className="text-gray-400">Platform guide — staking, airdrop, referrals, token info, and FAQ</p>
        </div>

        {/* Quick nav */}
        <div className="mb-10 p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-gray-400 text-sm font-semibold mb-3">Jump to Section</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {[
              ['getting-started', '🚀 Getting Started'],
              ['token',           '🪙 FBiT Token'],
              ['staking',         '💎 Staking Guide'],
              ['airdrop',         '🎁 Airdrop Guide'],
              ['referral',        '🤝 Referral System'],
              ['swap',            '🪐 Swap Guide'],
              ['security',        '🔒 Security Tips'],
              ['faq',             '❓ FAQ'],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="text-gray-500 hover:text-neon-green transition-colors py-1">
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Getting Started ── */}
        <section id="getting-started" className="mb-8">
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.1)' }}>
            <h2 className="text-xl font-bold text-white mb-4">🚀 Getting Started</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              FutureBit is a Solana-based DeFi platform. You need a Solana wallet to participate. No KYC, no email — just connect your wallet and start earning.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              {[
                { step: '01', icon: '🔗', title: 'Install a Wallet', desc: 'Download Phantom, Backpack, or Solflare from their official websites. Never download from unofficial links.' },
                { step: '02', icon: '◎',  title: 'Get SOL',          desc: 'Buy SOL on any major exchange (Binance, Coinbase) and transfer to your wallet. You need SOL for gas fees.' },
                { step: '03', icon: '🖱️',  title: 'Connect Wallet',  desc: 'Click "Connect Wallet" on FutureBit. Approve the connection request in your wallet. No SOL is spent for connecting.' },
              ].map(item => (
                <div key={item.step} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-xs font-bold text-gray-600 mb-2">{item.step}</div>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-white text-sm font-semibold mb-1">{item.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-yellow-400 text-xs">
                ⚠️ Always verify you are on the official website. FutureBit will NEVER DM you first or ask for your seed phrase.
              </p>
            </div>
          </div>
        </section>

        {/* ── FBiT Token ── */}
        <section id="token" className="mb-8">
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 className="text-xl font-bold text-white mb-4">🪙 FBiT Token</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Network',   value: 'Solana' },
                { label: 'Symbol',    value: 'FBiT' },
                { label: 'Decimals',  value: '6' },
                { label: 'DEX',       value: 'Jupiter' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl text-center" style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.1)' }}>
                  <div className="text-gray-500 text-xs mb-1">{item.label}</div>
                  <div className="text-neon-green font-bold text-sm">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-xs mb-1.5">Token Mint Address (Solana)</p>
              <div className="p-3 rounded-xl font-mono text-xs text-gray-400 break-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {TOKEN_MINT}
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-400">
              <p>• FBiT is the native utility token of the FutureBit ecosystem</p>
              <p>• Used for staking to earn rewards, referral commissions, and airdrop distribution</p>
              <p>• Tradeable on Jupiter DEX and any Solana-compatible DEX</p>
              <p>• Verify the mint address above before buying — beware of fake tokens</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a href={`https://solscan.io/token/${TOKEN_MINT}`} target="_blank" rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                🔍 View on Solscan ↗
              </a>
              <a href={`https://jup.ag/tokens/${TOKEN_MINT}`} target="_blank" rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                🪐 View on Jupiter ↗
              </a>
            </div>
          </div>
        </section>

        {/* ── Staking Guide ── */}
        <section id="staking" className="mb-8">
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 className="text-xl font-bold text-white mb-2">💎 Staking Guide</h2>
            <p className="text-gray-500 text-sm mb-5">Stake FBiT tokens to earn up to 300% APY on Solana</p>

            <div className="space-y-4 mb-6">
              {[
                { q: 'What is staking?',             a: 'Staking means locking your FBiT tokens in a smart contract for a defined period. In return, you earn staking rewards paid in FBiT. The longer you stake and the more you stake, the higher your rewards.' },
                { q: 'What APY can I earn?',         a: 'APY rates range from 50% to 300% depending on your staking tier and lock-up period. Rates are variable and set by the smart contract. 300% APY is the maximum rate for the highest tier.' },
                { q: 'What are the staking tiers?',  a: 'Tier 1 (Starter): Minimum 100 FBiT, 30-day lock\nTier 2 (Silver): Minimum 500 FBiT, 60-day lock\nTier 3 (Gold): Minimum 1,000 FBiT, 90-day lock\nTier 4 (Diamond): Minimum 5,000 FBiT, 180-day lock' },
                { q: 'Lucky Vault — what is it?',    a: 'Users who stake $100+ worth of FBiT for 30+ days automatically get lottery tickets for the monthly Lucky Vault draw. More stake = more tickets. The prize pool is $2,000+ monthly.' },
                { q: 'Can I unstake early?',         a: 'Early unstaking may incur a penalty as defined in the smart contract. Check the staking dashboard for your specific lock-up terms before staking.' },
              ].map(item => (
                <div key={item.q} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-white text-sm font-semibold mb-1.5">{item.q}</p>
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{item.a}</p>
                </div>
              ))}
            </div>

            <Link href="/stake" className="btn-primary text-sm">
              Go to Staking Dashboard →
            </Link>
          </div>
        </section>

        {/* ── Airdrop Guide ── */}
        <section id="airdrop" className="mb-8">
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.12)' }}>
            <h2 className="text-xl font-bold text-white mb-2">🎁 Airdrop Guide</h2>
            <p className="text-gray-500 text-sm mb-5">Earn free FBiT tokens by completing tasks — first 5,000 members only</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { icon: '👛', task: 'Connect Wallet',       pts: '+30 pts', desc: 'Connect your Solana wallet to verify your address' },
                { icon: '💬', task: 'Join Telegram',        pts: '+10 pts', desc: 'Join the official FutureBit Telegram group' },
                { icon: '🐦', task: 'Follow on Twitter',    pts: '+10 pts', desc: 'Follow @FutureBit_Sol on X (Twitter)' },
                { icon: '🔁', task: 'Retweet Launch Post',  pts: '+5 pts',  desc: 'Retweet our pinned launch announcement' },
                { icon: '📸', task: 'Follow on Instagram',  pts: '+5 pts',  desc: 'Follow FutureBit on Instagram' },
                { icon: '👥', task: 'Join Discord',         pts: '+5 pts',  desc: 'Join the FutureBit Discord server' },
                { icon: '🤝', task: 'Refer a Friend',       pts: '+20 pts', desc: 'Each verified referral earns you 20 points' },
              ].map(item => (
                <div key={item.task} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-white text-sm font-semibold">{item.task}</span>
                      <span className="text-neon-green text-xs font-bold shrink-0">{item.pts}</span>
                    </div>
                    <p className="text-gray-500 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.1)' }}>
              <p className="text-neon-green text-sm font-bold mb-1">Token Allocation Formula</p>
              <p className="text-gray-400 text-sm">100 points = 5 FBiT tokens</p>
              <p className="text-gray-500 text-xs mt-1">Minimum 70 points required to qualify for airdrop distribution</p>
            </div>

            <Link href="/airdrop" className="btn-primary text-sm">
              Go to Airdrop Page →
            </Link>
          </div>
        </section>

        {/* ── Referral System ── */}
        <section id="referral" className="mb-8">
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 className="text-xl font-bold text-white mb-2">🤝 10-Level Referral System</h2>
            <p className="text-gray-500 text-sm mb-5">Earn passive income from your entire network — up to 10 levels deep</p>

            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-gray-500 text-xs py-2 pr-4">Level</th>
                    <th className="text-left text-gray-500 text-xs py-2 pr-4">Relationship</th>
                    <th className="text-left text-gray-500 text-xs py-2">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Level 1', 'Direct referral',             '10%'],
                    ['Level 2', 'Referral of referral',        '5%'],
                    ['Level 3', '3rd generation',              '3%'],
                    ['Level 4', '4th generation',              '2%'],
                    ['Level 5', '5th generation',              '1%'],
                    ['Level 6–10', 'Deep network (per level)', '0.5%'],
                  ].map(([lvl, rel, pct]) => (
                    <tr key={lvl} className="border-b border-white/3">
                      <td className="text-neon-green font-bold text-xs py-2.5 pr-4">{lvl}</td>
                      <td className="text-gray-400 text-xs py-2.5 pr-4">{rel}</td>
                      <td className="text-white font-semibold text-xs py-2.5">{pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 text-sm text-gray-400 mb-5">
              <p>• Commissions are earned when your network stakes FBiT tokens</p>
              <p>• Paid automatically in FBiT via smart contract — no manual claiming needed</p>
              <p>• Your unique referral link is generated after connecting your wallet</p>
              <p>• Commission rates may be updated by governance — current rates in smart contract</p>
            </div>

            <Link href="/leaderboard" className="btn-primary text-sm">
              See Referral Leaderboard →
            </Link>
          </div>
        </section>

        {/* ── Swap Guide ── */}
        <section id="swap" className="mb-8">
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 className="text-xl font-bold text-white mb-2">🪐 Swap Guide</h2>
            <p className="text-gray-500 text-sm mb-5">Buy and sell FBiT on Jupiter DEX — Solana's #1 aggregator</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                { step: '1', title: 'Connect Phantom Wallet', desc: 'Click "Connect Wallet" inside the Jupiter swap widget. Approve in Phantom.' },
                { step: '2', title: 'Select Tokens',          desc: 'Input token: SOL or USDC. Output token: FBiT (auto-selected). Enter amount.' },
                { step: '3', title: 'Check Route & Slippage', desc: 'Jupiter finds the best route. Set slippage to 1–3% for small tokens. Check price impact.' },
                { step: '4', title: 'Confirm Swap',           desc: 'Click Swap and approve the transaction in your wallet. FBiT arrives in seconds.' },
              ].map(s => (
                <div key={s.step} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{s.step}</div>
                  <div>
                    <p className="text-white text-sm font-semibold mb-0.5">{s.title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-4">
              <p className="text-yellow-400 text-xs">
                ⚠️ Jupiter may show &quot;5 Warnings&quot; for FBiT — this is normal for newer tokens not yet verified on Jupiter&apos;s registry. Always verify the mint address before swapping.
              </p>
            </div>

            <Link href="/swap" className="btn-primary text-sm">
              Go to Swap Page →
            </Link>
          </div>
        </section>

        {/* ── Security Tips ── */}
        <section id="security" className="mb-8">
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,60,60,0.03)', border: '1px solid rgba(255,60,60,0.1)' }}>
            <h2 className="text-xl font-bold text-white mb-2">🔒 Security Tips</h2>
            <p className="text-gray-500 text-sm mb-5">Protect yourself from scams and phishing attacks</p>

            <div className="space-y-3">
              {[
                { icon: '🚫', title: 'NEVER share your seed phrase',      desc: 'No legitimate platform, support agent, or moderator will ever ask for your 12/24-word recovery phrase or private key.' },
                { icon: '🔗', title: 'Verify the URL',                    desc: 'The official website is futurebit.in. Check for typosquatting (futur3bit, futureblt, etc.). Bookmark the official URL.' },
                { icon: '📢', title: 'Official channels only',             desc: 'FutureBit team will only communicate through official Telegram/Twitter. Beware of fake accounts impersonating admins.' },
                { icon: '💰', title: 'Never send SOL to "verify" wallet', desc: 'Any claim that you need to send SOL to "activate" or "verify" your wallet is a scam. We do not require this.' },
                { icon: '🔍', title: 'Verify the token mint',              desc: `Always confirm the FBiT contract: ${TOKEN_MINT.slice(0,8)}...${TOKEN_MINT.slice(-8)}. Check on Solscan before buying.` },
                { icon: '📱', title: 'Use hardware wallets for large amounts', desc: 'For large holdings, use a Ledger hardware wallet with Phantom. This protects against malware.' },
              ].map(item => (
                <div key={item.title} className="flex gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-white text-sm font-semibold mb-0.5">{item.title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="mb-8">
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 className="text-xl font-bold text-white mb-5">❓ Frequently Asked Questions</h2>

            <div className="space-y-4">
              {[
                { q: 'Is FutureBit audited?',                      a: 'Smart contract audit is in process. Audit report will be published on our official channels when complete. Do not invest more than you can afford to lose pending the audit.' },
                { q: 'Which wallets are supported?',               a: 'Phantom, Backpack, and Solflare are fully supported. Any Solana-compatible wallet that supports WalletAdapter should work.' },
                { q: 'Do I need KYC?',                             a: 'No. FutureBit is a permissionless DeFi platform. No identity verification is required to stake, earn, or swap.' },
                { q: 'When is the airdrop distribution?',          a: 'Airdrop tokens are distributed after the campaign ends (June 8, 2026). Distribution date and method will be announced on official channels.' },
                { q: 'What is the minimum stake amount?',          a: 'The minimum staking amount is 100 FBiT tokens. Specific tiers have higher minimums for greater APY rates.' },
                { q: 'How are referral commissions paid?',         a: 'Referral commissions are paid automatically via smart contract in FBiT tokens when your referred users complete staking actions.' },
                { q: 'Is the 300% APY guaranteed?',               a: 'No. APY rates are estimates based on current protocol parameters and token emission schedules. Rates can change based on total staked volume and protocol updates. Higher APY = higher risk.' },
                { q: 'Can I participate from any country?',        a: 'The platform is geographically unrestricted at the smart contract level. However, you are responsible for complying with the laws of your own jurisdiction. US residents should be particularly cautious given SEC regulations.' },
                { q: 'How do I contact support?',                  a: 'Join our official Telegram group and post your question. For urgent issues, DM the official team account (verified blue check). Never trust DMs from unknown accounts offering help.' },
              ].map(item => (
                <div key={item.q} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-white text-sm font-semibold mb-1.5">Q: {item.q}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">A: {item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/terms"   className="text-gray-500 hover:text-neon-green transition-colors">Terms of Service →</Link>
          <Link href="/privacy" className="text-gray-500 hover:text-neon-green transition-colors">Privacy Policy →</Link>
          <Link href="/"        className="text-gray-500 hover:text-neon-green transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
