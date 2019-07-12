// @flow

import * as React from 'react';
import Autosuggest from 'react-autosuggest';

import type { InputPropsValueType, ValidateOnKeyUpFuncType } from './types';

type Props = {
  apiClient: Object, // opt-out of type checker until we export APIClient flow types
  cleanName: string,
  description: string,
  inputProps: ?InputPropsValueType,
  name: string,
  onChange: (string, ?string) => mixed,
  onKeyUp?: ValidateOnKeyUpFuncType,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  textLikeInputClass: string,
};

type State = {
  currentValue: string,
  errorMsg: string,
  result: Array<Object>,
  validationError: boolean,
};

const getSuggestionValue = suggestion => suggestion.address;
const renderSuggestion = suggestion => <div>{suggestion.address}</div>;

export class Address extends React.PureComponent<Props, State> {
  isDataValid = false;

  state = {
    currentValue: this.props.savedValue,
    errorMsg: '',
    result: [],
    validationError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
    self.onKeyUp = this.onKeyUp.bind(this);
    self.submitAddress = this.submitAddress.bind(this);
  }

  onChange(event: SyntheticEvent<HTMLInputElement>, autosuggestEvent: Object) {
    const eventValue = event.currentTarget.value;
    const { newValue, method } = autosuggestEvent;

    if (method === 'click' || method === 'enter') {
      const place = this.state.result.find(obj => obj.address === newValue);

      if (place) {
        this.props.apiClient
          .getAddressDetails(place.placeId)
          .then(this.submitAddress)
          .then(() => { this.isDataValid = true; })
          .catch(() => { this.isDataValid = false; });
      }
    } else {
      const { name } = this.props;

      this.setState({
        currentValue: eventValue,
        validationError: true,
      }, () => {
        this.isDataValid = false;

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
      result: [],
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = (request: Object) => {
    this.props.apiClient.searchAddress(request.value).then(result => {
      this.setState({
        result,
      });
    });
  };

  submitAddress(address: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      const { name, openLaw } = this.props;

      try {
        if (address) {
          this.setState({
            validationError: false,
            currentValue: address.address,
          }, () => {
            this.props.onChange(name, openLaw.createAddress(address));

            resolve();
          });
        } else {
          this.setState({
            currentValue: undefined,
            validationError: false,
          }, () => {
            this.props.onChange(name);
          });
        }
      } catch (error) {
        this.setState({
          currentValue: '',
          validationError: true,
        });

        reject();
      }
    });
  }

  render() {
    const { description, cleanName, inputProps } = this.props;
    const additionalClassName = this.state.validationError ? ' is-error' : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';

    const autoSuggestInputProps = {
      placeholder: description,
      title: description,

      ...inputProps,

      className: `${this.props.textLikeInputClass}${cleanName}${additionalClassName}${inputPropsClassName}`,
      onChange: this.onChange,
      onKeyUp: this.onKeyUp,
      type: 'text',
      value: this.state.currentValue,
    };

    return (
      <div className={`contract-variable ${cleanName}-address`}>
        <label>
          <span>{description}</span>

          <Autosuggest
            inputProps={autoSuggestInputProps}
            getSuggestionValue={getSuggestionValue}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            renderSuggestion={renderSuggestion}
            suggestions={this.state.result}
          />
        </label>
      </div>
    );
  }
}
