import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import Modal from '../../../lib/fragments/Modal/Modal'

import { RootState } from '../../../store/store';
import { ContainerModalStateType } from '../../../store/modal/slice';

import './ContainerModal.scss';

interface State {}

interface MapStateToProps {
  language: any;
  containerModal: ContainerModalStateType;
}

interface DispatchProps {}

interface OwnProps {}

type Props = MapStateToProps & DispatchProps & OwnProps;

class ContainerModal extends React.PureComponent<Props, State> {
  modalContent = () => {
    const { props } = this;
    return props.containerModal.modalObject === null
      ? ''
      : props.containerModal.modalObject.getModalContent();
  };

  onClose = () => {
    const { props } = this;
    return props.containerModal.modalObject === null
      ? () => {}
      : props.containerModal.modalObject.onClose();
  };

  render() {
    const { props } = this;

    return (
      <Modal
        header=""
        hideHeader={true}
        show={props.containerModal.isModalOpen}
        sizeType="fit"
        onClose={this.onClose}
      >
        {this.modalContent()}
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  language: state.language.languageInfo.languageObject,
  containerModal: state.modal.containerModal,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ContainerModal);
