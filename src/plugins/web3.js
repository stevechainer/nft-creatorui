import { Connection } from '@solana/web3.js';

console.log('~ process.env.VUE_APP_WEB3', process.env.VUE_APP_WEB3);

const connection = new Connection(process.env.VUE_APP_WEB3, 'confirmed');

export default connection;
