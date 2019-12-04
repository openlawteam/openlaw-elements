// @flow

import * as React from 'react';

import { CSS_CLASS_NAMES as css } from './constants';
import { FieldError } from './FieldError';
import ExtraText from './ExtraText';
import { onBlurValidation, onChangeValidation } from './validation';
import { singleSpaceString } from './utils';
import type {
  FieldExtraTextType,
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
  inputExtraText: ?FieldExtraTextType,
  inputProps: ?FieldPropsValueType,
  getValidity: ValidityFuncType,
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

export class Choice extends React.PureComponent<Props, State> {
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
    
    const { errorData: { errorMessage }, shouldShowError } = onBlurValidation(currentValue, this.props); 

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

  onChange(event: SyntheticInputEvent<HTMLOptionElement>) {
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
        this.state.currentValue || undefined,
        errorData,
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
    const { choiceValues, cleanName, description, inputExtraText, inputProps, variableType } = this.props;
    const { currentValue, errorMessage, shouldShowError } = this.state;
    const errorClassName = (errorMessage && shouldShowError) ? css.fieldInputError : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? `${inputProps.className}` : '';

    return (
      <div className={`${css.field} ${css.fieldTypeToLower(variableType)}`}>
        <label className={`${css.fieldLabel}`}>
          <span className={`${css.fieldLabelText}`}>{description}</span>

          <select
            {...inputProps}

            className={singleSpaceString(
              `${css.fieldSelect} ${cleanName} ${inputPropsClassName} ${errorClassName}`
            )}
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
        
        {inputExtraText && <ExtraText text={inputExtraText} />}
      </div>
    );
  }
}
