// https://github.com/solana-labs/solana-program-library/blob/master/token/js/client/token.js
import {
  PublicKey, Keypair, Transaction, SystemProgram,
} from '@solana/web3.js';
import { Token, MintLayout } from '@solana/spl-token';

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
const DECIMALS = 0;

export default async function createNFT(connection, wallet, supply) {
  const mintAccount = Keypair.generate();
  const authority = new PublicKey(wallet.publicKey.toString());
  const associatedAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mintAccount.publicKey,
    authority,
  );

  try {
    const transaction = new Transaction();
    const createTokenBalanceNeeded = await Token.getMinBalanceRentForExemptMint(connection);
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: authority,
        newAccountPubkey: mintAccount.publicKey,
        lamports: createTokenBalanceNeeded,
        space: MintLayout.span,
        programId: TOKEN_PROGRAM_ID,
      }),
    );
    transaction.add(
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mintAccount.publicKey,
        DECIMALS,
        authority,
        null,
      ),
    );
    transaction.add(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mintAccount.publicKey,
        associatedAddress,
        authority,
        authority,
      ),
    );
    transaction.add(
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mintAccount.publicKey,
        associatedAddress,
        authority,
        [],
        supply,
      ),
    );
    transaction.add(
      Token.createSetAuthorityInstruction(
        TOKEN_PROGRAM_ID,
        mintAccount.publicKey,
        null,
        'MintTokens',
        authority,
        [],
      ),
    );

    transaction.feePayer = authority;
    console.log('Getting recent blockhash');
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    console.log('Partial sign transaction');
    transaction.partialSign(mintAccount);
    console.log('Sending signature request to wallet');
    const signed = await wallet.signTransaction(transaction);
    console.log('Got signature, submitting transaction');
    const signature = await connection.sendRawTransaction(signed.serialize());
    console.log(`Submitted transaction ${signature}, awaiting confirmation`);
    await connection.confirmTransaction(signature, 'finalized');
    console.log(`Transaction ${signature} confirmed`);
  } catch (e) {
    console.error(`Error: ${e.message}`, e);
  }
  return mintAccount.publicKey;
}
