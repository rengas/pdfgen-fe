import axios from 'axios';

// Run this command in terminal to fix CORs in localhost: /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir="/tmp/chrome_dev_session" --disable-web-security

export const getHostName = () => {
    return 'https://pdfgen-stg.onrender.com';
};

export const apiClient = axios.create({
  baseURL: getHostName(),
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (window.location.hostname === 'localhost') {
    config.headers = {
    };
  }

  return config;
});