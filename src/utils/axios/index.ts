import axiosInstance from '@/utils/axios/instance';

const formatUrl = (url: string, params?: { [key: string]: string }): string => {
  if (!params || Object.keys(params).length === 0) return url;

  const re = new RegExp('/:(.+?)(/|$)', 'g');
  const paramPlaceholders = url.match(re) || [];

  if (paramPlaceholders.length !== Object.keys(params).length) {
    throw new Error(
      'Insufficient (or) excess parameters while formatting API URL'
    );
  }

  return url.replace(re, (...matches) => `/${params[matches[1]]}${matches[2]}`);
};

const apiRequest = async (config: ApiRequestConfig) => {
  try {
    const { url, urlParams, headers } = config;

    config.url = formatUrl(url, urlParams);
    config.headers = { ...headers };

    const response = await axiosInstance.request(config);
    return response.data;
  } catch (err: any) {
    const errorResponse: ErrorResponse = {
      subStatusCode: err.response?.subStatusCode,
      status: err.response?.status || 500,
      message: err.response?.data?.message || 'An unexpected error occurred',
    };
    return Promise.reject(errorResponse);
  }
};

export default apiRequest;
