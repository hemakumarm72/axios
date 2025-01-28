type AuthRes = {
  result: {
    accessToken: string;
    refreshToken: string;
  };
};

type ErrorRes = {
  subStatus: string;
  message: string;
};
