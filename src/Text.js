// @flow

import * as React from 'react';

import type { InputPropsValueType, ValidityFuncType, ValidateOnKeyUpFuncType } from './types';

type Props = {
  cleanName: string,
  description: string,
  getValidity: ValidityFuncType,
  inputProps: ?InputPropsValueType,
  name: string,
  onChange: (string, ?string) => mixed,
  onKeyUp?: ValidateOnKeyUpFuncType,
  savedValue: string,
  textLikeInputClass: string,
};

type State = {
  currentValue: string,
  validationError: boolean,
};

export class Text extends React.PureComponent<Props, State> {
  isDataValid = true;

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

  componentDidMount() {
    const { getValidity, name, savedValue } = this.props;

    if (savedValue) {
      const { isError } = getValidity(name, savedValue);

      this.setState({
        currentValue: !isError ? savedValue : '',
      });
    }
  }

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    const eventValue = event.currentTarget.value;
    const { getValidity, name } = this.props;

    if (!eventValue) {
      if (this.state.currentValue) {
        this.setState({
          currentValue: '',
          validationError: false,
        }, () => {
          this.isDataValid = true;

          this.props.onChange(name);
        });
      }

      // exit
      return;
    }

    const { isError } = getValidity(name, eventValue);

    this.setState({
      currentValue: eventValue,
      validationError: isError,
    }, () => {
      if (isError) {
        this.isDataValid = false;
      }
      
      if (!isError) {
        this.isDataValid = true;

        this.props.onChange(name, eventValue);
      }
    });
  }

  onKeyUp(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyUp) this.props.onKeyUp(event, this.isDataValid);

    if (this.props.inputProps && this.props.inputProps.onKeyUp) {
      this.props.inputProps.onKeyUp(event);
    }
  }

  render() {
    const { cleanName, description, inputProps } = this.props;
    const additionalClassName = this.state.validationError ? ' is-error' : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';

    return (
      <div className="contract-variable">
        <label>
          <span>{description}</span>

          <input
            placeholder={description}
            title={description}

            {...inputProps}

            className={`${this.props.textLikeInputClass}${cleanName}${additionalClassName}${inputPropsClassName}`}
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            type="text"
            value={this.state.currentValue}
          />
        </label>
      </div>
    );
  }
}
