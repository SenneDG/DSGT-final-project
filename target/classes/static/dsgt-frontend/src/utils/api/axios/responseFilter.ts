import ModalHelper from '../../helpers/ModalHelper';

const responseFilter = (response: any) => {
  if (response.data.error === null || response.data.error === undefined) return response;
  ModalHelper.openErrorModal({ message: response.data.error.message });
  throw response.data.error;
};

export default responseFilter;
