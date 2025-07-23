import axios from "axios";
import env from "../configs/env.config.js";
import { getInforJwt } from "./utils.js";

const axiosInstance = axios.create({
  baseURL: env.serverUrl,
});

const intervalMs = Number(import.meta.env.VITE_CHECK_TOKEN_INTERVAL) || 30000;

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

const checkIfTokenExpired = (bufferTime = 0) => {
  try {
    const info = getInforJwt();
    if (info === "guest") return true;

    const expToken = info.expToken;
    return Date.now() >= expToken * 1000 - bufferTime;
  } catch (e) {
    console.error("Error decoding token:", e);
    return true;
  }
};

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

    console.log("Refreshing with token:", refreshToken); // 👈 LOG NÀY

    if (!refreshToken) {
      console.log("No refresh token, logging out.");
      //logoutUser();
      return null;
    }

    const res = await axios.post(
      `${env.serverUrl}/Auth/refresh-token`,
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      }
    )

    console.log("Refresh response:", res);

    if (res.status === 200) {
      const { accessToken} = res.data;
      saveTokens(accessToken, refreshToken);
      onRefreshed(accessToken);
      return accessToken;
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    //logoutUser();
    return null;
  } finally {
    isRefreshing = false;
  }
};


axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = getAccessToken();

    if (accessToken) {
      if (checkIfTokenExpired(30000)) {
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

const startTokenRefreshScheduler = () => {
  setInterval(async () => {
    const accessToken = getAccessToken();
    if (accessToken && checkIfTokenExpired(30000)) {
      await refreshAccessToken();
    }
  }, intervalMs*1000*0.9); // 30 giây
};

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

export { logoutUser, saveTokens };
export default axiosInstance;
