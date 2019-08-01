// @flow

import * as React from 'react';

import { FieldError } from './FieldError';
import { CSS_CLASS_NAMES, FIELD_DEFAULT_ERROR_MESSAGE, TYPE_TO_READABLE } from './constants';
import type {
  FieldEnumType,
  FieldPropsValueType,
  ValidateOnKeyUpFuncType,
  OnChangeFuncType,
  OnValidateFuncType,
  ValidityFuncType,
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
  savedValue: string,
  textLikeInputClass: string,
  variableType: FieldEnumType,
};

type State = {
  currentValue: string,
  errorMessage: string,
  shouldShowError: boolean,
};

export class Text extends React.PureComponent<Props, State> {
  baseErrorData = {
    elementName: this.props.cleanName,
    elementType: this.props.variableType,
    errorMessage: '',
    isError: false,
    value: (this.props.savedValue || ''),
  };

  isDataValid = true;

  readableVariableType: string = TYPE_TO_READABLE[this.props.variableType];

  state = {
    currentValue: this.props.savedValue || '',
    errorMessage: '',
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

      this.setState({
        currentValue: !isError ? savedValue : '',
      });
    }
  }

  getGenericErrorMessage(includeVariableType: boolean = true) {
    if (includeVariableType) {
      return `${(this.readableVariableType ? `${this.readableVariableType}: ` : '')}${FIELD_DEFAULT_ERROR_MESSAGE}`;
    }
    return `${FIELD_DEFAULT_ERROR_MESSAGE}`;
  }

  onBlur(event: SyntheticFocusEvent<HTMLInputElement>) {
    const { getValidity, inputProps, name, onValidate, variableType } = this.props;
    const { currentValue } = this.state;
    const hasValue = currentValue.length > 0;
    const { isError } = hasValue ? getValidity(name, currentValue) : {};
    const updatedErrorMessage = (!hasValue || !isError)
      ? ''
      : (variableType === 'Text')
      ? this.getGenericErrorMessage(false)
      : this.getGenericErrorMessage();

    const validationData = {
      ...this.baseErrorData,

      errorMessage: updatedErrorMessage,
      eventType: 'blur',
      isError: isError || updatedErrorMessage.length > 0 || false,
      value: currentValue,
    };

    const userReturnedValidationData = onValidate && onValidate(validationData);
    const { errorMessage: userErrorMessage } = userReturnedValidationData || {};
    const errorMessageToSet = userErrorMessage || updatedErrorMessage;

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
    const { getValidity, inputProps, name, onChange, onValidate } = this.props;
    const hasValue = eventValue.length > 0;
    const { isError } = hasValue ? getValidity(name, eventValue) : {};
    const updatedErrorMessage = (hasValue && isError)
      ? `${(this.readableVariableType ? `${this.readableVariableType}: ` : '')}${FIELD_DEFAULT_ERROR_MESSAGE}`
      : '';

    const validationData = {
      ...this.baseErrorData,

      errorMessage: updatedErrorMessage,
      eventType: 'change',
      isError,
      value: eventValue,
    };

    const userReturnedValidationData = onValidate && onValidate(validationData);
    const { errorMessage: userErrorMessage } = userReturnedValidationData || {};
    const errorMessageToSet = userErrorMessage || updatedErrorMessage;
    const shouldShowError = userErrorMessage
      ? { shouldShowError: true } // show because user said so
      : (isError === false || !hasValue)
      ? { shouldShowError: false } // do not show by default onChange
      : null; // set nothing

    // persist event outside of this handler to a parent component
    if (event) event.persist();
    
    this.setState({
      currentValue: eventValue,
      errorMessage: errorMessageToSet,

      ...shouldShowError,
    }, () => {
      this.isDataValid = isError ? false : true;

      onChange(
        name,
        this.state.currentValue || undefined
      );

      if (event && inputProps && inputProps.onChange) {
        inputProps.onChange(event);
      }
    });
  }

  onKeyUp(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyUp) this.props.onKeyUp(event, this.isDataValid);

    if (this.props.inputProps && this.props.inputProps.onKeyUp) {
      this.props.inputProps.onKeyUp(event);
    }
  }

  render() {
    const { cleanName, description, inputProps, textLikeInputClass } = this.props;
    const { currentValue, errorMessage, shouldShowError } = this.state;
    const errorClassName = (errorMessage && shouldShowError) ? CSS_CLASS_NAMES.fieldError : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';

    return (
      <div className="contract-variable">
        <label>
          <span>{description}</span>

          <input
            placeholder={description}
            title={description}

            {...inputProps}

            className={`${CSS_CLASS_NAMES.field} ${textLikeInputClass} ${cleanName} ${inputPropsClassName} ${errorClassName}`}
            onBlur={this.onBlur}
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            type="text"
            value={currentValue}
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
