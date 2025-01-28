import Cookies from 'js-cookie';

export const setCookies = (key: string, data: string, expires: number = 30) => {
  Cookies.set(key, data, {
    expires: expires,
  });
};

export const getCookies = (key: string) => {
  return Cookies.get(key);
};

export const removeCookies = (key: string) => {
  return Cookies.remove(key);
};
