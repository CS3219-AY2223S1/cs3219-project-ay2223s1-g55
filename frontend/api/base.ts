import { getJwtCookie } from '@/lib/cookies';
import { IQueryParams, IGetOptions } from '@/lib/types';
import axios, { AxiosRequestConfig } from 'axios';
import { Router } from 'next/router';

const parseUrlParams = (url: string, params?: IQueryParams) => {
  if (!params) return url;
  const parsedUrl = Object.entries(params).reduce((previousUrl, [slug, entry]) => {
    return previousUrl.replace(`:${slug}`, `${entry}`);
  }, url);

  return parsedUrl;
};

const getAuthorizationHeader = () => {
  if (typeof document === 'undefined') {
    return { Authorization: '' };
  }
  const jwt = getJwtCookie();
  return { Authorization: `Bearer ${jwt}` };
};

/**
 * URL can be in the format of `/api/:username`, as long as a 'username' entry is provided in the options.params object.
 */
export const get = async <T>(url: string, options?: IGetOptions) => {
  const parsedUrl = parseUrlParams(url, options?.urlParams);

  const resp = await axios.get<T>(parsedUrl, {
    headers: getAuthorizationHeader(),
    params: options?.queryParams,
  });
  return resp.data;
};

export const post = async <T>(url: string, data?: any, options?: AxiosRequestConfig<any>) => {
  const resp = await axios.post<T>(url, data, {
    ...options,
    headers: getAuthorizationHeader(),
  });
  return resp.data;
};

export const put = async <T>(url: string, data?: any, options?: AxiosRequestConfig<any>) => {
  const resp = await axios.put<T>(url, data, {
    ...options,
    headers: getAuthorizationHeader(),
  });
  return resp.data;
};

export const _delete = async <T>(url: string, options?: AxiosRequestConfig<any>) => {
  const resp = await axios.delete<T>(url, {
    ...options,
    headers: getAuthorizationHeader(),
  });
  return resp.data;
};
