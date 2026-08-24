import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vetfacility_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const empresaAtivaId = localStorage.getItem("vetfacility_empresa_ativa_id");
  if (empresaAtivaId) {
    config.headers["X-Empresa-Id"] = empresaAtivaId;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("vetfacility_token");
      localStorage.removeItem("vetfacility_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
