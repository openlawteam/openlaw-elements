// @flow

import * as React from 'react';

import { FieldError } from './FieldError';
import { onBlurValidation, onChangeValidation } from './validation';
import { CSS_CLASS_NAMES as css, PERIOD, TEXT } from './constants';
import { singleSpaceString } from './utils';
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
  variableType: FieldEnumType,
};

type State = {
  currentValue: string,
  errorMessage: string,
  shouldShowError: boolean,
};

export class Text extends React.PureComponent<Props, State> {
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
    const { inputProps } = this.props;
    const { currentValue } = this.state;
    const { errorData: { errorMessage }, shouldShowError } = onBlurValidation(currentValue, this.props, this.state); 

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
    const { inputProps, name, onChange, variableType } = this.props;
    const eventValue = event.currentTarget.value;
    const possiblyFormattedValue = variableType === PERIOD ? eventValue.toLowerCase() : eventValue;
    const { errorData, shouldShowError } = onChangeValidation(possiblyFormattedValue, this.props, this.state);

    // persist event outside of this handler to a parent component
    event.persist();

    this.setState({
      currentValue: possiblyFormattedValue,
      errorMessage: errorData.errorMessage,
      shouldShowError,
    }, () => {
      const shouldValueBeUndefined = variableType !== TEXT && (errorData.isError || eventValue === '')
        ? true
        : variableType === TEXT && eventValue === '';

      onChange(
        name,
        (shouldValueBeUndefined ? undefined : this.state.currentValue),
        errorData,
      );

      if (event && inputProps && inputProps.onChange) {
        inputProps.onChange(event);
      }
    });
  }

  onKeyUp(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    const { inputProps, onKeyUp } = this.props;

    if (onKeyUp) onKeyUp(event);

    // persist event outside of this handler to a parent component
    event.persist();

    if (inputProps && inputProps.onKeyUp) {
      inputProps.onKeyUp(event);
    }
  }

  render() {
    const { cleanName, description, inputProps, variableType } = this.props;
    const { currentValue, errorMessage, shouldShowError } = this.state;
    const errorClassName = (errorMessage && shouldShowError) ? css.fieldInputError : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? `${inputProps.className}` : '';

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
