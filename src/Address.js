// @flow

import * as React from 'react';
import Autosuggest from 'react-autosuggest';

type Props = {
  apiClient: Object, // opt-out of type checker until we export APIClient flow types
  onChange: (string, ?string) => mixed,
  onKeyUp?: (SyntheticKeyboardEvent<HTMLInputElement>) => mixed,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  textLikeInputClass: string,
  variable: {},
};

type State = {
  currentValue: string,
  errorMsg: string,
  result: Array<Object>,
  validationError: boolean,
};

const getSuggestionValue = suggestion => suggestion.address;
const renderSuggestion = suggestion => <div>{suggestion.address}</div>;

export class Address extends React.Component<Props, State> {
  openLaw = this.props.openLaw;

  onKeyUpReady = false;

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
          .then(() => { this.onKeyUpReady = true; })
          .catch(() => { this.onKeyUpReady = false; });
      }
    } else {
      const variable = this.props.variable;
      const name = this.openLaw.getName(variable);

      this.setState({
        currentValue: eventValue,
        validationError: true,
      }, () => {
        this.onKeyUpReady = false;

        if (this.props.savedValue) {
          this.props.onChange(name);
        }
      });
    }
  }

  onKeyUp(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    const { onKeyUp } = this.props;
    if (onKeyUp && this.onKeyUpReady) onKeyUp(event);
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
      const variable = this.props.variable;

      try {
        if (variable) {
          this.setState({
            validationError: false,
            currentValue: address.address,
          }, () => {
            this.props.onChange(this.openLaw.getName(variable), this.openLaw.createAddress(address));

            resolve();
          });
        } else {
          this.setState({
            validationError: false,
            currentValue: undefined,
          }, () => {
            this.props.onChange(this.openLaw.getName(variable));
          });
        }
      } catch (error) {
        this.setState({
          validationError: true,
          currentValue: '',
        });

        reject();
      }
    });
  }

  render() {
    const variable = this.props.variable;
    const cleanName = this.openLaw.getCleanName(variable);
    const description = this.openLaw.getDescription(variable);
    const additionalClassName = this.state.validationError ? ' is-error' : '';

    const inputProps = {
      autoComplete: 'new-password',
      className: `${this.props.textLikeInputClass}${cleanName}${additionalClassName}`,
      onChange: this.onChange,
      onKeyUp: this.onKeyUp,
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
