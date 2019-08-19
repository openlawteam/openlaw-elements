// @flow

import * as React from 'react';

import { FieldError } from './FieldError';
import { CSS_CLASS_NAMES as css } from './constants';
import { singleSpaceString } from './utils';
import { onBlurValidation, onChangeValidation } from './validation';
import type {
  FieldEnumType,
  FieldPropsValueType,
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
  onValidate: ?OnValidateFuncType,
  savedValue: string,
  variableType: FieldEnumType,
};

type State = {
  currentValue: string,
  errorMessage: string,
  shouldShowError: boolean,
};

export class YesNo extends React.PureComponent<Props, State> {
  state = {
    currentValue: this.props.savedValue,
    errorMessage: '',
    shouldShowError: false,
  };

  noRef: {current: null | HTMLInputElement} = React.createRef();
  yesRef: {current: null | HTMLInputElement} = React.createRef();

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onBlur = this.onBlur.bind(this);
    self.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    // This solves a timing issue where some uses of OpenLawForm
    // were not replacing the savedValue value on mount.
    // It only happens when using a PureComponent.
    setTimeout(() => this.radioCheckedByRef(), 0);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.savedValue !== this.props.savedValue) {
      this.setState({
        currentValue: this.props.savedValue,
      });
    }
  }

  onBlur(event: SyntheticFocusEvent<HTMLInputElement>) {
    const eventValue = event.currentTarget.value;
    const { inputProps } = this.props;

    const { errorData, shouldShowError } = onBlurValidation(eventValue, this.props, this.state);

    // persist event outside of this handler to a parent component
    event.persist();

    this.setState({
      currentValue: eventValue,
      errorMessage: errorData.errorMessage,
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
    event.persist();

    this.setState({
      currentValue: eventValue,
      errorMessage: errorData.errorMessage,
      shouldShowError,
    }, () => {
      onChange(
        name,
        eventValue,
        errorData,
      );

      if (event && inputProps && inputProps.onChange) {
        inputProps.onChange(event);
      }
    });
  }

  // visually update the uncontrolled HTML radio, as we already have the value
  radioCheckedByRef() {
    const currentYesRef = this.yesRef.current;
    const currentNoRef = this.noRef.current;
    
    if (currentYesRef && currentNoRef && this.props.savedValue === 'true') {
      currentYesRef.checked = true;
    }

    if (currentNoRef && currentYesRef && this.props.savedValue === 'false') {
      currentNoRef.checked = true;
    }
  }

  render() {
    const { cleanName, description, inputProps, variableType } = this.props;
    const { errorMessage, shouldShowError } = this.state;
    const inputPropsClassName = (inputProps && inputProps.className) ? `${inputProps.className}` : '';

    return (
      <div className={`${css.field} ${css.fieldTypeToLower(variableType)}`}>
        <label className={`${css.fieldLabel}`}>
          <span className={`${css.fieldLabelText}`}>{description}</span>
        </label>

        <div>
          <label>
            <input
              {...inputProps}

              className={singleSpaceString(`${css.fieldRadio} ${cleanName} ${inputPropsClassName}`)}
              name={cleanName}
              onBlur={this.onBlur}
              onChange={this.onChange}
              ref={this.yesRef}
              type="radio"
              value="true"
            />
            <span>Yes</span>
          </label>

          <label>
            <input
              {...inputProps}
              
              className={singleSpaceString(`${css.fieldRadio} ${cleanName} ${inputPropsClassName}`)}
              name={cleanName}
              onBlur={this.onBlur}
              onChange={this.onChange}
              ref={this.noRef}
              type="radio"
              value="false"
            />
            <span>No</span>
          </label>

          <FieldError
            cleanName={cleanName}
            errorMessage={errorMessage}
            shouldShowError={shouldShowError}
          />
        </div>
      </div>
    );
  }
}
