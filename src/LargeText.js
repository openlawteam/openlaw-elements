// @flow

import * as React from 'react';

import ExtraText from './ExtraText';
import { FieldError } from './FieldError';
import { CSS_CLASS_NAMES as css } from './constants';
import { singleSpaceString } from './utils';
import { onBlurValidation, onChangeValidation } from './validation';
import type {
  FieldEnumType,
  FieldExtraTextType,
  FieldPropsValueType,
  OnChangeFuncType,
  OnValidateFuncType,
} from './flowTypes';

type Props = {
  cleanName: string,
  description: string,
  inputExtraText: ?FieldExtraTextType,
  inputProps: ?FieldPropsValueType,
  name: string,
  onChange: OnChangeFuncType,
  onValidate: ?OnValidateFuncType,
  savedValue: string,
  variableType: FieldEnumType,
};

type State = {
  currentValue: string,
  errorMessage: string,
  shouldShowError: boolean,
};

export class LargeText extends React.PureComponent<Props, State> {
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

  onChange(event: SyntheticInputEvent<HTMLTextAreaElement>) {
    const eventValue = event.currentTarget.value;
    const { inputProps, name, onChange } = this.props;

    const { errorData, shouldShowError } = onChangeValidation(eventValue, this.props, this.state);

    // persist event outside of this handler to a parent component
    event.persist();

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

  render() {
    const { cleanName, description, inputExtraText, inputProps, variableType } = this.props;
    const { errorMessage, shouldShowError } = this.state;
    const inputPropsClassName = (inputProps && inputProps.className) ? `${inputProps.className}` : '';

    return (
      <div className={`${css.field} ${css.fieldTypeToLower(variableType)}`}>
        <label className={`${css.fieldLabel}`}>
          <span className={`${css.fieldLabelText}`}>{description}</span>

          <textarea
            placeholder={description}
            title={description}

            {...inputProps}

            className={singleSpaceString(
              `${css.fieldTextarea} ${cleanName} ${inputPropsClassName}`
            )}
            onBlur={this.onBlur}
            onChange={this.onChange}
            value={this.state.currentValue}
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
