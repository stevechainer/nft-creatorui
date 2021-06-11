import httpClient from './httpClient';

const END_POINT = '/collectibles';

export const getAllCollectibles = () => httpClient.get(END_POINT);
export const getCollectible = (id) => httpClient.get(END_POINT, { id });
export const createCollectible = (collectible) => httpClient.post(END_POINT, collectible);
