// @flow

import * as React from 'react';
import Flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

type Props = {
  enableTime: boolean,
  onChange: (string, string) => mixed,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  variable: {},
};

type State = {
  currentValue: string,
  enableTime: boolean,
};

export class DatePicker extends React.Component<Props, State> {
  id: string;
  flatpickr: Flatpickr;

  openLaw = this.props.openLaw;

  state = {
    enableTime: this.props.enableTime,
    currentValue: this.props.savedValue,
  };

  constructor(props: Props) {
    super(props);

    const cleanName = this.openLaw.getCleanName(this.props.variable);
    const timestamp = new Date().getTime().toString();
    this.id = this.id || `date_${cleanName}_${timestamp}`;

    const self: any = this;
    self.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    let options = {};

    options.altInput = true;
    options.onChange = this.onChange;
    options.enableTime = this.state.enableTime;
    options.utc = true;

    if (this.props.savedValue) {
      options.defaultDate = new Date(parseInt(this.props.savedValue));
    }

    this.flatpickr = new Flatpickr(document.getElementById(this.id), options);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.savedValue !== this.props.savedValue) {
      this.setState({
        currentValue: this.props.savedValue,
      });
    }
  }

  get isIOS() {
    return !!window.navigator.platform && /iPad|iPhone|iPod/.test(window.navigator.platform);
  }

  get shouldShowIOSLabel() {
    return this.isIOS && !this.state.currentValue;
  }

  onChange(values: Array<any>) {
    const variable = this.props.variable;
    const name = this.openLaw.getName(variable);
    const epoch = (values.length ? values[0].getTime().toString() : undefined);

    this.props.onChange(name, epoch);
  }

  render() {
    const variable = this.props.variable;
    const description = this.openLaw.getDescription(variable);
    const cleanName = this.openLaw.getCleanName(variable);

    return (
      <div className="contract-variable">
        <label>
          <span>{description}</span>

          <input
            onChange={this.onChange}
            className={cleanName}
            id={this.id}
            placeholder={description}
          />
        </label>

        {this.shouldShowIOSLabel &&
          <span className="ios-label">{description}</span>
        }
      </div>
    );
  }
}
