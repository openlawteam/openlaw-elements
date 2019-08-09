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
  savedValue: string,
  variableType: FieldEnumType,
};

type State = {
  currentValue: string,
  errorMessage: string,
  shouldShowError: boolean,
};

export class NumberInput extends React.PureComponent<Props, State> {
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

  onBlur(event: SyntheticFocusEvent<HTMLInputElement>) {
    const { inputProps } = this.props;
    const { currentValue } = this.state;
    const { errorData: { errorMessage }, shouldShowError } = onBlurValidation(currentValue, this.props); 

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
    const { errorData, shouldShowError } = onChangeValidation(eventValue, this.props, this.state);
    
    // persist event outside of this handler to a parent component
    if (event) event.persist();

    this.setState({
      currentValue: eventValue,
      errorMessage: errorData.errorMessage,
      shouldShowError,
    }, () => {
      onChange(
        name,
        eventValue || undefined,
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
    const { errorMessage, shouldShowError } = this.state;
    const errorClassName = (errorMessage && shouldShowError) ? css.fieldInputError : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? `${inputProps.className}` : '';

    return (
      <div className={`${css.field} ${css.fieldTypeToLower(variableType)}`}>
        <label className={`${css.fieldLabel}`}>
          <span className={`${css.fieldLabelText}`}>{description}</span>

          <input
            placeholder={description}

            {...inputProps}

            className={singleSpaceString(
              `${css.fieldInput} ${cleanName} ${inputPropsClassName} ${errorClassName}`
            )}
            onBlur={this.onBlur}
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            type="number"
            value={this.state.currentValue}
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
