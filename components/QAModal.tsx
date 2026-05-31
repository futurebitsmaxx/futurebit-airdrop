'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';

interface Question {
  q: string;
  options: [string, string, string, string];
  answer: number;
}

const QUESTIONS: Question[] = [
  {
    q: 'What does "DeFi" stand for?',
    options: ['Digital Finance', 'Decentralized Finance', 'Distributed Finance', 'Direct Finance'],
    answer: 1,
  },
  {
    q: 'Which blockchain does FutureBit (FBiT) primarily operate on?',
    options: ['Ethereum', 'Binance Smart Chain', 'Solana', 'Polygon'],
    answer: 2,
  },
  {
    q: 'What does APY stand for in crypto?',
    options: ['Average Profit Yearly', 'Annual Percentage Yield', 'Automated Payment Yield', 'Asset Price Yield'],
    answer: 1,
  },
  {
    q: 'In DeFi, what does "staking" mean?',
    options: ['Buying tokens at low prices', 'Trading between exchanges', 'Mining new crypto blocks', 'Locking tokens to earn rewards'],
    answer: 3,
  },
  {
    q: 'What is a smart contract?',
    options: ['A legal agreement notarized digitally', 'A self-executing program on a blockchain', 'A type of crypto wallet', 'A method to mine crypto'],
    answer: 1,
  },
  {
    q: 'NFT stands for...',
    options: ['Non-Fungible Token', 'New Finance Technology', 'Network Funded Token', 'Node Fee Transfer'],
    answer: 0,
  },
  {
    q: 'What are "gas fees" in blockchain?',
    options: ['Energy consumption costs', 'Taxes on crypto profits', 'Fees paid to process transactions', 'Liquidity provider rewards'],
    answer: 2,
  },
  {
    q: 'What is a DEX?',
    options: ['A crypto hardware wallet', 'A centralized trading platform', 'A Decentralized Exchange', 'A blockchain explorer'],
    answer: 2,
  },
  {
    q: 'What is a "seed phrase" used for?',
    options: ['Farming NFTs', 'Accessing a liquidity pool', 'Paying gas fees', 'Recovering access to a wallet'],
    answer: 3,
  },
  {
    q: 'What is the maximum supply of Bitcoin?',
    options: ['50 million BTC', '21 million BTC', '100 million BTC', 'Unlimited'],
    answer: 1,
  },
  {
    q: 'What is "yield farming" in DeFi?',
    options: ['Staking crypto for fixed APY', 'Providing liquidity to earn rewards', 'Mining Bitcoin with GPUs', 'Trading meme coins'],
    answer: 1,
  },
  {
    q: 'What does a blockchain explorer allow you to do?',
    options: ['Track on-chain transactions', 'Manage crypto portfolios', 'Access DEX trading', 'Mine crypto from a browser'],
    answer: 0,
  },
  {
    q: 'In crypto culture, "HODL" means to...',
    options: ['Sell tokens quickly for profit', 'Hedge against market losses', 'Hold crypto long-term', 'Trade on margin'],
    answer: 2,
  },
  {
    q: 'What is a liquidity pool in DeFi?',
    options: ['A pool of staked validators', 'A collection of locked NFTs', 'A smart contract holding token pairs for trading', 'A cross-chain bridge'],
    answer: 2,
  },
  {
    q: 'What does "TPS" mean in blockchain?',
    options: ['Token Per Stake', 'Total Protocol Supply', 'Transactions Per Second', 'Trustless Payment System'],
    answer: 2,
  },
];

const CORRECT_PTS = 20;
const WRONG_PTS   = 5;
const FEEDBACK_MS = 1800;
const LABELS      = ['A', 'B', 'C', 'D'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props { onClose: () => void; }

export default function QAModal({ onClose }: Props) {
  const { adjustPoints } = useAppStore();

  const [questions]       = useState<Question[]>(() => shuffle(QUESTIONS));
  const [idx,   setIdx]   = useState(0);
  const [phase, setPhase] = useState<'answering' | 'feedback' | 'done'>('answering');
  const [selected,  setSelected]  = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionPts, setSessionPts] = useState(0);

  const current = questions[idx];

  const advance = useCallback(() => {
    if (idx + 1 >= questions.length) {
      setPhase('done');
    } else {
      setIdx(i => i + 1);
      setSelected(null);
      setPhase('answering');
    }
  }, [idx, questions.length]);

  useEffect(() => {
    if (phase !== 'feedback') return;
    const t = setTimeout(advance, FEEDBACK_MS);
    return () => clearTimeout(t);
  }, [phase, advance]);

  function handleSelect(optionIdx: number) {
    if (phase !== 'answering') return;
    const correct = optionIdx === current.answer;
    const delta   = correct ? CORRECT_PTS : -WRONG_PTS;
    adjustPoints(delta);
    setSessionPts(p => p + delta);
    setSelected(optionIdx);
    setIsCorrect(correct);
    setPhase('feedback');
  }

  function restart() {
    setIdx(0);
    setSelected(null);
    setPhase('answering');
    setSessionPts(0);
  }

  function optionClass(i: number): string {
    if (phase !== 'feedback') {
      return 'border border-white/10 hover:border-neon-green/40 hover:bg-white/5 text-gray-200 cursor-pointer';
    }
    if (i === current.answer)               return 'border border-neon-green bg-neon-green/10 text-neon-green cursor-default';
    if (i === selected && !isCorrect)       return 'border border-red-500 bg-red-500/10 text-red-400 cursor-default';
    return 'border border-white/5 text-gray-500 cursor-default';
  }

  return (
    <div className="modal-backdrop fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="bg-[#0a1020] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-bold text-base">🎯 Daily Q&A Challenge</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              {phase === 'done' ? 'Session complete!' : `Question ${idx + 1} of ${questions.length}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold ${sessionPts >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
              {sessionPts >= 0 ? '+' : ''}{sessionPts} pts
            </span>
            <button type="button" onClick={onClose}
              className="text-gray-500 hover:text-white text-2xl leading-none">×</button>
          </div>
        </div>

        {/* Rules chips */}
        <div className="flex gap-3 mb-5 text-xs">
          <span className="bg-neon-green/10 text-neon-green border border-neon-green/20 rounded-lg px-3 py-1">
            ✓ Correct: +{CORRECT_PTS} pts
          </span>
          <span className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg px-3 py-1">
            ✗ Wrong: −{WRONG_PTS} pts
          </span>
        </div>

        {phase === 'done' ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">🏆</div>
            <p className="text-white font-bold text-lg mb-1">Session Complete!</p>
            <p className="text-gray-400 text-sm mb-4">You answered all {questions.length} questions.</p>
            <p className={`text-2xl font-bold mb-6 ${sessionPts >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
              {sessionPts >= 0 ? '+' : ''}{sessionPts} pts this session
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={restart} className="btn-outline flex-1 text-sm py-2.5">
                🔄 Play Again
              </button>
              <button type="button" onClick={onClose} className="btn-primary flex-1 text-sm py-2.5">
                ✅ Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Question */}
            <p className="text-white text-base font-medium leading-relaxed mb-5 min-h-[48px]">
              {current.q}
            </p>

            {/* Feedback banner */}
            {phase === 'feedback' && (
              <div className={`mb-4 rounded-xl px-4 py-2.5 text-sm font-bold text-center ${
                isCorrect
                  ? 'bg-neon-green/15 text-neon-green border border-neon-green/30'
                  : 'bg-red-500/15 text-red-400 border border-red-500/30'
              }`}>
                {isCorrect
                  ? `✅ Correct! +${CORRECT_PTS} points added`
                  : `❌ Wrong! −${WRONG_PTS} points deducted · Next question coming…`}
              </div>
            )}

            {/* Options */}
            <div className="grid grid-cols-1 gap-2.5">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={phase === 'feedback'}
                  className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm text-left transition-all duration-200 ${optionClass(i)}`}
                >
                  <span className="font-bold text-xs opacity-60 w-4 shrink-0">{LABELS[i]}</span>
                  <span className="flex-1">{opt}</span>
                  {phase === 'feedback' && i === current.answer && (
                    <span className="text-neon-green">✓</span>
                  )}
                  {phase === 'feedback' && i === selected && !isCorrect && i !== current.answer && (
                    <span className="text-red-400">✗</span>
                  )}
                </button>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-5 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-green rounded-full transition-all duration-500"
                style={{ width: `${((idx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
