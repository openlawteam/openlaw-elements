// @flow

import * as React from 'react';

import { FieldError } from './FieldError';
import { onBlurValidation, onChangeValidation } from './validation';
import { CSS_CLASS_NAMES as css } from './constants';
import { singleSpaceString } from './utils';
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
    
    const { errorData: { errorMessage }, shouldShowError } = onBlurValidation(externalSignatureIdentity, this.props, this.state);

    // persist event outside of this handler to a parent component
    event.persist();

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

    const { errorData, shouldShowError } = onChangeValidation(externalSignatureIdentity, this.props, this.state);

    // persist event outside of this handler to a parent component
    event.persist();

    this.setState({
      currentValue: eventValue,
      errorMessage: errorData.errorMessage,
      externalSignatureIdentity,
      shouldShowError,
    }, () => {
      this.isDataValid = externalSignatureIdentity.length > 0;

      onChange(
        name,
        externalSignatureIdentity || undefined,
        errorData,
      );

      if (event && inputProps && inputProps.onChange) {
        inputProps.onChange(event);
      }
    });
  }

  onKeyUp(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    const { inputProps, onKeyUp } = this.props;

    if (onKeyUp) onKeyUp(event, this.isDataValid);

    // persist event outside of this handler to a parent component
    event.persist();

    if (inputProps && inputProps.onKeyUp) {
      inputProps.onKeyUp(event);
    }
  }

  render() {
    const { cleanName, description, inputProps, variableType } = this.props;
    const { currentValue, errorMessage, serviceName, shouldShowError } = this.state;
    const errorClassName = (errorMessage && shouldShowError) ? css.fieldInputError : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? `${inputProps.className}` : '';
    const signatureServiceDescription = serviceName ? `Sign with ${serviceName}` : '';

    return (
      <div className={`${css.field} ${css.fieldTypeToLower(variableType)}`}>
        <label className={`${css.fieldLabel}`}>
          <span className={`${css.fieldLabelText}`}>{description}</span>

          <input
            placeholder={description}
            title={description}

            {...inputProps}

            className={singleSpaceString(
              `${css.fieldInput} ${cleanName} ${inputPropsClassName} ${errorClassName}`
            )}
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
