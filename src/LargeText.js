// @flow

import * as React from 'react';

type Props = {
  cleanName: string,
  description: string,
  name: string,
  onChange: (string, ?string) => mixed,
  savedValue: string,
  textLikeInputClass: string,
};

type State = {
  currentValue: string,
  validationError: boolean,
};

export class LargeText extends React.PureComponent<Props, State> {
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
    const eventValue = event.currentTarget.value;
    const { name } = this.props;

    if (eventValue) {
      this.setState({
        currentValue: eventValue,
        validationError: false,
      }, () => {
        this.props.onChange(name, eventValue);
      });
    } else {
      if (this.state.currentValue) {
        this.setState({
          currentValue: '',
          validationError: false,
        }, () => {
          this.props.onChange(name);
        });
      }
    }
  }

  render() {
    const { cleanName, description } = this.props;
    const additionalClassName = this.state.validationError ? ' is-error' : '';

    return (
      <div className="contract-variable">
        <label>
          <span>{description}</span>

          <textarea
            className={`${this.props.textLikeInputClass}${cleanName}${additionalClassName}`}
            onChange={this.onChange}
            placeholder={description}
            title={description}
            value={this.state.currentValue}
          />
        </label>
      </div>
    );
  }
}
