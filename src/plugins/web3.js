import { Connection } from '@solana/web3.js';

// https://solana-api.projectserum.com
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export default connection;
