import axios from '../api/apiClient';

const getUserProfile = () => {
  return axios.get("/user");
};

const updateUserProfile = (payload) => {
    return axios.put("/user", payload);
};

const ProfileService = {
    getUserProfile,
    updateUserProfile,
};

export default ProfileService;
