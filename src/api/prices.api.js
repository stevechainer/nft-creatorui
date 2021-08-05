/* eslint-disable import/prefer-default-export */
import axios from 'axios';

const coingeckoClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3/',
  timeout: 30000,
});

const END_POINT = '/simple/price';

export const getPrices = async () => {
  const { data } = await coingeckoClient.get(END_POINT, {
    params: {
      ids: 'solana,arweave',
      vs_currencies: 'usd',
    },
  });
  return data;
};
