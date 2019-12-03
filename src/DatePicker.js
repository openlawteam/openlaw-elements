// @flow

import * as React from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

import ExtraText from './ExtraText';
import { CSS_CLASS_NAMES as css } from './constants';
import { FieldError } from './FieldError';
import { onChangeValidation, onBlurValidation } from './validation';
import { singleSpaceString } from './utils';
import type {
  FieldEnumType,
  FieldExtraTextType,
  FieldPropsValueType,
  OnChangeFuncType,
  ValidityFuncType,
} from './flowTypes';

type Props = {
  cleanName: string,
  description: string,
  getValidity: ValidityFuncType,
  inputExtraText: ?FieldExtraTextType,
  inputProps: ?FieldPropsValueType,
  name: string,
  onChange: OnChangeFuncType,
  savedValue: string,
  variableType: FieldEnumType,
};

type State = {
  enableTime: boolean,
  errorMessage: string,
  shouldShowError: boolean,
};

export class DatePicker extends React.PureComponent<Props, State> {
  flatpickrInstance: any; 
  flatpickrRef: {current: null | HTMLInputElement} = React.createRef(); 

  state = {
    enableTime: this.props.variableType === 'DateTime',
    errorMessage: '',
    shouldShowError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.getFlatpickrOptions = this.getFlatpickrOptions.bind(this);
    self.onFlatpickrChange = this.onFlatpickrChange.bind(this);
    self.onFlatpickrClose = this.onFlatpickrClose.bind(this);
  }

  componentDidMount() {
    // start new Flatpickr instance
    this.flatpickrInstance = flatpickr(this.flatpickrRef.current, this.getFlatpickrOptions());
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps !== this.props) {
      // Pick up new props by re-instantiating Flatpickr after ref's DOM node has updated.
      // The visible flatpickr `input` (via React <input /> below) will not
      // update its props after instantiation. Using `react-flatpickr doesn't really help, either.
      setTimeout(() => {
        // destroy old flatpickr instance
        this.flatpickrInstance.destroy();
        // start a new flatpickr instance
        flatpickr([this.flatpickrRef.current], this.getFlatpickrOptions());
      });
    }
  }

  componentWillUnmount() {
    // destroy flatpickr instance
    this.flatpickrInstance.destroy();
  }

  getFlatpickrOptions() {
    const { savedValue, variableType } = this.props;
    const { enableTime } = this.state;
    // this is so change and blur are fired in the correct order for validation
    // for different flatpickr input types
    const changeFunction = (variableType === 'DateTime')
      ? { onChange: this.onFlatpickrChange }
      : { onValueUpdate: this.onFlatpickrChange };

    return {
      dateFormat: enableTime ? 'F j, Y h:i K' : 'F j, Y',
      defaultDate: savedValue ? new Date(parseInt(savedValue)) : '',
      // allow time selection 00:00, AM/PM
      enableTime,
      onClose: this.onFlatpickrClose,

      ...changeFunction,
    };
  }
  
  // We don't use this for OpenLawForm onChangeFunction
  // This is only for the user's onValidate callback.
  onFlatpickrChange(selectedDates: Array<Date>) {
    const { errorData: { errorMessage }, shouldShowError } = onChangeValidation(
      selectedDates.length ? selectedDates[0].getTime().toString() : '',
      this.props,
      this.state,
    );

    this.setState({
      errorMessage,
      shouldShowError,
    });
  }

  // essentially onBlur
  onFlatpickrClose(selectedDates: Array<Date>) {
    const { name, onChange } = this.props;
    const epochUTCString = (selectedDates.length ? selectedDates[0].getTime().toString() : undefined);
    const onValidateEpochUTCString = (selectedDates.length ? selectedDates[0].getTime().toString() : '');
    const { errorData, shouldShowError } = onBlurValidation(
      onValidateEpochUTCString,
      this.props,
      this.state,
    );

    this.setState({
      errorMessage: errorData.errorMessage,
      shouldShowError,
    }, () => {
      onChange(name, epochUTCString, errorData);
    });
  }

  shouldShowIOSLabel() {
    const isIOS = !!window.navigator.platform && /iPad|iPhone|iPod/.test(window.navigator.platform);
    return isIOS && !this.props.savedValue;
  }

  render() {
    const { cleanName, description, inputExtraText, inputProps, variableType } = this.props;
    const { errorMessage, shouldShowError } = this.state;
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';

    return (
      <div className={singleSpaceString(
        `${css.field} ${css.fieldTypeToLower(variableType)}
      `)}>
        <label className={`${css.fieldLabel}`}>
          <span className={`${css.fieldLabelText}`}>{description}</span>
          
          {this.shouldShowIOSLabel() && (
            // https://flatpickr.js.org/mobile-support/
            <span className={css.fieldLabelIos}>{description}</span>
          )}

          {/* flatpickr-enabled input */}
          {/* options are handled in this.getFlatpickrOptions */}
          <input
            placeholder={description}
            
            {...inputProps}

            className={singleSpaceString(
              `${css.fieldInput} ${cleanName} ${inputPropsClassName}`,
            )}
            ref={this.flatpickrRef}
          />

          <FieldError
            cleanName={cleanName}
            errorMessage={errorMessage}
            shouldShowError={shouldShowError}
          />

          {inputExtraText && <ExtraText text={inputExtraText} />}
        </label>
      </div>
    );
  }
}
