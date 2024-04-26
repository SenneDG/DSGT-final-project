import { authentication } from '../ApiHeader';
import axios from './axiosInstance';
import responseFilter from './responseFilter';

export const getRequest = (URL: string, token: string) => {
  const config = {
    headers: {
      ...authentication(token)
    }
  };

  return axios.get(`/${URL}`, config)
    .then((response: any) => responseFilter(response));
}

export const postRequest = (URL: string, payload: any, config: any = {}) => {
  return axios
    .post(`/${URL}`, payload, config)
    .then((response: any) => responseFilter(response));
}

export const putRequest = (URL: string, payload: any, config: any) =>
  axios
    .put(`/${URL}`, payload, config)
    .then((response: any) => responseFilter(response));

export const deleteRequest = (URL: string, config: any) =>
  axios.delete(`/${URL}`, config).then((response: any) => responseFilter(response));

export const patchRequest = (URL: string, payload: any, config: any) =>
  axios
    .patch(`/${URL}`, payload, config)
    .then((response: any) => responseFilter(response));

export default {};
