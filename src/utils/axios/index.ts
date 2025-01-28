/* eslint-disable @typescript-eslint/no-explicit-any */
// import { refreshAccessToken } from 'services/auth';
import { getCookies, removeCookies, setCookies } from "@/utils/cookies"
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios"

let isRefreshing = false
let failedRequestsQueue: any[] = []

const instance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
})

instance.interceptors.request.use(
  (config) => {
    const accessToken = getCookies("accessToken")
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: AxiosRequestConfig | any = error.config

    if (
      error.response &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedRequestsQueue.push((accessToken: string) => {
            originalRequest.headers["Authorization"] = "Bearer " + accessToken
            resolve(instance(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken: string | undefined = getCookies("refreshToken")

      if (!refreshToken) {
        removeCookies("accessToken")
        removeCookies("loginToken")
        failedRequestsQueue = []
        window.location.href = "/login"
        return Promise.reject(error)
      }

      return new Promise((resolve, reject) => {
        refreshAccessToken({ refreshToken })
          .then(async (data: AuthRes) => {
            setCookies("accessToken", data.result.accessToken)
            setCookies("refreshToken", data.result.refreshToken)

            instance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${data.result.accessToken}`
            failedRequestsQueue.forEach((cb) => cb(data.result.accessToken))
            failedRequestsQueue = []

            resolve(instance(originalRequest))
          })
          .catch((err: ErrorRes) => {
            failedRequestsQueue = []
            removeCookies("accessToken")
            removeCookies("refreshToken")
            removeCookies("loginToken")

            window.location.href = "/login"
            localStorage.removeItem("encryptedSecretCode")
            localStorage.removeItem("auth-storage")
            reject(err)
          })
          .finally(() => {
            isRefreshing = false
          })
      })
    }

    return Promise.reject(error)
  }
)

export default instance
