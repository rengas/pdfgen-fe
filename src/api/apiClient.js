import axios from 'axios';

// Run this command in terminal to fix CORs in localhost: chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security

export const getHostName = () => {
    return 'http://api.docs.staging.pdfgen.pro.s3-website-ap-southeast-1.amazonaws.com';
};

export const apiClient = axios.create({
  baseURL: getHostName(),
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (window.location.hostname === 'localhost') {
    config.headers = {
      'Content-Type': 'application/json'
    };
  }

  return config;
});
