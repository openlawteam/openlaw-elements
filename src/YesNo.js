// @flow

import * as React from 'react';

type Props = {
  onChange: (string, string) => mixed,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  variable: {},
};

type State = {
  currentValue: string,
};

export class YesNo extends React.Component<Props, State> {
  openLaw = this.props.openLaw;

  state = {
    currentValue: this.props.savedValue,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
  }

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    const variable = this.props.variable;
    const name = this.openLaw.getName(variable);
    const eventValue = event.currentTarget.value;

    this.props.onChange(name, eventValue);

    this.setState({
      currentValue: eventValue,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.savedValue !== prevProps.savedValue) {
      this.setState({
        currentValue: this.props.savedValue,
      });
    }
  }

  render() {
    const variable = this.props.variable;
    const description = this.openLaw.getDescription(variable);
    const cleanName = this.openLaw.getCleanName(variable);
    const additionalClass = this.state.currentValue ? 'conditional-set' : '';

    return (
      <div
        className={`contract_variable contract_question ${additionalClass}`}
      >

        <label className="label">{description}</label>

        <div>
          <label className="radio-label">
            <input
              type="radio"
              onChange={this.onChange}
              value="true"
              checked={this.state.currentValue === 'true'}
              className={`radio_yes radio_for_optional_variable radio_for_variable_${cleanName}`}
            />
            Yes
          </label>

          <label className="radio-label">
            <input
              type="radio"
              onChange={this.onChange}
              value="false"
              checked={this.state.currentValue !== 'true'}
              className="radio_no radio_for_optional_variable"
            />
            No
          </label>
        </div>
      </div>
    );
  }
}
