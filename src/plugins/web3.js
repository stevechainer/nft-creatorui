import { Connection } from '@solana/web3.js';

const connection = new Connection(process.env.VUE_APP_WEB3, 'confirmed');

export default connection;
