
const API_BASE_URL = "https://auth-backend-ug4e.vercel.app";

export const registerUser = (userData) => {
  return axios.post(`${API_BASE_URL}/register`, userData);
};