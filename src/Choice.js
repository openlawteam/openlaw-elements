// @flow

import * as React from 'react';

type Props = {
  executionResult: {},
  onChange: (string, ?string) => mixed,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  variable: {},
};

type State = {
  currentValue: string,
  validationError: boolean,
};

export class Choice extends React.Component<Props, State> {
  openLaw = this.props.openLaw;

  state = {
    validationError: false,
    currentValue: this.props.savedValue || '',
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
  }

  onChange(event: SyntheticEvent<HTMLOptionElement>) {
    const variable = this.props.variable;
    const eventValue = event.currentTarget.value;

    try {
      if (variable) {
        if (eventValue === '') {
          this.setState({
            validationError: false,
            currentValue: '',
          });
          const name = this.openLaw.getName(variable);

          this.props.onChange(name, undefined);
        } else {
          this.openLaw.checkValidity(
            variable,
            eventValue,
            this.props.executionResult,
          );

          this.setState({
            validationError: false,
            currentValue: eventValue,
          });

          const name = this.openLaw.getName(variable);
          const realValue = eventValue === '' ? undefined : eventValue;

          this.props.onChange(name, realValue);
        }
      } else {
        this.setState({
          validationError: false,
          currentValue: undefined,
        });
        this.props.onChange(this.openLaw.getName(variable), undefined);
      }
    } catch (err) {
      this.setState({
        validationError: true,
        currentValue: eventValue,
      });
    }
  }

  render() {
    const variable = this.props.variable;
    const choices = this.openLaw.getChoiceValues(
      variable,
      this.props.executionResult,
    );
    const cleanName = this.openLaw.getCleanName(variable);
    const additionalClassName = this.state.validationError
      ? ' is-danger-new'
      : '';
    const description = this.openLaw.getDescription(variable);

    const f = choice => (
      <option key={choice} value={choice}>
        {choice}
      </option>
    );

    return (
      <div className="contract_variable">
        <label className="label">{description}</label>
        <select
          value={this.state.currentValue}
          onChange={this.onChange}
          className={`input ${cleanName} ${additionalClassName}`}>

          <option value="">-- Please choose from the list --</option>
          {choices.map(f)}
        </select>
      </div>
    );
  }
}
