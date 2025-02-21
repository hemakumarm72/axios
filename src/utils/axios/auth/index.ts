import createApiRequest from '@/utils/axios';
import { AuthResponse, AuthResponseSchema } from './auth.validation';
import { validateResponse } from '@/utils/validation';

const apiRequest = createApiRequest('/auth');

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const result = await apiRequest({
      method: 'PUT',
      data: { email, password },
      url: '/login',
    });
    validateResponse(result, AuthResponseSchema);
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<AuthResponse> => {
  try {
    const result = await apiRequest({
      method: 'PUT',
      data: { refreshToken },
      url: '/refresh',
    });
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
};
