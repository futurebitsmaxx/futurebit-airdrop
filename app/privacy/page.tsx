import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — FutureBit',
  description: 'FutureBit Privacy Policy — how we handle your data on the Solana DeFi platform.',
};

const sections = [
  {
    id: 'overview',
    title: '1. Overview',
    content: `FutureBit ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect information when you use the FutureBit platform.

Because FutureBit is a decentralized application (dApp) built on the Solana blockchain, our data practices differ significantly from traditional web services. We collect minimal personal information and rely primarily on on-chain, publicly verifiable data.`,
  },
  {
    id: 'collect',
    title: '2. Information We Collect',
    content: `We collect only the following information:

WALLET ADDRESS
When you connect your Solana wallet (Phantom, Backpack, Solflare, etc.), we receive your public wallet address. This is a public blockchain address — not linked to your real identity unless you choose to associate it.

REFERRAL ACTIVITY
We track referral relationships (which wallet referred which) to calculate and distribute referral commissions. This data is stored on-chain and is publicly verifiable.

AIRDROP TASKS
Completion of airdrop tasks (e.g., joining Telegram, following Twitter) is recorded against your wallet address to calculate point scores.

TRANSACTION DATA
All staking, unstaking, and swap transactions are recorded on the Solana blockchain and are publicly visible by anyone. We do not control this data.

LOCAL STORAGE
We store your airdrop progress and preferences in your browser's localStorage. This data never leaves your device.`,
  },
  {
    id: 'not-collect',
    title: '3. Information We Do NOT Collect',
    content: `We do NOT collect:

• Your name, email address, or phone number (unless you voluntarily provide them for support)
• Your IP address (beyond standard web server logs which are auto-deleted after 7 days)
• Location data or device identifiers
• Private keys, seed phrases, or any wallet credentials — NEVER share these with anyone
• Payment card information
• Government ID or KYC documents (we are a permissionless DeFi platform)`,
  },
  {
    id: 'use',
    title: '4. How We Use Your Information',
    content: `We use the collected information to:

• Verify airdrop task completion and calculate points
• Calculate and distribute referral commissions
• Display your staking balance and rewards on the dashboard
• Prevent fraud, bot activity, and gaming of the referral system
• Improve Platform performance and user experience

We do NOT:
• Sell your wallet address or data to third parties
• Use your data for targeted advertising
• Share your data with data brokers`,
  },
  {
    id: 'blockchain',
    title: '5. Blockchain Transparency',
    content: `The Solana blockchain is a public, permissionless ledger. Any transactions you make on the Platform — staking, unstaking, swapping — are permanently recorded on the blockchain and are publicly visible.

This means:
• Anyone can view your transaction history associated with your wallet address
• Blockchain data cannot be deleted or modified
• We have no control over data stored on the blockchain

If you require privacy for financial transactions, consider using a privacy-focused tool before interacting with DeFi platforms.`,
  },
  {
    id: 'third-party',
    title: '6. Third-Party Services',
    content: `The Platform integrates with the following third-party services:

JUPITER DEX
The swap feature uses Jupiter Aggregator's API and plugin. When you swap tokens, Jupiter's smart contracts process the transaction. Jupiter's privacy policy applies to their services.

SOLSCAN
Token and transaction information is linked to Solscan block explorer. Solscan's own privacy policy governs that service.

HELIUS RPC
We use Helius as our Solana RPC provider for fast, reliable blockchain data. Helius may log RPC requests per their terms.

SOCIAL PLATFORMS
Airdrop tasks may require interaction with Telegram, X (Twitter), Discord, or Instagram. Those platforms' privacy policies apply to your activity there.

We are not responsible for the privacy practices of these third-party services.`,
  },
  {
    id: 'cookies',
    title: '7. Cookies & Local Storage',
    content: `We use browser localStorage (not cookies) to store:

• Your connected wallet address (session only)
• Airdrop task completion status
• Admin configuration settings (admin panel only)
• UI preferences

We do not use tracking cookies or third-party analytics cookies. If the Platform uses any analytics in future, we will update this policy and obtain consent.`,
  },
  {
    id: 'security',
    title: '8. Data Security',
    content: `We take reasonable measures to protect your information:

• All Platform communications use HTTPS/TLS encryption
• We do not store sensitive wallet data on our servers
• Admin access is password-protected
• Smart contracts are deployed on Solana mainnet with immutable code

However, no system is 100% secure. We cannot guarantee absolute security of data transmitted to our Platform.

IMPORTANT: FutureBit support will NEVER ask for your private keys, seed phrases, or wallet passwords. Any such request is a scam.`,
  },
  {
    id: 'rights',
    title: '9. Your Rights',
    content: `Because we collect minimal personal data, most privacy rights are satisfied by default. Specifically:

• Right to Access: Your wallet address and on-chain activity are publicly accessible on Solscan at any time.

• Right to Deletion: Off-chain data (airdrop task records) can be deleted by clearing your browser's localStorage. On-chain data cannot be deleted (blockchain is permanent).

• Right to Portability: You can export your localStorage data using browser developer tools.

• Right to Object: You can stop using the Platform at any time. Disconnecting your wallet removes your session data.

For any data requests, contact us at the addresses in Section 11.`,
  },
  {
    id: 'children',
    title: '10. Children\'s Privacy',
    content: `The Platform is not intended for users under 18 years of age. We do not knowingly collect information from children. If you believe a child under 18 has used the Platform, please contact us so we can take appropriate action.`,
  },
  {
    id: 'changes',
    title: '11. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. When we make material changes, we will:

• Post a notice on the Platform
• Update the "Last Updated" date at the top of this page
• Announce in our Telegram and X (Twitter) channels

Your continued use of the Platform after changes constitutes acceptance of the updated policy.`,
  },
  {
    id: 'contact',
    title: '12. Contact Us',
    content: `For privacy-related questions or requests:

• Telegram: Official FutureBit Group
• X (Twitter): @FutureBit_Sol
• Email: privacy@futurebit.in
• Website: stake.futurebit.in

We aim to respond to all privacy inquiries within 72 hours.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5 live-badge">
            🔒 PRIVACY POLICY
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Privacy <span className="text-neon-green">Policy</span>
          </h1>
          <p className="text-gray-400">Last updated: June 2026 · Effective immediately</p>
          <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-left">
            ✅ <strong>TL;DR:</strong> We collect only your public wallet address. We don't store personal data, don't use tracking cookies, and will NEVER ask for your private keys.
          </div>
        </div>

        {/* Quick nav */}
        <div className="mb-10 p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-gray-400 text-sm font-semibold mb-3">Contents</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`} className="text-xs text-gray-500 hover:text-neon-green transition-colors py-1">
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map(s => (
            <div
              key={s.id}
              id={s.id}
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <h2 className="text-lg font-bold text-white mb-4">{s.title}</h2>
              <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                {s.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/terms" className="text-gray-500 hover:text-neon-green transition-colors">Terms of Service →</Link>
          <Link href="/docs"  className="text-gray-500 hover:text-neon-green transition-colors">Documentation →</Link>
          <Link href="/"      className="text-gray-500 hover:text-neon-green transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
