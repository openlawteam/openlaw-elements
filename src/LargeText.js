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
};

export class LargeText extends React.PureComponent<Props, State> {
  state = {
    currentValue: this.props.savedValue || '',
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
  }

  onChange(event: SyntheticEvent<*>) {
    const eventValue = event.currentTarget.value;
    const { name } = this.props;

    this.setState({
      currentValue: eventValue,
    }, () => {
      this.props.onChange(name, eventValue || undefined);
    });
  }

  render() {
    const { cleanName, description } = this.props;

    return (
      <div className="contract-variable">
        <label>
          <span>{description}</span>

          <textarea
            className={`${this.props.textLikeInputClass}${cleanName}`}
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
