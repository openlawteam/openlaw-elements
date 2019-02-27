// @flow

import * as React from 'react';

type Props = {
  executionResult: {},
  onChange: (string, ?string) => mixed,
  onKeyUp?: (SyntheticKeyboardEvent<HTMLInputElement>) => mixed,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  textLikeInputClass: string,
  variable: {},
};

type State = {
  currentValue: string,
  validationError: boolean,
};

export class NumberInput extends React.Component<Props, State> {
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
    if (prevProps.savedValue !== this.props.savedValue) {
      this.setState({
        currentValue: this.props.savedValue || '',
      });
    }
  }

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    const variable = this.props.variable;
    const eventValue = event.currentTarget.value;

    try {
      if (eventValue) {
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
      } else {
        this.setState({
          currentValue: '',
          validationError: false,
        }, () => {
          this.props.onChange(this.openLaw.getName(variable));
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
    const cleanName = this.openLaw.getCleanName(variable);
    const description = this.openLaw.getDescription(variable);

    return (
      <div className="contract-variable">
        <label>
          <span>{description}</span>

          <input
            className={`${this.props.textLikeInputClass}${cleanName}`}
            onChange={this.onChange}
            onKeyUp={this.props.onKeyUp}
            placeholder={description}
            type="number"
            value={this.state.currentValue}
          />
        </label>
      </div>
    );
  }
}
