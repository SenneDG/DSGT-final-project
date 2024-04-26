import React from 'react';
import { connect } from 'react-redux';
import { MdClose } from 'react-icons/md';

import ButtonDiv from '../ButtonDiv/ButtonDiv';

import './Modal.scss';

const defaultProps = {
  sizeType: 'fixed',
  hideHeader: false,
  top: false,
  modalClassName: '',
};

interface State {}

interface MapStateToProps {}

interface DispatchProps {}

interface OwnProps {
  sizeType: string;
  show: boolean;
  onClose: () => void;
  header: string;
  hideHeader: boolean;
  children: any;
  top: boolean;
  modalClassName: string;
}

type Props = MapStateToProps & DispatchProps & OwnProps;

class Modal extends React.PureComponent<Props, State> {
  static defaultProps = defaultProps;

  modalTypeClass = () => {
    const { sizeType } = this.props;
    let classname = '';
    if (sizeType === 'fixed') {
      classname = 'fixed-size';
    }
    if (sizeType === 'fit') {
      classname = '';
    }
    return classname;
  };

  topModalClass = () => {
    const { top } = this.props;
    return top ? 'top' : '';
  };

  render() {
    const { props } = this;
    if (!props.show) return '';
    return (
      <div className="modal-wrapper">
        <div
          className={`modal ${
            props.modalClassName
          } ${this.modalTypeClass()} ${this.topModalClass()}`}
        >
          {props.hideHeader ? null : (
            <div className="modal-header">
              <div>{props.header}</div>
              <MdClose
                className="close-button"
                onClick={() => props.onClose()}
              />
            </div>
          )}
          <div className="modal-body">{props.children}</div>
        </div>
        {/* <ButtonDiv */}
        {/*   className={`backdrop ${this.topModalClass()}`} */}
        {/*   onClick={() => props.onClose()} */}
        {/* /> */}
        <div className={`backdrop ${this.topModalClass()}`} />
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
