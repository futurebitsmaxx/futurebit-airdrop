import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — FutureBit',
  description: 'FutureBit platform Terms of Service, Risk Disclosure, and Disclaimer. Read before using FBiT staking, airdrop, or swap.',
};

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `By accessing or using the FutureBit platform ("Platform"), including staking, airdrop, referral, or swap features, you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you must not use the Platform.

These Terms constitute a legally binding agreement between you ("User") and FutureBit ("we", "us", "our"). We reserve the right to update these Terms at any time. Continued use after changes constitutes acceptance.`,
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    content: `You must be at least 18 years of age to use this Platform. By using the Platform, you represent and warrant that:

• You are at least 18 years old
• You are not located in a jurisdiction that prohibits the use of decentralized finance (DeFi) platforms or cryptocurrency trading
• You are not a citizen or resident of the United States, or any country under OFAC sanctions
• You have the legal capacity to enter into these Terms
• You will not use the Platform for any illegal or unauthorized purpose`,
  },
  {
    id: 'platform',
    title: '3. Platform Description',
    content: `FutureBit is a decentralized finance (DeFi) platform built on the Solana blockchain. The Platform provides:

• FBiT Token Staking: Stake FBiT tokens to earn staking rewards. Advertised APY rates (up to 300%) are estimates based on current protocol parameters and are not guaranteed.

• Airdrop Program: Eligible participants may earn FBiT tokens by completing tasks and referring users. Airdrop rewards are subject to availability and platform discretion.

• 10-Level Referral System: Users earn referral commissions across up to 10 levels. Commission rates may change with notice.

• Token Swap: FBiT token is tradeable on Jupiter DEX (Solana). Swap features are provided via third-party integrations and are subject to market conditions.`,
  },
  {
    id: 'staking',
    title: '4. Staking Terms',
    content: `Staking on FutureBit is subject to the following conditions:

• Staking rewards are distributed based on smart contract logic deployed on Solana mainnet. We do not guarantee specific yields.

• Staking periods and lock-up durations are defined in the smart contract. Early withdrawal may result in reduced rewards or penalties as specified.

• APY rates displayed are variable and based on protocol parameters, token supply, and market conditions at any given time.

• We are not responsible for loss of staked funds due to smart contract vulnerabilities, network failures, or market volatility.

• Staking is a high-risk activity. You may lose part or all of your staked assets.`,
  },
  {
    id: 'airdrop',
    title: '5. Airdrop Program Terms',
    content: `Participation in the FBiT Airdrop is voluntary and subject to the following:

• Airdrop rewards are distributed at FutureBit's sole discretion. We reserve the right to modify, suspend, or terminate the airdrop program at any time.

• Eligibility requires completion of specified tasks such as joining social media channels, referring users, and connecting a Solana wallet.

• Points earned during the airdrop are not transferable and have no monetary value until converted to FBiT tokens at distribution.

• FutureBit reserves the right to disqualify any participant suspected of fraudulent activity, bot usage, or gaming the referral system.

• The $10,000 prize pool is denominated in FBiT token value at the time of distribution and is subject to market conditions.

• Maximum of 5,000 airdrop participants unless extended at our discretion.`,
  },
  {
    id: 'referral',
    title: '6. Referral Program Terms',
    content: `The 10-level referral program operates as follows:

• Users earn commissions when referred users complete qualifying actions (staking, task completion).

• Commission percentages are defined in the smart contract and may be updated with 7-day advance notice.

• Referral rewards are paid in FBiT tokens and are subject to the same market risks as any token holding.

• Self-referrals, creating multiple accounts, or any manipulation of the referral system is strictly prohibited and will result in permanent ban and forfeiture of all rewards.

• FutureBit is not a multi-level marketing (MLM) company. The referral system is a community incentive mechanism built on transparent smart contracts.`,
  },
  {
    id: 'risk',
    title: '7. Risk Disclosure',
    content: `PLEASE READ THIS SECTION CAREFULLY. CRYPTOCURRENCY AND DEFI INVOLVE SIGNIFICANT RISKS.

Smart Contract Risk: Smart contracts may contain bugs or vulnerabilities. Despite audits, no smart contract is 100% risk-free. Loss of funds due to smart contract failure is possible.

Market Risk: FBiT token value can fluctuate significantly. You may receive fewer USD-equivalent rewards than expected. Token prices can go to zero.

Liquidity Risk: There may be insufficient liquidity to swap FBiT tokens at desired prices. Low trading volumes can result in high slippage.

Regulatory Risk: Cryptocurrency regulations vary by jurisdiction and change frequently. You are responsible for complying with all applicable laws in your jurisdiction.

Technology Risk: The Solana blockchain may experience outages, congestion, or forks that affect Platform functionality.

Impermanent Loss: Staking or providing liquidity may result in impermanent loss compared to simply holding tokens.

No FDIC/SIPC Protection: Unlike bank deposits, cryptocurrency holdings are not insured or guaranteed by any government body.

YOU SHOULD NEVER INVEST MORE THAN YOU CAN AFFORD TO LOSE COMPLETELY.`,
  },
  {
    id: 'prohibited',
    title: '8. Prohibited Activities',
    content: `You agree not to:

• Use bots, scripts, or automated tools to interact with the Platform
• Create multiple accounts to game the airdrop or referral system
• Engage in wash trading or market manipulation of FBiT token
• Attempt to hack, exploit, or reverse-engineer the smart contracts or Platform
• Use the Platform for money laundering, terrorist financing, or any illegal activity
• Impersonate FutureBit team members or official channels
• Spread false information about the Platform, token, or team`,
  },
  {
    id: 'disclaimer',
    title: '9. Disclaimer of Warranties',
    content: `THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.

FUTUREBIT EXPRESSLY DISCLAIMS ALL WARRANTIES INCLUDING:

• MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
• UNINTERRUPTED OR ERROR-FREE OPERATION
• ACCURACY OF APY, PRICE, OR REWARD ESTIMATES
• SECURITY FROM HACKS OR EXPLOITS

WE DO NOT PROVIDE FINANCIAL, INVESTMENT, LEGAL, OR TAX ADVICE. NOTHING ON THIS PLATFORM CONSTITUTES INVESTMENT ADVICE. YOU SHOULD CONSULT YOUR OWN ADVISORS BEFORE MAKING ANY FINANCIAL DECISIONS.`,
  },
  {
    id: 'liability',
    title: '10. Limitation of Liability',
    content: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:

• FUTUREBIT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES

• OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT OF FEES YOU HAVE PAID TO US IN THE PRECEDING 3 MONTHS

• WE ARE NOT LIABLE FOR LOSSES DUE TO: SMART CONTRACT FAILURES, MARKET VOLATILITY, EXCHANGE HACKS, REGULATORY ACTIONS, OR NETWORK OUTAGES

THIS LIMITATION APPLIES EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.`,
  },
  {
    id: 'governing',
    title: '11. Governing Law & Disputes',
    content: `These Terms shall be governed by and construed in accordance with applicable international law, excluding any conflict of law principles that would apply the laws of a different jurisdiction.

Any disputes arising from these Terms or your use of the Platform shall first be attempted to be resolved through good-faith negotiation. Failing that, disputes shall be resolved through binding arbitration.

By using the Platform, you waive any right to participate in class-action lawsuits.`,
  },
  {
    id: 'contact',
    title: '12. Contact Us',
    content: `For questions about these Terms, please reach out through our official community channels:

• Telegram: Official FutureBit Telegram Group
• X (Twitter): @FutureBit_Sol
• Email: support@futurebit.in

Do not share your private keys, seed phrases, or wallet passwords with anyone claiming to be FutureBit support. We will NEVER ask for these.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5 live-badge">
            📄 LEGAL DOCUMENT
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Terms of <span className="text-neon-green">Service</span>
          </h1>
          <p className="text-gray-400">Last updated: June 2026 · Effective immediately upon use of the Platform</p>
          <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm text-left">
            ⚠️ <strong>Important:</strong> This platform involves high-risk DeFi activities. Please read the Risk Disclosure (Section 7) carefully before using any features.
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
          <Link href="/privacy" className="text-gray-500 hover:text-neon-green transition-colors">Privacy Policy →</Link>
          <Link href="/docs"    className="text-gray-500 hover:text-neon-green transition-colors">Documentation →</Link>
          <Link href="/"        className="text-gray-500 hover:text-neon-green transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
