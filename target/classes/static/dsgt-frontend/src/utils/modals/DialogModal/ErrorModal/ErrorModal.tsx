import React from 'react';
import store from '../../../../store/store';

import DialogModal from '../DialogModal';

import ButtonDiv from '../../../../lib/fragments/ButtonDiv/ButtonDiv';

import { reserveCloseDialogModal } from '../../../../store/modal/slice';

import './ErrorModal.scss';

class ErrorModal extends DialogModal {
  private readonly message: any;

  constructor(message: any) {
    super();
    this.message = message;
  }

  onClose = () => {
    store.dispatch(reserveCloseDialogModal());
  };

  getModalTitle = () => "Error";

  getModalContent = () => (
    <div className="error-modal">
      <div className="message">{this.message}</div>
      <div className="button-group">
        <ButtonDiv className="confirm-button" onClick={this.onClose}>
          OK
        </ButtonDiv>
      </div>
    </div>
  );
}

export default ErrorModal;
