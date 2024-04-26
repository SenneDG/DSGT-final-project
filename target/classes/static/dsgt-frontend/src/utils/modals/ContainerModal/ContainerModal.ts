import store from '../../../store/store';

import BaseModal from '../BaseModal';

import { closeContainerModal } from '../../../store/modal/slice';

class ContainerModal extends BaseModal {
  onClose = () => {
    store.dispatch(closeContainerModal());
  };
}

export default ContainerModal;
