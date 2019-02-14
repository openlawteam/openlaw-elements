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

  componentDidUpdate(prevProps: Props) {
    if (this.props.savedValue !== prevProps.savedValue) {
      this.setState({
        currentValue: this.props.savedValue,
      });
    }
  }

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    const variable = this.props.variable;
    const name = this.openLaw.getName(variable);
    const eventValue = event.currentTarget.value;

    this.setState({
      currentValue: eventValue,
    }, () => {
      this.props.onChange(name, eventValue);
    });
  }

  render() {
    const variable = this.props.variable;
    const description = this.openLaw.getDescription(variable);
    const cleanName = this.openLaw.getCleanName(variable);
    const additionalClass = this.state.currentValue ? ' conditional-set' : '';

    return (
      <div
        className={`contract-variable contract-question${additionalClass}`}
      >
        <label className="label">{description}</label>

        <div>
          <label className="radio-label">
            <input
              type="radio"
              onChange={this.onChange}
              value="true"
              checked={this.state.currentValue === 'true'}
              className={cleanName}
            />
            <span>Yes</span>
          </label>

          <label className="radio-label">
            <input
              type="radio"
              onChange={this.onChange}
              value="false"
              checked={this.state.currentValue !== 'true'}
              className={cleanName}
            />
            <span>No</span>
          </label>
        </div>
      </div>
    );
  }
}
