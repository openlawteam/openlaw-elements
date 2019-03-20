// @flow

import * as React from 'react';

type Props = {
  choiceValues: Array<string>,
  cleanName: string,
  description: string,
  getValidity: (string, string) => any | false,
  name: string,
  onChange: (string, ?string) => mixed,
  savedValue: string,
  textLikeInputClass: string,
};

type State = {
  currentValue: string,
  validationError: boolean,
};

export class Choice extends React.PureComponent<Props, State> {
  state = {
    currentValue: this.props.savedValue || '',
    validationError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
  }

  choiceValuesOption(choice: string) {
    return (
      <option key={choice} value={choice}>
        {choice}
      </option>
    );
  }

  onChange(event: SyntheticEvent<HTMLOptionElement>) {
    const eventValue = event.currentTarget.value;
    const { getValidity, name } = this.props;

    if (!eventValue) {
      this.setState({
        currentValue: '',
        validationError: false,
      }, () => {
        this.props.onChange(name);
      });

      // exit
      return;
    }

    if (getValidity(name, eventValue)) {
      this.setState({
        currentValue: eventValue,
        validationError: false,
      }, () => {
        this.props.onChange(name, eventValue);
      });
    } else {
      this.setState({
        currentValue: eventValue,
        validationError: true,
      });
    }
  }

  render() {
    const { choiceValues, cleanName, description } = this.props;
    const additionalClassName = this.state.validationError ? ' is-error' : '';

    return (
      <div className="contract-variable choice">
        <label className="label">
          <span>{description}</span>

          <select
            value={this.state.currentValue}
            onChange={this.onChange}
            className={`${this.props.textLikeInputClass}${cleanName}${additionalClassName}`}
          >
            <option value="">-- Please choose from the list --</option>
            {choiceValues.map(this.choiceValuesOption)}
          </select>
        </label>
      </div>
    );
  }
}
