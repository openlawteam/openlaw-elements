// @flow

import * as React from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

type Props = {
  enableTime: boolean,
  onChange: (string, ?string) => mixed,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  textLikeInputClass: string,
  variable: {},
};

type State = {
  enableTime: boolean,
};

export class DatePicker extends React.Component<Props, State> {
  id: string;
  flatpickr: flatpickr;

  openLaw = this.props.openLaw;

  state = {
    enableTime: this.props.enableTime,
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

    // display in a friendly format (e.g. January, 1, 1971)
    options.altInput = true;
    options.dateFormat = 'Z';
    // allow time selection 00:00, AM/PM
    options.enableTime = this.state.enableTime;
    options.onChange = this.onChange;

    if (this.props.textLikeInputClass) {
      // Flatpickr inherits our classnames from the original input element
      options.altInputClass = `${this.props.textLikeInputClass} ${this.openLaw.getCleanName(this.props.variable)}`;
    }

    if (this.props.savedValue) {
      options.defaultDate = new Date(parseInt(this.props.savedValue));
    }

    this.flatpickr = flatpickr(document.getElementById(this.id), options);
  }

  componentWillUnmount() {
    this.flatpickr.destroy();
  }

  get isIOS() {
    return !!window.navigator.platform && /iPad|iPhone|iPod/.test(window.navigator.platform);
  }

  get shouldShowIOSLabel() {
    return this.isIOS && !this.props.savedValue;
  }

  onChange(selectedDates: Array<any>) {
    const variable = this.props.variable;
    const name = this.openLaw.getName(variable);
    const epochUTCString = (selectedDates.length ? selectedDates[0].getTime().toString() : undefined);

    this.props.onChange(name, epochUTCString);
  }

  render() {
    const variable = this.props.variable;
    const description = this.openLaw.getDescription(variable);

    return (
      <div className="contract-variable">
        <label>
          <span>{description}</span>

          {/* flatpickr-enabled input; */}
          {/* options are handled in the constructor */}
          <input
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
