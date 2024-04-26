import React from 'react';
import { connect } from 'react-redux';

import Modal from '../../../lib/fragments/Modal/Modal';

import { RootState } from '../../../store/store';
import { DialogModalStateType } from '../../../store/modal/slice';

import './DialogModal.scss';

interface State {}

interface MapStateToProps {
  dialogModal: DialogModalStateType;
}

interface DispatchProps {}

interface OwnProps {}

type Props = MapStateToProps & DispatchProps & OwnProps;

class DialogModal extends React.PureComponent<Props, State> {
  modalTitle = () => {
    const { props } = this;
    return props.dialogModal.modalObject === null
      ? ''
      : props.dialogModal.modalObject.getModalTitle();
  };

  modalContent = () => {
    const { props } = this;
    return props.dialogModal.modalObject === null
      ? ''
      : props.dialogModal.modalObject.getModalContent();
  };

  onClose = () => {
    const { props } = this;
    return props.dialogModal.modalObject === null
      ? () => {}
      : props.dialogModal.modalObject.onClose();
  };

  render() {
    const { props } = this;

    return (
      <Modal
        show={props.dialogModal.isModalOpen}
        sizeType="fit"
        header={this.modalTitle()}
        onClose={this.onClose}
      >
        {this.modalContent()}
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  dialogModal: state.modal.dialogModal,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DialogModal);
