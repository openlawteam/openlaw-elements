// @flow

import * as React from 'react';

import type { InputPropsValueType } from './types';

type Props = {
  choiceValues: Array<string>,
  cleanName: string,
  description: string,
  inputProps: ?InputPropsValueType,
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
    const { choiceValues, cleanName, description, inputProps } = this.props;
    const additionalClassName = this.state.validationError ? ' is-error' : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';

    return (
      <div className="contract-variable choice">
        <label className="label">
          <span>{description}</span>

          <select
            {...inputProps}

            className={`${this.props.textLikeInputClass}${cleanName}${additionalClassName}${inputPropsClassName}`}
            onChange={this.onChange}
            value={this.state.currentValue}
          >
            <option value="">&mdash; Please choose from the list &mdash;</option>
            {choiceValues.map(this.choiceValuesOption)}
          </select>
        </label>
      </div>
    );
  }
}
