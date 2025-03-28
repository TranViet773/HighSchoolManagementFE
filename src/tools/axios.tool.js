import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7142/api",
});

const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
};

const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/";
};

const checkIfTokenExpired = (token, bufferTime = 0) => {
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= decoded.exp * 1000 - bufferTime;
  } catch (e) {
    return true;
  }
};

// Biến kiểm soát việc refresh token
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  try {
    isRefreshing = true;
    const refreshToken = getRefreshToken();
    
    if (!refreshToken || checkIfTokenExpired(refreshToken)) {
      logoutUser();
      return null;
    }

    const res = await axios.post("https://localhost:7142/api/Auth/refresh-token", { refreshToken });

    if (res.status === 200) {
      const { accessToken, refreshToken: newRefreshToken } = res.data;
      
      saveTokens(accessToken, newRefreshToken);
      onRefreshed(accessToken);
      
      return accessToken;
    }
  } catch (error) {
    console.error("Refresh token failed", error);
    logoutUser();
  } finally {
    isRefreshing = false;
  }
};

// Interceptor request
axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = getAccessToken();

    if (accessToken) {
      if (checkIfTokenExpired(accessToken)) {
        if (!isRefreshing) {
          await refreshAccessToken();
        }

        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(config);
          });
        });
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response: Nếu API trả về 401, thử refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        await refreshAccessToken();
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    if (error.response?.status === 403) {
      logoutUser();
    }

    return Promise.reject(error);
  }
);

// Tự động refresh token trước khi hết hạn
const startTokenRefreshScheduler = () => {
  setInterval(async () => {
    const accessToken = getAccessToken();
    if (accessToken && checkIfTokenExpired(accessToken, 30000)) { // 30s trước khi hết hạn
      await refreshAccessToken();
    }
  }, 15000); // Kiểm tra mỗi 15 giây
};

// Chạy auto refresh khi ứng dụng khởi động
startTokenRefreshScheduler();

export async function service(axiosPromise) {
  try {
    const response = await axiosPromise;
    return { data: response.data, status: response.status, error: null };
  } catch (error) {
    return {
      data: null,
      status: error.response ? error.response.status : 500,
      error: error.response ? error.response.data : { message: error.message },
    };
  }
}

export default axiosInstance;
