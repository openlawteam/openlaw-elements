// @flow

import * as React from 'react';

type Props = {
  cleanName: string,
  description: string,
  getValidity: (string, string) => any | false,
  name: string,
  onChange: (string, ?string) => mixed,
  onKeyUp?: (SyntheticKeyboardEvent<HTMLInputElement>) => mixed,
  savedValue: string,
  textLikeInputClass: string,
};

type State = {
  currentValue: string,
  validationError: boolean,
};

export class NumberInput extends React.PureComponent<Props, State> {
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
    const { cleanName, description } = this.props;

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
