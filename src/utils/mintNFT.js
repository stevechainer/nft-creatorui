import { MintLayout, Token } from '@solana/spl-token';
import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import Vue from 'vue';
import crypto from 'crypto';
import { createAssociatedTokenAccountInstruction, createMint } from './metaplex/accounts';
import { getAssetCostToStore } from './metaplex/assets';
import { sendTransactionWithRetry } from './metaplex/connectionHelpers';
import { AR_SOL_HOLDER_ID, programIds } from './metaplex/ids';
import {
  createMetadata, Data, updateMetadata,
} from './metaplex/metadata';
import { findProgramAddress } from './metaplex/utils';
import { sleep } from '.';

const RESERVED_TXN_MANIFEST = 'manifest.json';

export default async function mintNFT(connection, wallet, files, metadata) {
  // Check the wallet eligibility
  const walletBalance = await connection.getBalance(new PublicKey(wallet.publicKey.toString()));
  if (walletBalance < 50000000) {
    throw new Error('You need at least 0.05 SOL in your wallet');
  }

  const metadataContent = {
    name: metadata.name,
    symbol: metadata.symbol,
    description: metadata.description,
    seller_fee_basis_points: metadata.sellerFeeBasisPoints,
    image: metadata.image,
    animation_url: metadata.animation_url,
    attributes: metadata.attributes,
    external_url: metadata.external_url,
    properties: {
      ...metadata.properties,
      creators: metadata.creators?.map((creator) => ({
        address: creator.address.toBase58(),
        share: creator.share,
      })),
    },
  };
  if (metadata.collection) metadataContent.collection = metadata.collection;

  const realFiles = [
    ...files,
    new File([JSON.stringify(metadataContent)], 'metadata.json'),
  ];

  // eslint-disable-next-line no-use-before-define
  const { instructions: pushInstructions, signers: pushSigners } = await prepPayForFilesTxn(wallet, realFiles, metadata);

  const TOKEN_PROGRAM_ID = programIds().token;

  const mintRent = await connection.getMinimumBalanceForRentExemption(
    MintLayout.span,
  );

  const payerPublicKey = new PublicKey(wallet.publicKey.toString());
  const instructions = [...pushInstructions];
  const signers = [...pushSigners];

  const mintKey = createMint(
    instructions,
    wallet.publicKey,
    mintRent,
    0,
    // Some weird bug with phantom where it's public key doesnt mesh with data encode wellff
    payerPublicKey,
    payerPublicKey,
    signers,
  );

  const recipientKey = (
    await findProgramAddress(
      [
        wallet.publicKey.toBuffer(),
        programIds().token.toBuffer(),
        mintKey.toBuffer(),
      ],
      programIds().associatedToken,
    )
  )[0];

  createAssociatedTokenAccountInstruction(
    instructions,
    recipientKey,
    wallet.publicKey,
    wallet.publicKey,
    mintKey,
  );

  const metadataAccount = await createMetadata(
    new Data({
      symbol: metadata.symbol,
      name: metadata.name,
      uri: ' '.repeat(64), // size of url for arweave
      sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
      creators: metadata.creators,
    }),
    payerPublicKey,
    mintKey,
    payerPublicKey,
    instructions,
    wallet.publicKey,
  );

  Vue.toasted.show('Waiting for signature...', {
    icon: 'timer-sand',
    iconPack: 'mdi',
  });

  const { txid } = await sendTransactionWithRetry(
    connection,
    wallet,
    instructions,
    signers,
    'singleGossip',
    false,
    undefined,
    () => {
      Vue.toasted.show('Creating token...', {
        icon: 'timer-sand',
        iconPack: 'mdi',
      });
    },
  );

  Vue.toasted.show('Waiting for confirmation...', {
    icon: 'timer-sand',
    iconPack: 'mdi',
  });

  try {
    await connection.confirmTransaction(txid, 'max');
  } catch {
    // ignore
  }

  // Force wait for max confirmations
  // await connection.confirmTransaction(txid, 'max');
  await connection.getParsedConfirmedTransaction(txid, 'confirmed');

  // this means we're done getting AR txn setup. Ship it off to ARWeave!
  const data = new FormData();

  const tags = realFiles.reduce(
    (acc, f) => {
      acc[f.name] = [{ name: 'mint', value: mintKey.toBase58() }];
      return acc;
    },
    {},
  );
  data.append('tags', JSON.stringify(tags));
  data.append('transaction', txid);
  realFiles.map((f) => data.append('file[]', f));

  Vue.toasted.show('Uploading file...', {
    icon: 'timer-sand',
    iconPack: 'mdi',
  });

  const result = await (
    await fetch(
      process.env.VUE_APP_METAPLEX,
      {
        method: 'POST',
        body: data,
      },
    )
  ).json();

  const metadataFile = result.messages?.find(
    (m) => m.filename === RESERVED_TXN_MANIFEST,
  );

  if (metadataFile?.transactionId && wallet.publicKey) {
    const updateInstructions = [];
    const updateSigners = [];

    // TODO: connect to testnet arweave
    const arweaveLink = `https://arweave.net/${metadataFile.transactionId}`;
    await updateMetadata(
      new Data({
        name: metadata.name,
        symbol: metadata.symbol,
        uri: arweaveLink,
        creators: metadata.creators,
        sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
      }),
      undefined,
      undefined,
      mintKey,
      payerPublicKey,
      updateInstructions,
      metadataAccount,
    );

    updateInstructions.push(
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mintKey,
        recipientKey,
        payerPublicKey,
        [],
        1,
      ),
    );

    // // In this instruction, mint authority will be removed from the main mint, while
    // // minting authority will be maintained for the Printing mint (which we want.)
    // await createMasterEdition(
    //   0,
    //   mintKey,
    //   payerPublicKey,
    //   payerPublicKey,
    //   payerPublicKey,
    //   updateInstructions,
    // );
    updateInstructions.push(
      Token.createSetAuthorityInstruction(
        TOKEN_PROGRAM_ID,
        mintKey,
        null,
        'MintTokens',
        wallet.publicKey,
        [],
      ),
    );
    updateInstructions.push(
      Token.createSetAuthorityInstruction(
        TOKEN_PROGRAM_ID,
        mintKey,
        null,
        'FreezeAccount',
        wallet.publicKey,
        [],
      ),
    );

    Vue.toasted.show('Waiting for signature...', {
      icon: 'timer-sand',
      iconPack: 'mdi',
    });

    await sendTransactionWithRetry(
      connection,
      wallet,
      updateInstructions,
      updateSigners,
      'singleGossip',
      false,
      undefined,
      () => {
        Vue.toasted.show('Updating metadata...', {
          icon: 'timer-sand',
          iconPack: 'mdi',
        });
      },
    );

    await sleep(2000);

    Vue.toasted.show('NFT created!', {
      icon: 'party-popper',
      iconPack: 'mdi',
      action: [
        {
          text: 'View',
          href: `https://sonar.watch/collectibles/${payerPublicKey.toString()}`,
          target: '_blank',
        },
      ],
    });
  }

  return { metadataAccount, mintKey };
}

export const prepPayForFilesTxn = async (wallet, files) => {
  const { memo } = programIds();

  const instructions = [];
  const signers = [];

  if (wallet.publicKey) {
    instructions.push(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: AR_SOL_HOLDER_ID,
        lamports: await getAssetCostToStore(files),
      }),
    );
  }

  for (let i = 0; i < files.length; i += 1) {
    const hashSum = crypto.createHash('sha256');
    // eslint-disable-next-line no-await-in-loop
    hashSum.update(await files[i].text());
    const hex = hashSum.digest('hex');
    instructions.push(
      new TransactionInstruction({
        keys: [],
        programId: memo,
        data: Buffer.from(hex),
      }),
    );
  }

  return {
    instructions,
    signers,
  };
};
