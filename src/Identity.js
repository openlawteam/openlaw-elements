// @flow

import * as React from 'react';

import ExtraText from './ExtraText';
import { FieldError } from './FieldError';
import { onBlurValidation, onChangeValidation } from './validation';
import { CSS_CLASS_NAMES as css } from './constants';
import { singleSpaceString } from './utils';
import type {
  FieldEnumType,
  FieldExtraTextType,
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
  inputExtraText: ?FieldExtraTextType,
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

  state = {
    currentValue: '',
    emailIdentity: '',
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
        currentValue: !isError ? JSON.parse(savedValue).email : '',
      });
    }
  }

  createIdentityInternalValue(value: string): string {
    try {
      return this.props.openLaw.createIdentityInternalValue('', value);
    } catch (error) {
      return '';
    }
  }

  onBlur(event: SyntheticFocusEvent<HTMLInputElement>) {
    const { inputProps } = this.props;
    const { emailIdentity } = this.state;
    const { errorData: { errorMessage }, shouldShowError } = onBlurValidation(emailIdentity, this.props, this.state);

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
    const emailIdentity = this.createIdentityInternalValue(eventValue);
    const { errorData, shouldShowError } = onChangeValidation(emailIdentity, this.props, this.state);

    this.setState({
      currentValue: eventValue,
      emailIdentity,
      errorMessage: errorData.errorMessage,
      shouldShowError,
    }, () => {
      onChange(
        name,
        emailIdentity || undefined,
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
    const { cleanName, description, inputExtraText, inputProps, variableType } = this.props;
    const { currentValue, errorMessage, shouldShowError } = this.state;
    const errorClassName = (errorMessage && shouldShowError) ? css.fieldInputError : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';

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
        </label>

        {inputExtraText && <ExtraText text={inputExtraText} />}
      </div>
    );
  }
}
