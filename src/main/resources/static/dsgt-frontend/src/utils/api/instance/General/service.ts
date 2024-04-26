import Router from './router';
import { getRequest, postRequest } from '../../axios/axiosMethod';
import { authentication, multipartFormData } from '../../ApiHeader';

const getHello = (token: string) => {
  return getRequest(Router.getHello, token);
}

const getAllShopItems = (token: string) => {
  return getRequest(Router.getAllShopItems, token);
}

const checkout = (token: string, data: any) => {
  const config = {
    headers: {
      ...authentication(token),
    },
  };

  return postRequest(Router.checkout, data, config);
}

export default {
    getHello,
    getAllShopItems,
    checkout,
};
