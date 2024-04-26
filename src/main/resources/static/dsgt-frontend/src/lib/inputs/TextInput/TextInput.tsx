import React from 'react';
import { connect } from 'react-redux';

import ButtonDiv from '../../fragments/ButtonDiv/ButtonDiv';

import FormikHelper from '../../../utils/helpers/FormikHelper';

import './TextInput.scss';

const defaultProps = {
  subTitle: '',
  inputPlaceholder: '',
  inputType: 'text',
  touched: {},
  errors: {},
  errorMessage: '',
  description: '',
  trailingIcon: '',
  iconOnClick: () => {},
  onKeyUp: FormikHelper.handleEnterKeyUp,
  disable: false,
  display: false,
  required: false,
  zenMode: false,
  full: false,
};

interface State {}

interface MapStateToProps {}

interface DispatchProps {}

interface OwnProps {
  title: string;
  subTitle?: any;
  inputName: string;
  inputPlaceholder?: string;
  inputValue: string | number;
  inputOnChange: (event: any) => void;
  inputType?: string;
  touched?: any;
  errors?: any;
  errorMessage?: string;
  description?: any;
  trailingIcon?: any;
  iconOnClick?: () => void;
  onKeyUp?: (event: any) => void;
  disable?: boolean;
  display?: boolean;
  required?: boolean;
  full?: boolean;
  zenMode?: boolean;
}

type Props = MapStateToProps & DispatchProps & OwnProps;

class TextInput extends React.PureComponent<Props, State> {
  static defaultProps = defaultProps;

  formInputClassname = () => {
    const { props } = this;
    return props.trailingIcon !== '' ? 'form-input with-icon' : 'form-input';
  };

  disableClassname = () => {
    const { props } = this;
    return props.disable ? 'disable' : '';
  };

  displayClassname = () => {
    const { props } = this;
    return props.display ? 'display' : '';
  };

  zenModeClassname = () => {
    const { props } = this;
    return props.zenMode ? 'zen' : '';
  };

  handleOnChange = (event: any) => {
    const { props } = this;
    if (!props.display && !props.disable) {
      props.inputOnChange(event);
    }
  };

  displayInput = () => {
    const { props } = this;
    if (props.inputType === 'textarea') {
      return (
        <textarea
          className={`form-input textarea ${this.disableClassname()} ${this.fullClassname()} ${this.displayClassname()}`}
          name={props.inputName}
          placeholder={props.inputPlaceholder}
          value={props.inputValue}
          onChange={this.handleOnChange}
          onKeyUp={props.onKeyUp}
          readOnly={props.disable}
          autoComplete="off"
        />
      );
    }
    if (props.inputType === 'number') {
      return (
        <input
          className={`${this.formInputClassname()} ${this.disableClassname()} ${this.fullClassname()} ${this.displayClassname()}`}
          type="text"
          inputMode="numeric"
          name={props.inputName}
          placeholder={props.inputPlaceholder}
          value={props.inputValue}
          onChange={(event) => {
            if (/^(\d*)([,.]\d{0,5})?$/.test(event.target.value)) {
              this.handleOnChange(event);
            }
          }}
          onKeyUp={props.onKeyUp}
          readOnly={props.disable}
          autoComplete="off"
        />
      );
    }
    return (
      <input
        className={`${this.formInputClassname()} ${this.disableClassname()} ${this.fullClassname()} ${this.displayClassname()}`}
        type={props.inputType}
        name={props.inputName}
        placeholder={props.inputPlaceholder}
        value={props.inputValue}
        onChange={this.handleOnChange}
        onKeyUp={props.onKeyUp}
        readOnly={props.disable}
        autoComplete="off"
      />
    );
  };

  requiredClassname = () => {
    const { props } = this;
    return props.required ? 'required' : '';
  };

  fullClassname = () => {
    const { props } = this;
    return props.full ? 'full' : '';
  };

  render() {
    const { props } = this;

    return (
      <div className={`text-input ${this.zenModeClassname()}`}>
        <div className="input-title-container">
          <div className={`input-title ${this.requiredClassname()}`}>
            {props.title}
          </div>
          {props.subTitle === '' ? null : props.subTitle}
        </div>
        <div className={`input-container ${this.fullClassname()}`}>
          <div className="input-text-section">
            {this.displayInput()}
            <ButtonDiv className="trailing-icon" onClick={props.iconOnClick}>
              {props.trailingIcon}
            </ButtonDiv>
          </div>
          <div className="message-section">
            {props.touched[props.inputName] &&
              props.errors[props.inputName] && (
                <div className="error-message">
                  {props.errors[props.inputName]}
                </div>
              )}
            {props.errorMessage && (
              <div className="error-message">{props.errorMessage}</div>
            )}
            {props.description !== '' && (
              <div className="input-description">{props.description}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TextInput);
