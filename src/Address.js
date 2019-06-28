// @flow

import * as React from 'react';
import Autosuggest from 'react-autosuggest';

import type { FieldErrorFuncType, InputPropsValueType, ValidateOnKeyUpFuncType } from './types';

type Props = {
  apiClient: Object, // opt-out of type checker until we export APIClient flow types
  cleanName: string,
  description: string,
  inputProps: ?InputPropsValueType,
  name: string,
  onBlur?: (SyntheticEvent<HTMLInputElement>) => mixed,
  onChange: (string, ?string) => mixed,
  onKeyUp?: ValidateOnKeyUpFuncType,
  onError: FieldErrorFuncType,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  textLikeInputClass: string,
};

type State = {
  currentValue: string,
  errorMessage: string,
  previousValidValue: string,
  suggestions: Array<Object>,
  showError: boolean,
};

const ELEMENT_TYPE = 'Address';

const callAll = (...fns) => (...args: Array<any>) => fns.forEach(fn => fn && fn(...args));
const getSuggestionValue = suggestion => suggestion.address;
const renderSuggestion = suggestion => <div>{suggestion.address}</div>;

export class Address extends React.PureComponent<Props, State> {
  isDataValid = false;

  ref: {current: null | HTMLDivElement} = React.createRef();

  state = {
    currentValue: this.props.savedValue,
    errorMessage: '',
    previousValidValue: '',
    suggestions: [],
    showError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onBlur = this.onBlur.bind(this);
    self.onChange = this.onChange.bind(this);
    self.onKeyUp = this.onKeyUp.bind(this);
    self.submitAddress = this.submitAddress.bind(this);
  }

  onBlur(event: SyntheticEvent<HTMLInputElement>) {
    const { cleanName, onBlur, onError } = this.props;
    const { currentValue, previousValidValue } = this.state;
    // if the user types the previous valid value to "replace" it
    const isValidRetypedValue = this.state.errorMessage && previousValidValue && (previousValidValue === currentValue);

    this.setState({
      errorMessage: isValidRetypedValue ? '' : this.state.errorMessage,
      showError: isValidRetypedValue ? false : true,
    }, () => {
      if (onError) {
        onError({
          message: this.state.errorMessage,
          name: cleanName,
          reactRef: this.ref,
          type: ELEMENT_TYPE,
        });
      }
    });

    if (onBlur) onBlur(event);
  }

  onChange(event: SyntheticEvent<HTMLInputElement>, autosuggestEvent: Object) {
    const eventValue = event.currentTarget.value;
    const { newValue, method } = autosuggestEvent;

    if (method === 'click' || method === 'enter') {
      const place = this.state.suggestions.find(obj => obj.address === newValue);

      if (place) {
        this.props.apiClient
          .getAddressDetails(place.placeId)
          .then(this.submitAddress)
          .then(({ addressData, openlawAddress }) => {
            this.setState({
              currentValue: addressData.address,
              errorMessage: '',
              previousValidValue: addressData.address,
              showError: false,
            }, () => {
              this.isDataValid = true;
              this.props.onChange(this.props.name, openlawAddress);
            });
          })
          .catch(error => {      
            this.setState({
              currentValue: '',
              previousValidValue: '',
              errorMessage: (error && error.customMessage)
                ? error.customMessage
                : 'Something went wrong while creating an address.',
              showError: true,
            }, () => {
              this.isDataValid = false;
            });
          });
      }
    } else {
      const { name } = this.props;

      this.isDataValid = false;

      this.setState({
        currentValue: eventValue,
        errorMessage: 'Please choose a valid address.',
      }, () => {
        if (this.props.savedValue) {
          this.props.onChange(name);
        }
      });
    }
  }

  onKeyUp(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event, this.isDataValid);
    }

    if (this.props.inputProps && this.props.inputProps.onKeyUp) {
      this.props.inputProps.onKeyUp(event);
    }
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = (request: Object) => {
    this.props.apiClient.searchAddress(request.value)
      .then(suggestions => {
        this.setState({
          suggestions,
        });
      })
      .catch(() => {
        this.setState({
          errorMessage: 'Something went wrong while searching for an address.',
        });
      });
  };

  submitAddress(addressData: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const openlawAddress = this.props.openLaw.createAddress(addressData);

        resolve({
          addressData,
          openlawAddress,
        });
      } catch (error) {
        reject({ customMessage: 'Could not create an address with OpenLaw.' });
      }
    });
  }

  render() {
    const { description, cleanName, inputProps, onBlur } = this.props;
    const { currentValue, errorMessage, suggestions, showError } = this.state;
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';

    const autoSuggestInputProps = {
      placeholder: description,
      title: description,

      ...inputProps,

      className: `${this.props.textLikeInputClass}${cleanName}${inputPropsClassName}`,
      onBlur: callAll(onBlur, this.onBlur),
      onChange: this.onChange,
      onKeyUp: this.onKeyUp,
      type: 'text',
      value: currentValue,
    };

    return (
      <div className={`contract-variable ${cleanName}-address`} ref={this.ref}>
        <label>
          <span>{description}</span>

          <Autosuggest
            inputProps={autoSuggestInputProps}
            getSuggestionValue={getSuggestionValue}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            renderSuggestion={renderSuggestion}
            suggestions={suggestions}
          />

          {showError && <div className="openlaw-el-input__error">{errorMessage}</div>}
        </label>
      </div>
    );
  }
}
