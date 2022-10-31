import axios from '../api/apiClient';

const register = (payload) => {
  return axios.post("/register", payload);
};

const login = (payload) => {
  return axios
    .post("/login", payload)
    .then((response) => {
      if (response && 'data' in response && 'accessToken' in response.data && response.data.accessToken) {
        sessionStorage.setItem("user", JSON.stringify(response.data));
      }

      return response;
    });
};

const logout = () => {
  sessionStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(sessionStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;