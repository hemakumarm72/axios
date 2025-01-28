type ErrorRes = {
  subStatus: string;
  message: string;
};

type ApiRequestConfig = {
  method:
    | 'get'
    | 'GET'
    | 'delete'
    | 'DELETE'
    | 'head'
    | 'HEAD'
    | 'options'
    | 'OPTIONS'
    | 'post'
    | 'POST'
    | 'put'
    | 'PUT'
    | 'patch'
    | 'PATCH'
    | 'purge'
    | 'PURGE'
    | 'link'
    | 'LINK'
    | 'unlink'
    | 'UNLINK';
  url: string;
  urlParams?: { [key: string]: string };
  headers?: { [key: string]: string };
  data?: any;
  params?: any;
};

type ErrorResponse = {
  subStatusCode: string;
  status: number;
  message: string;
  data?: any;
};

type Token = {
  accessToken: string;
  refreshToken: string;
};

