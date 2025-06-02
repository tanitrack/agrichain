export type EscrowState = 'initialized' | 'confirmed' | 'completed' | 'refunded' | 'failed';

interface EscrowStateInfo {
  title: string;
  description: string;
}

const ESCROW_STATE_MAP: Record<EscrowState, EscrowStateInfo> = {
  initialized: {
    title: 'Initialized',
    description: 'Buyer creates escrow and deposits funds',
  },
  confirmed: {
    title: 'Confirmed',
    description: "Seller confirms they'll fulfill the order",
  },
  completed: {
    title: 'Completed',
    description: 'Funds transferred to seller',
  },
  refunded: {
    title: 'Refunded',
    description: 'Funds returned to buyer before confirmation',
  },
  failed: {
    title: 'Failed',
    description: 'Either party cancels the order',
  },
};

export function getEscrowStateInfo(state: EscrowState): EscrowStateInfo | undefined {
  if (!Object.keys(ESCROW_STATE_MAP).includes(state)) {
    console.error(`Invalid escrow state: ${state}`);
    return undefined;
  }
  return ESCROW_STATE_MAP[state];
}
