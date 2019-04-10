// @flow

import * as React from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

type Props = {
  cleanName: string,
  description: string,
  enableTime: boolean,
  name: string,
  onChange: (string, ?string) => mixed,
  savedValue: string,
  textLikeInputClass: string,
};

type State = {
  enableTime: boolean,
};

export class DatePicker extends React.PureComponent<Props, State> {
  id: string;
  flatpickr: flatpickr;
  flatpickrRef: {current: null | HTMLInputElement} = React.createRef(); 

  state = {
    enableTime: this.props.enableTime,
  };

  constructor(props: Props) {
    super(props);

    const { cleanName } = this.props;
    const timestamp = new Date().getTime().toString();
    this.id = `date_${cleanName}_${timestamp}`;

    const self: any = this;
    self.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const { cleanName } = this.props;
    let options = {};

    // display in a friendly format (e.g. January, 1, 1971)
    options.altInput = true;
    options.dateFormat = 'Z';
    // allow time selection 00:00, AM/PM
    options.enableTime = this.state.enableTime;
    options.onChange = this.onChange;

    if (this.props.textLikeInputClass) {
      // Flatpickr inherits our classnames from the original input element
      options.altInputClass = `${this.props.textLikeInputClass} ${cleanName}`;
    }

    if (this.props.savedValue) {
      options.defaultDate = new Date(parseInt(this.props.savedValue));
    }

    this.flatpickr = flatpickr(this.flatpickrRef.current, options);
  }

  get isIOS() {
    return !!window.navigator.platform && /iPad|iPhone|iPod/.test(window.navigator.platform);
  }

  get shouldShowIOSLabel() {
    return this.isIOS && !this.props.savedValue;
  }

  onChange(selectedDates: Array<any>) {
    const { name } = this.props;
    const epochUTCString = (selectedDates.length ? selectedDates[0].getTime().toString() : undefined);

    this.props.onChange(name, epochUTCString);
  }

  render() {
    const { description } = this.props;

    return (
      <div className="contract-variable">
        <label>
          <span>{description}</span>

          {/* flatpickr-enabled input; */}
          {/* options are handled in the constructor */}
          <input
            id={this.id}
            placeholder={description}
            ref={this.flatpickrRef}
          />
        </label>

        {this.shouldShowIOSLabel &&
          <span className="ios-label">{description}</span>
        }
      </div>
    );
  }
}
