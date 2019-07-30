// @flow

import * as React from 'react';

import { FieldError } from './FieldError';
import { CSS_CLASS_NAMES, FIELD_DEFAULT_ERROR_MESSAGE, TYPE_TO_READABLE } from './constants';
import type {
  FieldEnumType,
  FieldPropsValueType,
  OnChangeFuncType,
  OnValidateFuncType,
  ValidityFuncType,
} from './flowTypes';

type Props = {
  choiceValues: Array<string>,
  cleanName: string,
  description: string,
  inputProps: ?FieldPropsValueType,
  getValidity: ValidityFuncType,
  name: string,
  onChange: OnChangeFuncType,
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

export class Choice extends React.PureComponent<Props, State> {
  baseErrorData = {
    elementName: this.props.cleanName,
    elementType: this.props.variableType,
    errorMessage: '',
    isError: false,
    value: this.props.savedValue || '',
  };

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
  }

  onBlur(event: SyntheticFocusEvent<HTMLInputElement>) {
    const { getValidity, inputProps, name, onValidate } = this.props;
    const { currentValue } = this.state;
    const hasValue = currentValue.length > 0;
    const { isError } = hasValue ? getValidity(name, currentValue) : {};
    const updatedErrorMessage = (hasValue && isError)
      ? FIELD_DEFAULT_ERROR_MESSAGE
      : '';

    const validationData = {
      ...this.baseErrorData,

      errorMessage: updatedErrorMessage,
      eventType: 'blur',
      isError,
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

  onChange(event: SyntheticInputEvent<HTMLOptionElement>) {
    const eventValue = event.currentTarget.value;
    const { getValidity, inputProps, name, onChange, onValidate } = this.props;
    const hasValue = eventValue.length > 0;
    const { isError } = hasValue ? getValidity(name, eventValue) : {};
    const updatedErrorMessage = (hasValue && isError)
      ? FIELD_DEFAULT_ERROR_MESSAGE
      : '';

    const validationData = {
      ...this.baseErrorData,

      errorMessage: this.state.errorMessage,
      eventType: 'change',
      isError: this.state.errorMessage.length > 0,
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
      onChange(
        name,
        this.state.currentValue || undefined,
      );

      if (event && inputProps && inputProps.onChange) {
        inputProps.onChange(event);
      }
    });
  }

  renderChoiceValuesOption(choice: string) {
    return (
      <option key={choice} value={choice}>
        {choice}
      </option>
    );
  }

  render() {
    const { choiceValues, cleanName, description, inputProps, textLikeInputClass } = this.props;
    const { currentValue, errorMessage, shouldShowError } = this.state;
    const errorClassName = (errorMessage && shouldShowError) ? CSS_CLASS_NAMES.fieldError : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';

    return (
      <div className="contract-variable choice">
        <label className="label">
          <span>{description}</span>

          <select
            {...inputProps}

            className={`${CSS_CLASS_NAMES.field} ${(textLikeInputClass || '')} ${cleanName} ${inputPropsClassName} ${errorClassName}`}
            onBlur={this.onBlur}
            onChange={this.onChange}
            value={currentValue}
          >
            <option value="">&mdash; Please choose from the list &mdash;</option>

            {choiceValues.map(this.renderChoiceValuesOption)}
          </select>

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
