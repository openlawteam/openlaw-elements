// @flow

import * as React from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

import type { InputPropsValueType } from './types';

type Props = {
  cleanName: string,
  description: string,
  enableTime: boolean,
  inputProps: ?InputPropsValueType,
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
    self.onFlatpickrClose = this.onFlatpickrClose.bind(this);
    self.getFlatpickrOptions = this.getFlatpickrOptions.bind(this);
  }

  componentDidMount() {
    // start new Flatpickr instance
    flatpickr(this.flatpickrRef.current, this.getFlatpickrOptions());
  }

  componentDidUpdate() {
    // Pick up new props by re-instantiating Flatpickr after ref has updated.
    // The visible flatpickr `input` (via React <input />) will not
    // update its props after instantiation. Using `react-flatpickr doesn't really help, either.
    setTimeout(() => flatpickr([this.flatpickrRef.current], this.getFlatpickrOptions()), 0);
  }

  getFlatpickrOptions() {
    const { cleanName, textLikeInputClass, savedValue } = this.props;

    return {
      // display in a friendly format (e.g. January, 1, 1971)
      altInput: true,
      altInputClass: `${textLikeInputClass || ''} ${cleanName}`,
      dateFormat: 'Z',
      defaultDate: savedValue ? new Date(parseInt(savedValue)) : '',
      // allow time selection 00:00, AM/PM
      enableTime: this.state.enableTime,
      onClose: this.onFlatpickrClose,
    };
  }
  
  onFlatpickrClose(selectedDates: Array<Date>) {
    const { name } = this.props;
    const epochUTCString = (selectedDates.length ? selectedDates[0].getTime().toString() : undefined);

    this.props.onChange(name, epochUTCString);
  }

  shouldShowIOSLabel() {
    const isIOS = !!window.navigator.platform && /iPad|iPhone|iPod/.test(window.navigator.platform);
    return isIOS && !this.props.savedValue;
  }

  render() {
    const { description, inputProps } = this.props;

    return (
      <div className="contract-variable">
        <label>
          <span>{description}</span>

          {/* flatpickr-enabled input */}
          {/* options are handled in this.getFlatpickrOptions */}
          <input
            placeholder={description}
            
            {...inputProps}

            id={this.id}
            ref={this.flatpickrRef}
          />
        </label>

        {this.shouldShowIOSLabel() &&
          <span className="ios-label">{description}</span>
        }
      </div>
    );
  }
}
