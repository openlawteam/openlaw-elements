// @flow

import * as React from 'react';

import { FieldError } from './FieldError';
import { onBlurValidation, onChangeValidation } from './validation';
import { CSS_CLASS_NAMES } from './constants';
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
  textLikeInputClass: string,
  variableType: FieldEnumType,
};

type State = {
  currentValue: string,
  errorMessage: string,
  shouldShowError: boolean,
};

export class Text extends React.PureComponent<Props, State> {
  isDataValid = true;

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
      this.isDataValid = shouldShowError ? false : true;

      onChange(
        name,
        this.state.currentValue || undefined,
        errorData,
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
    const { cleanName, description, inputProps, textLikeInputClass, variableType } = this.props;
    const { currentValue, errorMessage, shouldShowError } = this.state;
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

            className={singleSpaceString(
              `${CSS_CLASS_NAMES.fieldInput} ${textLikeInputClass} ${cleanName} ${inputPropsClassName} ${errorClassName}`
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
