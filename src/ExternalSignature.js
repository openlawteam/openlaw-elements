// @flow

import * as React from 'react';

import { FieldError } from './FieldError';
import { onBlurValidation, onChangeValidation } from './validation';
import { CSS_CLASS_NAMES } from './constants';
import type {
  FieldEnumType,
  FieldPropsValueType,
  OnChangeFuncType,
  OnValidateFuncType,
  ValidityFuncType,
  ValidateOnKeyUpFuncType,
} from './flowTypes';

type Props = {
  cleanName: string,
  description: string,
  getValidity: ValidityFuncType,
  inputProps: ?FieldPropsValueType,
  name: string,
  onChange: OnChangeFuncType,
  onKeyUp?: ValidateOnKeyUpFuncType,
  onValidate: ?OnValidateFuncType,
  openLaw: Object,
  savedValue: string,
  textLikeInputClass: string,
  variableType: FieldEnumType,
};

type State = {
  currentValue: string,
  errorMessage: string,
  externalSignatureIdentity: string,
  serviceName: string,
  shouldShowError: boolean,
};

export class ExternalSignature extends React.PureComponent<Props, State> {
  baseErrorData = {
    elementName: this.props.cleanName,
    elementType: this.props.variableType,
    errorMessage: '',
    isError: false,
    value: (this.props.savedValue || ''),
  };

  // currently used as a helper to send the parent's "on[Event]" props
  // e.g. if it wants to be sure to do a Collection addition on enter press
  isDataValid = false;

  state = {
    currentValue: '',
    errorMessage: '',
    externalSignatureIdentity: '',
    serviceName: '',
    shouldShowError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onBlur = this.onBlur.bind(this);
    self.onChange = this.onChange.bind(this);
    self.onKeyUp = this.onKeyUp.bind(this);
  }

  componentDidMount() {
    const { getValidity, name, savedValue } = this.props;

    if (savedValue) {
      const { isError } = getValidity(name, savedValue);
      const { identity, serviceName } = JSON.parse(savedValue);

      this.setState({
        currentValue: (!isError && identity && identity.email ? identity.email : ''),
        serviceName: (!isError && serviceName) ? serviceName : '',
      });
    }
  }

  createExternalSignatureValue(value: string, serviceName: string): string {
    try {
      return this.props.openLaw.createExternalSignatureValue('', value, serviceName);
    } catch (error) {
      return '';
    }
  }

  onBlur(event: SyntheticFocusEvent<HTMLInputElement>) {
    const { inputProps } = this.props;
    const { externalSignatureIdentity } = this.state;
    const { errorMessage, shouldShowError } = onBlurValidation(externalSignatureIdentity, this.props, this.state);

    // persist event outside of this handler to a parent component
    if (event) event.persist();

    this.setState({
      errorMessage,
      shouldShowError,
    }, () => {
      if (event && inputProps && inputProps.onBlur) {
        inputProps.onBlur(event);
      }
    });
  }

  onChange(event: SyntheticInputEvent<HTMLInputElement>) {
    const eventValue = event.currentTarget.value;
    const { inputProps, name, onChange } = this.props;
    const { serviceName } = this.state;
    const externalSignatureIdentity = this.createExternalSignatureValue(eventValue, serviceName);
    const { errorMessage, shouldShowError } = onChangeValidation(externalSignatureIdentity, this.props, this.state);

    this.setState({
      currentValue: eventValue,
      externalSignatureIdentity,
      errorMessage,
      shouldShowError,
    }, () => {
      this.isDataValid = externalSignatureIdentity.length > 0;

      onChange(
        name,
        externalSignatureIdentity || undefined,
      );

      if (event && inputProps && inputProps.onChange) {
        inputProps.onChange(event);
      }
    });
  }

  onKeyUp(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event, this.isDataValid);
    }

    if (this.props.inputProps && this.props.inputProps.onKeyUp) {
      this.props.inputProps.onKeyUp(event);
    }
  }

  render() {
    const { cleanName, description, inputProps, textLikeInputClass, variableType } = this.props;
    const { currentValue, errorMessage, serviceName, shouldShowError } = this.state;
    const errorClassName = (errorMessage && shouldShowError) ? CSS_CLASS_NAMES.fieldInputError : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';
    const signatureServiceDescription = serviceName ? `Sign with ${serviceName}` : '';

    return (
      <div className={`${CSS_CLASS_NAMES.field} ${CSS_CLASS_NAMES.fieldTypeToLower(variableType)}`}>
        <label className={`${CSS_CLASS_NAMES.fieldLabel}`}>
          <span className={`${CSS_CLASS_NAMES.fieldLabelText}`}>{description}</span>

          <input
            placeholder={description}
            title={description}

            {...inputProps}

            className={`${CSS_CLASS_NAMES.fieldInput} ${textLikeInputClass} ${cleanName} ${inputPropsClassName} ${errorClassName}`}
            onBlur={this.onBlur}
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            type="email"
            value={currentValue}
          />

          <FieldError
            cleanName={cleanName}
            errorMessage={errorMessage}
            shouldShowError={shouldShowError}
          />

          {signatureServiceDescription && (
            <small>{signatureServiceDescription}</small>
          )}
        </label>
      </div>
    );
  }
}
