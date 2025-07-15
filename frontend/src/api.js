import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mern-stack-task-manager-s8sd.onrender.com', // Change this to your backend API URL
});

export default api;
