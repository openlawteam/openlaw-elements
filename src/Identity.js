// @flow

import * as React from 'react';

import { FieldError } from './FieldError';
import { CSS_CLASS_NAMES, FIELD_DEFAULT_ERROR_MESSAGE, TYPE_TO_READABLE } from './constants';
import type {
  FieldEnumType,
  FieldErrorType,
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
  email: string,
  emailIdentity: string,
  errorMessage: string,
  shouldShowError: boolean,
};

export class Identity extends React.PureComponent<Props, State> {
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

  readableVariableType: string = TYPE_TO_READABLE[this.props.variableType];

  state = {
    email: '',
    emailIdentity: '',
    errorMessage: '',
    shouldShowError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.callOnValidateAndGetErrorMessage = this.callOnValidateAndGetErrorMessage.bind(this);
    self.onBlur = this.onBlur.bind(this);
    self.onChange = this.onChange.bind(this);
    self.onKeyUp = this.onKeyUp.bind(this);
  }

  componentDidMount() {
    const { getValidity, name, savedValue } = this.props;

    if (savedValue) {
      const { isError } = getValidity(name, savedValue);

      this.setState({
        email: !isError ? JSON.parse(savedValue).email : '',
      });
    }
  }
  
  callOnValidateAndGetErrorMessage(validationData: FieldErrorType): string {
    const { onValidate } = this.props;
    const userReturnedValidationData = onValidate && onValidate(validationData);
    const { errorMessage } = userReturnedValidationData || {};
    
    return errorMessage || validationData.errorMessage;
  }

  getGenericErrorMessage(includeVariableType: boolean = true) {
    if (includeVariableType) {
      return `${(this.readableVariableType ? `${this.readableVariableType}: ` : '')}${FIELD_DEFAULT_ERROR_MESSAGE}`;
    }
    return `${FIELD_DEFAULT_ERROR_MESSAGE}`;
  }

  onBlur(event: SyntheticFocusEvent<HTMLInputElement>) {
    const { getValidity, inputProps, name } = this.props;
    const { email, emailIdentity } = this.state;
    const hasValue = email.length > 0;
    const { isError } = hasValue ? getValidity(name, emailIdentity) : {};
    const updatedErrorMessage = (hasValue && isError)
      ? this.getGenericErrorMessage()
      : '';
    const errorMessageToSet = this.callOnValidateAndGetErrorMessage({
      ...this.baseErrorData,

      errorMessage: updatedErrorMessage,
      eventType: 'blur',
      isError: isError || false,
      value: email,
    });

    // persist event outside of this handler to a parent component
    if (event) event.persist();

    this.setState({
      errorMessage: errorMessageToSet,
      shouldShowError: errorMessageToSet.length > 0,
    }, () => {
      if (event && inputProps && inputProps.onBlur) {
        inputProps.onBlur(event);
      }
    });
  }

  onChange(event: SyntheticInputEvent<HTMLInputElement>) {
    const eventValue = event.currentTarget.value;
    const { inputProps, name, openLaw, onChange, onValidate } = this.props;
    let emailIdentity: string;

    try {
      emailIdentity = openLaw.createIdentityInternalValue('', eventValue);
      
      this.isDataValid = true;
    } catch (error) {
      this.isDataValid = false;

      emailIdentity = '';
    }

    const userReturnedValidationData = onValidate && onValidate({
      ...this.baseErrorData,

      errorMessage: (eventValue.length && !emailIdentity) ? this.getGenericErrorMessage() : '',
      eventType: 'change',
      isError: (eventValue.length > 0 && !emailIdentity) && true,
      value: eventValue,
    });
    const maybeUserProvidedErrorMessage = userReturnedValidationData && userReturnedValidationData.errorMessage
      ? userReturnedValidationData.errorMessage
      : ''; 

    this.setState({
      email: eventValue,
      emailIdentity,
      errorMessage: maybeUserProvidedErrorMessage,
      shouldShowError: maybeUserProvidedErrorMessage.length > 0,
    }, () => {
      onChange(
        name,
        emailIdentity || undefined,
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
    const { email, errorMessage, shouldShowError } = this.state;
    const errorClassName = (errorMessage && shouldShowError) ? CSS_CLASS_NAMES.fieldInputError : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';

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
            value={email}
          />

          <FieldError
            cleanName={cleanName}
            errorMessage={errorMessage}
            shouldShowError={shouldShowError}
          />
        </label>
      </div>
    );
  }
}
