// @flow

import * as React from 'react';

import { typeToReadable } from './constants';
import type {
  FieldErrorFuncType,
  FieldPropsValueType,
  ValidateOnKeyUpFuncType,
  ValidityFuncType,
  VariableTypesEnumType,
} from './types';

type Props = {
  cleanName: string,
  description: string,
  getValidity: ValidityFuncType,
  inputProps: ?FieldPropsValueType,
  name: string,
  onChange: (string, ?string) => mixed,
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
    const { currentValue, errorMessage } = this.state;
    const hasValue = currentValue.length > 0;
    let validityIsError;
    
    if (hasValue) {
      const { isError } = getValidity(name, currentValue);

      validityIsError = isError;
    }
    
    const updatedErrorMessage = errorMessage || (
      (validityIsError)
        ? `${(this.readableVariableType + ': ' || '')}Something looks incorrect.`
        : ''
    );

    this.setState({
      errorMessage: hasValue ? updatedErrorMessage : '',
      shouldShowError: validityIsError,
    }, () => {
      onValidate && onValidate({
        ...this.baseErrorData,

        errorMessage: this.state.errorMessage,
        eventType: 'blur',
        isError: this.state.errorMessage.length > 0,
        value: currentValue,
      });
    });
    
    // persist event outside of this handler to a parent component
    if (event) event.persist();
    
    if (event && inputProps && inputProps.onBlur) {
      inputProps.onBlur(event);
    }
  }

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    const eventValue = event.currentTarget.value;
    const { getValidity, inputProps, name, onChange, onValidate } = this.props;
    const { errorMessage } = this.state;
    const { isError:validityIsError } = getValidity(name, eventValue);
    const validate = data => onValidate && onValidate({
      ...this.baseErrorData,

      errorMessage: errorMessage,
      eventType: 'change',
      isError: errorMessage.length > 0,
      value: '',

      ...data,
    });

    if (!eventValue) {
      if (this.state.currentValue) {
        this.setState({
          currentValue: '',
          shouldShowError: false,
        }, () => {
          this.isDataValid = true;

          this.props.onChange(name);

          validate({
            ...this.baseErrorData,

            value: '',
          });

          onChange(name);

          if (event && inputProps && inputProps.onChange) {
            inputProps.onChange(event);
          }
        });
      }

      // exit
      return;
    }

    if (!validityIsError) {
      this.setState({
        currentValue: eventValue,
        shouldShowError: false,
      }, () => {
        this.isDataValid = true;

        validate({
          ...this.baseErrorData,

          value: this.state.currentValue,
        });

        onChange(name, eventValue);

        if (event && inputProps && inputProps.onChange) {
          inputProps.onChange(event);
        }
      });
    } else {
      const updatedErrorMessage = errorMessage || (
        (validityIsError)
          ? `${(this.readableVariableType + ': ' || '')}Something looks incorrect.`
          : ''
      );

      this.setState({
        currentValue: eventValue,
      }, () => {
        this.isDataValid = false;

        validate({
          ...this.baseErrorData,

          errorMessage: updatedErrorMessage,
          isError: updatedErrorMessage.length > 0,
          value: this.state.currentValue,
        });
      });
    }
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
