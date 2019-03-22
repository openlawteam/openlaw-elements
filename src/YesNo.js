// @flow

import * as React from 'react';

type Props = {
  cleanName: string,
  description: string,
  name: string,
  onChange: (string, string, boolean) => mixed,
  savedValue: string,
};

type State = {
  currentValue: string,
};

export class YesNo extends React.PureComponent<Props, State> {
  state = {
    currentValue: this.props.savedValue,
  };

  noRef: {current: null | HTMLInputElement} = React.createRef();
  yesRef: {current: null | HTMLInputElement} = React.createRef();

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    // This solves a timing issue where some uses of OpenLawForm
    // were not replacing the savedValue value on mount.
    // It only happens when using a PureComponent.
    setTimeout(() => this.radioCheckedByRef(), 0);
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
      // uses an added param `force` set to `true`
      // TODO change should be in openlaw app, not here!
      this.props.onChange(name, eventValue, true);
    });
  }

  // visually update the uncontrolled HTML radio, as we already have the value
  radioCheckedByRef() {
    const currentYesRef = this.yesRef.current;
    const currentNoRef = this.noRef.current;
    
    if (currentYesRef && currentNoRef && this.props.savedValue === 'true') {
      currentYesRef.checked = true;
    }
    if (currentNoRef && currentYesRef && this.props.savedValue === 'false') {
      currentNoRef.checked = true;
    }
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
              ref={this.yesRef}
              type="radio"
              value="true"
            />
            <span>Yes</span>
          </label>

          <label>
            <input
              className={cleanName}
              name={cleanName}
              onChange={this.onChange}
              ref={this.noRef}
              type="radio"
              value="false"
            />
            <span>No</span>
          </label>
        </div>
      </div>
    );
  }
}
