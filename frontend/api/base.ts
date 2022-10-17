import { IQueryParams, IGetOptions } from '@/lib/types';
import axios from 'axios';

const parseUrlParams = (url: string, params?: IQueryParams) => {
  if (!params) return url;
  const parsedUrl = Object.entries(params).reduce((previousUrl, [slug, entry]) => {
    return previousUrl.replace(`:${slug}`, `${entry}`);
  }, url);

  return parsedUrl;
};

/**
 * URL can be in the format of `/api/:username`, as long as a 'username' entry is provided in the options.params object.
 */
export const get = async <T>(url: string, options?: IGetOptions) => {
  const parsedUrl = parseUrlParams(url, options?.urlParams);
  const resp = await axios.get<T>(parsedUrl, { params: options?.queryParams });
  return resp.data;
};

export const post = () => {
  console.log('this is a placeholder.');
};
