// @flow

import * as React from 'react';

type Props = {
  cleanName: string,
  description: string,
  name: string,
  onChange: (string, string) => mixed,
  savedValue: string,
};

type State = {
  currentValue: string,
};

export class YesNo extends React.PureComponent<Props, State> {
  state = {
    currentValue: this.props.savedValue,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.savedValue !== this.props.savedValue) {
      this.setState({
        currentValue: this.props.savedValue,
      });
    }
  }

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    const eventValue = event.currentTarget.value;
    const { name } = this.props;

    this.setState({
      currentValue: eventValue,
    }, () => {
      this.props.onChange(name, eventValue);
    });
  }

  render() {
    const { cleanName, description } = this.props;
    const additionalClass = this.state.currentValue ? ' conditional-set' : '';

    return (
      <div
        className={`contract-variable contract-question${additionalClass}`}
      >
        <label className="label">{description}</label>

        <div>
          <label>
            <input
              className={cleanName}
              onChange={this.onChange}
              name={cleanName}
              type="radio"
              value="true"
              checked={this.state.currentValue === 'true'}
            />
            <span>Yes</span>
          </label>

          <label>
            <input
              className={cleanName}
              name={cleanName}
              onChange={this.onChange}
              type="radio"
              value="false"
              checked={this.state.currentValue === 'false'}
            />
            <span>No</span>
          </label>
        </div>
      </div>
    );
  }
}
