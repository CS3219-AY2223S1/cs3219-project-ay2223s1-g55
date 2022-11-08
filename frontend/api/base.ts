import { getJwtCookie } from '@/lib/cookies';
import { IQueryParams, IGetOptions } from '@/lib/types';
import axios, { AxiosRequestConfig } from 'axios';

const parseUrlParams = (url: string, params?: IQueryParams) => {
  if (!params) return url;
  const parsedUrl = Object.entries(params).reduce((previousUrl, [slug, entry]) => {
    return previousUrl.replace(`:${slug}`, `${entry}`);
  }, url);

  return parsedUrl;
};

const getAuthrizationHeader = () => {
  const jwt = getJwtCookie();
  return { Authorization: `Bearer ${jwt}` }
}

/**
 * URL can be in the format of `/api/:username`, as long as a 'username' entry is provided in the options.params object.
 */
export const get = async <T>(url: string, options?: IGetOptions) => {
  const parsedUrl = parseUrlParams(url, options?.urlParams);

  const resp = await axios.get<T>(parsedUrl, {
    headers: getAuthrizationHeader(),
    params: options?.queryParams
  });
  return resp.data;
};

export const post = async <T>(url: string, data?: any, options?: AxiosRequestConfig<any>) => {
  const resp = await axios.post<T>(url, data, {
    ...options,
    headers: getAuthrizationHeader()
  });
  return resp.data;
};
