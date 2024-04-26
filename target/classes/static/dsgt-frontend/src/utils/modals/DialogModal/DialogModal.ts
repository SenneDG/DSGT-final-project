import store from '../../../store/store';

import BaseModal from '../BaseModal';

import { closeDialogModal } from '../../../store/modal/slice';

class DialogModal extends BaseModal {
  onClose = () => {
    store.dispatch(closeDialogModal());
  };
}

export default DialogModal;
