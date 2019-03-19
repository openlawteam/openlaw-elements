// @flow

import * as React from 'react';
import Autosuggest from 'react-autosuggest';

type Props = {
  apiClient: Object, // opt-out of type checker until we export APIClient flow types
  cleanName: string,
  description: string,
  name: string,
  onChange: (string, ?string) => mixed,
  onKeyUp?: (SyntheticKeyboardEvent<HTMLInputElement>, boolean) => mixed,
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
    self.submitAddress = this.submitAddress.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.savedValue &&
      (prevProps.savedValue !== this.props.savedValue)
    ) {
      this.setState({
        currentValue: this.props.savedValue || '',
      });
    }
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
    const { description, cleanName } = this.props;
    const additionalClassName = this.state.validationError ? ' is-error' : '';

    const inputProps = {
      autoComplete: 'new-password',
      className: `${this.props.textLikeInputClass}${cleanName}${additionalClassName}`,
      onChange: this.onChange,
      onKeyUp: (event) => this.props.onKeyUp ? this.props.onKeyUp(event, this.isDataValid) : undefined,
      placeholder: description,
      title: description,
      type: 'text',
      value: this.state.currentValue,
    };

    return (
      <div className={`contract-variable ${cleanName}-address`}>
        <label>
          <span>{description}</span>

          <Autosuggest
            inputProps={inputProps}
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
