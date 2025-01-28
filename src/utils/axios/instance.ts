// import { refreshAccessToken } from 'services/auth';
import { getCookies, removeCookies, setCookies } from '@/utils/cookies';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import * as authApi from '@/utils/axios/auth';

let isRefreshing = false;
let failedRequestsQueue: any[] = [];

const baseURL =
  process.env.VITE_APP_API_SERVER || 'http://localhost:3000/api/user';
const instance: AxiosInstance = axios.create({ baseURL });

instance.defaults.headers.post['Content-Type'] = 'application/json';

const handleTokenRefresh = async (refreshToken: string): Promise<string> => {
  try {
    const { result } = await authApi.refreshAccessToken(refreshToken);
    setCookies('accessToken', result.accessToken);
    setCookies('refreshToken', result.refreshToken);
    return result.accessToken;
  } catch (err) {
    removeCookies('accessToken');
    removeCookies('refreshToken');
    window.location.href = '/login';
    throw err;
  }
};

instance.interceptors.request.use(
  (config) => {
    const accessToken = getCookies('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | AxiosRequestConfig
      | (any & {
          _retry?: boolean;
        });

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedRequestsQueue.push((accessToken: string) => {
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            resolve(instance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getCookies('refreshToken');
      if (!refreshToken) {
        removeCookies('accessToken');
        failedRequestsQueue = [];
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const newAccessToken = await handleTokenRefresh(refreshToken);
        instance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${newAccessToken}`;
        failedRequestsQueue.forEach((cb) => cb(newAccessToken));
        failedRequestsQueue = [];
        return instance(originalRequest);
      } catch (err) {
        failedRequestsQueue = [];
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
