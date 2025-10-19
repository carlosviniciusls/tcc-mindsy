import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://mindsy-backend.onrender.com',
});
