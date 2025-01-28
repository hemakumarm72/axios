import apiRequest from '@/utils/axios';

export const refreshAccessToken = async (
  refreshToken: string
): Promise<AuthResponse> => {
  try {
    const result = await apiRequest({
      method: 'PUT',
      data: { refreshToken },
      url: '/auth/refresh',
    });
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
};
