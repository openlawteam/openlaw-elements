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
            currentValue: '',
            validationError: false,
          }, () => {
            this.props.onChange(this.openLaw.getName(variable), '');
          });
        } else {
          this.openLaw.checkValidity(
            variable,
            eventValue,
            this.props.executionResult,
          );

          this.setState({
            currentValue: eventValue,
            validationError: false,
          }, () => {
            this.props.onChange(this.openLaw.getName(variable), eventValue);
          });
        }
      } else {
        this.setState({
          currentValue: '',
          validationError: false,
        }, () => {
          this.props.onChange(this.openLaw.getName(variable), '');
        });
      }
    } catch (error) {
      this.setState({
        currentValue: eventValue,
        validationError: true,
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
    const additionalClassName = this.state.validationError ? ' is-danger-new' : '';
    const description = this.openLaw.getDescription(variable);

    const f = choice => (
      <option key={choice} value={choice}>
        {choice}
      </option>
    );

    return (
      <div className="contract-variable">
        <label className="label">
          <span>{description}</span>

          <select
            value={this.state.currentValue}
            onChange={this.onChange}
            className={`${cleanName}${additionalClassName}`}
          >
            <option value="">-- Please choose from the list --</option>
            {choices.map(f)}
          </select>
        </label>
      </div>
    );
  }
}
