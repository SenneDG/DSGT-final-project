import Router from './router';
import { getRequest, postRequest } from '../../axios/axiosMethod';
import { authentication, multipartFormData } from '../../ApiHeader';

const getOrders = (token: string) => {
  return getRequest(Router.getOrders, token);
}

export default {
    getOrders,
};
