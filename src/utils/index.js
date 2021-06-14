import { PublicKey } from '@solana/web3.js';

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

export function currencyFormatter(amount, letter = false, detailedLessThanOneCent = true) {
  if (Number.isNaN(amount) || amount === null) { return `$${NaN}`; }
  if (amount === 0) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount); }
  if (amount < 0.01 && detailedLessThanOneCent) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumSignificantDigits: 2, maximumSignificantDigits: 3,
    }).format(amount);
  }
  if (amount < 0.01 && !detailedLessThanOneCent) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
  if (letter && amount > 1e9) {
    return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 })
      .format(amount / 1e9)}B`;
  }
  if (letter && amount > 1e6) {
    return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 })
      .format(amount / 1e6)}M`;
  }
  if (letter && amount > 1e3) {
    return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 })
      .format(amount / 1e3)}K`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
