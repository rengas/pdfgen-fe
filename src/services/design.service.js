import axios from '../api/apiClient';

const listDesign = (queryStr) => {
  return axios.get(queryStr ? `/design?${queryStr}` : `/design`);
};

const createDesign = (payload) => {
    return axios.post("/design", payload);
};

const generatePDF = (payload) => {
    const config = {
      headers: { 'Content-Type': 'application/json'  }
    };
    return axios.post("/generate", payload, {responseType: 'blob', config});
};

const validateDesign = (payload) => {
    return axios.post("/validate", payload);
};

const deleteDesign = (id) => {
    return axios.delete(`/design/${id}`);
}

const getDesignByID = (id) => {
    return axios.get(`/design/${id}`);
}

const updateDesignByID = (id, payload) => {
    return axios.put(`/design/${id}`, payload);
}

const DesignService = {
    listDesign,
    createDesign,
    generatePDF,
    validateDesign,
    deleteDesign,
    getDesignByID,
    updateDesignByID
};

export default DesignService;