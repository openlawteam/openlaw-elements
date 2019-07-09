// @flow

import * as React from 'react';

import { typeToReadable } from './constants';
import type {
  FieldErrorFuncType,
  FieldPropsValueType,
  ValidateOnKeyUpFuncType,
  OnChangeFuncType,
  ValidityFuncType,
  VariableTypesEnumType,
} from './types';

type Props = {
  cleanName: string,
  description: string,
  getValidity: ValidityFuncType,
  inputProps: ?FieldPropsValueType,
  name: string,
  onChange: OnChangeFuncType,
  onKeyUp?: ValidateOnKeyUpFuncType,
  onValidate: ?FieldErrorFuncType,
  savedValue: string,
  textLikeInputClass: string,
  variableType: VariableTypesEnumType,
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

  readableVariableType: string = typeToReadable[this.props.variableType];

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
    self.userSetFieldError = this.userSetFieldError.bind(this);
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

  onBlur(event: SyntheticFocusEvent<HTMLInputElement>) {
    const { getValidity, inputProps, name, onValidate } = this.props;
    const { currentValue } = this.state;
    const hasValue = currentValue.length > 0;
    let validityIsError;
    
    if (hasValue) {
      const { isError } = getValidity(name, currentValue);

      validityIsError = isError;
    }
    
    const updatedErrorMessage = (hasValue && validityIsError)
      ? `${(this.readableVariableType + ': ' || '')}Something looks incorrect.`
      : '';

    // persist event outside of this handler to a parent component
    if (event) event.persist();

    this.setState({
      errorMessage: updatedErrorMessage,
      shouldShowError: updatedErrorMessage.length > 0,
    }, () => {
      const validationData = {
        ...this.baseErrorData,

        errorMessage: this.state.errorMessage,
        eventType: 'blur',
        isError: this.state.errorMessage.length > 0,
        value: currentValue,
      };

      onValidate && onValidate(validationData);
      
      if (event && inputProps && inputProps.onBlur) {
        inputProps.onBlur(
          event,
          {
            ...validationData,
            setFieldError: this.userSetFieldError,
          }
        );
      }
    });
  }

  onChange(event: SyntheticInputEvent<HTMLInputElement>) {
    const eventValue = event.currentTarget.value;
    const { getValidity, inputProps, name, onChange, onValidate } = this.props;
    const hasValue = eventValue.length > 0;
    let validityIsError;
    
    if (hasValue) {
      const { isError } = getValidity(name, eventValue);

      validityIsError = isError;
    }

    const updatedErrorMessage = (hasValue && validityIsError)
      ? `${(this.readableVariableType + ': ' || '')}Something looks incorrect.`
      : '';

    // persist event outside of this handler to a parent component
    if (event) event.persist();
    
    const shouldShowError = validityIsError === false || !hasValue ? { shouldShowError: false } : null;

    this.setState({
      currentValue: eventValue,
      errorMessage: updatedErrorMessage,

      ...shouldShowError,
    }, () => {
      this.isDataValid = validityIsError ? false : true;

      const validationData = {
        ...this.baseErrorData,

        errorMessage: this.state.errorMessage,
        eventType: 'change',
        isError: this.state.errorMessage.length > 0,
        value: this.state.currentValue,
      };

      onValidate && onValidate(validationData);

      onChange(
        name,
        this.state.currentValue || undefined,
        validationData,
      );

      if (event && inputProps && inputProps.onChange) {
        inputProps.onChange(
          event,
          {
            ...validationData,

            setFieldError: this.userSetFieldError,
          }
        );
      }
    });
  }

  onKeyUp(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyUp) this.props.onKeyUp(event, this.isDataValid);

    if (this.props.inputProps && this.props.inputProps.onKeyUp) {
      this.props.inputProps.onKeyUp(event);
    }
  }

  userSetFieldError(errorMessage: string = '') {
    this.setState({
      errorMessage,
      shouldShowError: errorMessage.length > 0,
    });
  }

  render() {
    const { cleanName, description, inputProps, textLikeInputClass } = this.props;
    const { currentValue, errorMessage, shouldShowError } = this.state;
    const errorClassName = (errorMessage && shouldShowError) ? 'openlaw-el-field--error' : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';

    return (
      <div className="contract-variable">
        <label>
          <span>{description}</span>

          <input
            placeholder={description}
            title={description}

            {...inputProps}

            className={`openlaw-el-field ${textLikeInputClass} ${cleanName} ${inputPropsClassName} ${errorClassName}`}
            onBlur={this.onBlur}
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            type="text"
            value={currentValue}
          />

          {(shouldShowError && errorMessage) && (
            <div
              className="openlaw-el-field__error-message"
              data-element-name={cleanName}>
              {errorMessage}
            </div>
          )}
        </label>
      </div>
    );
  }
}
