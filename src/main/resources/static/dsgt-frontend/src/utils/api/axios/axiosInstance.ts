import axios from 'axios';
import { baseURL } from '../ApiConfig';

import ModalHelper from '../../helpers/ModalHelper';
import StatusCodeHelper from '../../helpers/StatusCodeHelper';

const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.response.use(
  (response: any) => response,
  (error: any) => { // Change the type of error to any
    if (error.response) {
      console.error(error.response.data);
      const errorObject = error.response.data;
      const { code } = error.response.data;
      const responseMessage = error.response.data.message;
      const message = StatusCodeHelper.getMessage({
        code,
        status: error.response.status, // Access status directly
        responseMessage,
        errorObject,
      });
      ModalHelper.openErrorModal({
        message,
      });
    } else {
      console.error(error);
      ModalHelper.openErrorModal({
        message: 'An error occurred. Please check your network connection and try again.',
      });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;