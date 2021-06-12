import httpClient from './httpClient';

const END_POINT = '/uploads';

export const getUpload = (id) => httpClient.get(END_POINT, { id });
export const createUpload = (formData) => httpClient.post(
  END_POINT,
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  },
);
