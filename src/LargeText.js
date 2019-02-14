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

export class LargeText extends React.Component<Props, State> {
  openLaw = this.props.openLaw;

  state = {
    currentValue: this.props.savedValue || '',
    validationError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !this.state.validationError &&
      prevProps.savedValue !== this.props.savedValue
    ) {
      this.setState({
        currentValue: this.props.savedValue || '',
      });
    }
  }

  onChange(event: SyntheticEvent<*>) {
    const variable = this.props.variable;
    const eventValue = event.currentTarget.value;

    try {
      const name = this.openLaw.getName(variable);

      if (eventValue) {
        this.openLaw.checkValidity(variable, eventValue, this.props.executionResult);

        this.setState({
          validationError: false,
          currentValue: eventValue,
        }, () => {
          this.props.onChange(name, eventValue);
        });
      } else {
        if (this.state.currentValue) {
          this.setState({
            validationError: false,
            currentValue: '',
          }, () => {
            this.props.onChange(name);
          });
        }
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
    const cleanName = this.openLaw.getCleanName(variable);
    const description = this.openLaw.getDescription(variable);
    const additionalClassName = this.state.validationError ? ' is-error' : '';

    return (
      <div className="contract-variable">
        <label>
          <span>{description}</span>

          <textarea
            className={`${cleanName}${additionalClassName}`}
            onChange={this.onChange}
            placeholder={description}
            title={description}
            type="text"
            value={this.state.currentValue}
          />
        </label>
      </div>
    );
  }
}
