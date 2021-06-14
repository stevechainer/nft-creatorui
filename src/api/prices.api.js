import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'https://price-api.sonar.watch/',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const END_POINT = '/prices';

export const getAllPrices = () => httpClient.get(END_POINT);
export const getSolPrice = async () => {
  const { data } = await httpClient.get(END_POINT);
  if (!data) return undefined;
  const solPriceRes = data.find((price) => price.mint === '11111111111111111111111111111111');
  if (!solPriceRes) return undefined;
  const solPrice = solPriceRes.price;
  return solPrice;
};
