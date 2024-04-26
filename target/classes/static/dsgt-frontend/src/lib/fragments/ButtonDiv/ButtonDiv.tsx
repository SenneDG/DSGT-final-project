import React from 'react';
import { connect } from 'react-redux';

import './ButtonDiv.scss';

const defaultProps = {
  className: '',
  children: '',
  onClick: () => {},
  onFocus: () => {},
  onKeyDown: () => {},
  onMouseDown: () => {},
  onMouseOver: () => {},
  onMouseLeave: () => {},
  tabIndex: 0,
  elementRef: null,
  style: {},
  disabled: false,
};

interface State {}

interface MapStateToProps {}

interface DispatchProps {}

interface OwnProps {
  className: string;
  children: any;
  onClick: () => void;
  onFocus: () => void;
  onKeyDown: () => void;
  onMouseDown: () => void;
  onMouseOver: () => void;
  onMouseLeave: () => void;
  tabIndex: number;
  elementRef: any;
  style: any;
  disabled: boolean;
}

type Props = MapStateToProps & DispatchProps & OwnProps;

class ButtonDiv extends React.PureComponent<Props, State> {
   static defaultProps = defaultProps;

  disabledClassname = () => {
    const { props } = this;
    return props.disabled ? 'disabled' : '';
  };

  render() {
    const { props } = this;

    return (
      <div
        role="button"
        className={`button-div ${props.className} ${this.disabledClassname()}`}
        onClick={props.onClick}
        onFocus={props.onFocus}
        onKeyDown={props.onKeyDown}
        tabIndex={props.tabIndex}
        onMouseDown={props.onMouseDown}
        onMouseOver={props.onMouseOver}
        onMouseLeave={props.onMouseLeave}
        ref={props.elementRef}
        style={props.style}
      >
        {props.children}
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

ButtonDiv.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDiv);
