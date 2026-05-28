// Type declarations for Jupiter Terminal global
interface JupiterInitParams {
  displayMode?: 'integrated' | 'widget' | 'modal';
  integratedTargetId?: string;
  endpoint?: string;
  defaultExplorer?: 'Solana Explorer' | 'Solscan' | 'Solana Beach' | 'SolanaFM';
  formProps?: {
    initialInputMint?: string;
    initialOutputMint?: string;
    fixedInputMint?: boolean;
    fixedOutputMint?: boolean;
    initialAmount?: string;
    swapMode?: 'ExactIn' | 'ExactOut';
  };
  onSuccess?: (params: { txid: string; swapResult: unknown }) => void;
  onSwapError?: (params: { error: Error; quoteResponseMeta: unknown }) => void;
  widgetStyle?: {
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    size?: 'sm' | 'default';
  };
  containerStyles?: React.CSSProperties;
  containerClassName?: string;
}

interface JupiterTerminal {
  init: (params: JupiterInitParams) => void;
  resume: () => void;
  close: () => void;
  _instance?: unknown;
}

declare global {
  interface Window {
    Jupiter?: JupiterTerminal;
  }
}

export {};
