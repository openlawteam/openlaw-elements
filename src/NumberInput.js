// @flow

import * as React from 'react';

import type { InputPropsValueType, ValidityFuncType } from './types';

type Props = {
  cleanName: string,
  description: string,
  getValidity: ValidityFuncType,
  inputProps: ?InputPropsValueType,
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
    self.onKeyUp = this.onKeyUp.bind(this);
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

    const { isError } = getValidity(name, eventValue);

    this.setState({
      currentValue: eventValue,
      validationError: isError,
    }, () => {
      if (!isError) this.props.onChange(name, eventValue);
    });
  }

  onKeyUp(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyUp) this.props.onKeyUp(event);

    if (this.props.inputProps && this.props.inputProps.onKeyUp) {
      this.props.inputProps.onKeyUp(event);
    }
  }

  render() {
    const { cleanName, description, inputProps } = this.props;
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';

    return (
      <div className="contract-variable">
        <label>
          <span>{description}</span>

          <input
            placeholder={description}

            {...inputProps}

            className={`${this.props.textLikeInputClass}${cleanName}${inputPropsClassName}`}
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            type="number"
            value={this.state.currentValue}
          />
        </label>
      </div>
    );
  }
}
