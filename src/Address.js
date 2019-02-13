// @flow

import * as React from 'react';
import Autosuggest from 'react-autosuggest';

type Props = {
  apiClient: Object, // opt-out of type checker until we export APIClient flow types
  onChange: (string, ?string) => mixed,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
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

  componentDidUpdate() {
    if (
      this.props.savedValue &&
      this.state.currentValue !== this.props.savedValue
    ) {
      this.setState({
        currentValue: this.props.savedValue,
      });
    }
  }

  submitAddress(address: Object) {
    const variable = this.props.variable;

    try {
      if (variable) {
        this.setState({
          validationError: false,
          currentValue: address.address,
        }, () => {
          this.props.onChange(this.openLaw.getName(variable), this.openLaw.createAddress(address));
        });
      } else {
        this.setState({
          validationError: false,
          currentValue: undefined,
        }, () => {
          this.props.onChange(this.openLaw.getName(variable), undefined);
        });
      }
    } catch (error) {
      this.setState({
        validationError: true,
        currentValue: '',
      });
    }
  }

  onChange(event: SyntheticEvent<*>, other: Object) {
    const eventValue = event.currentTarget.value;

    if (typeof eventValue === 'number') {
      const place = this.state.result.find(
        obj => obj.address === other.newValue,
      );

      if (place) {
        this.props.apiClient
          .getAddressDetails(place.placeId)
          .then(this.submitAddress);
      }
    } else {
      const variable = this.props.variable;
      const name = this.openLaw.getName(variable);

      if (this.props.savedValue) {
        this.props.onChange(name, undefined);
      }

      this.setState({
        currentValue: eventValue,
        validationError: true,
      });
    }
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = (request: Object) => {
    this.props.apiClient.searchAddress(request.value).then(result => {
      this.setState({
        result,
      });
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      result: [],
    });
  };

  render() {
    const variable = this.props.variable;
    const cleanName = this.openLaw.getCleanName(variable);
    const description = this.openLaw.getDescription(variable);
    const additionalClassName = this.state.validationError ? ' is-danger-new' : '';

    const inputProps = {
      autoComplete: 'new-password',
      className: `${cleanName}${additionalClassName}`,
      onChange: this.onChange,
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
