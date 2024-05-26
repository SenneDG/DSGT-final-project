import store from '../../store/store';

const getMessage = ({ code, status, responseMessage, errorObject }: any) => {
  if (status === undefined) {
    return responseMessage;
  }

  const language =
    store.getState().language.languageInfo.languageObject.statusCode;

  if (language[status.toString()] === undefined) {
    return responseMessage;
  }

  if (status === 400 && code === undefined) {
    const { errors } = errorObject;
    let entityList: string[] = [];
    if (errors !== undefined) {
      entityList = Object.keys(errors);
    }
    return `${language['400']['400']}\n${entityList.join(', ')}`;
  }

  if (status === 401 && code === undefined) {
    return language['401']['401'];
  }

  if (status === 403 && code === undefined) {
    return language['403']['403'];
  }

  if (status === 500) {
    return "Server Error";
  }

  const message = language[status.toString()] && language[status.toString()][code.toString()];

  return message === undefined ? responseMessage : message;
};

export default {
  getMessage,
};
