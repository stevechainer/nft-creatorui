import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log('~ process.env.VUE_APP_BASE_URL', process.env.VUE_APP_BASE_URL);

export default httpClient;
