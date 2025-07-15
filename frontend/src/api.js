import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this to your backend API URL
});

export default api;
