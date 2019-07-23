// @flow

import * as React from 'react';

import type { ValidityFuncType, ValidateOnKeyUpFuncType } from './types';

type Props = {
  cleanName: string,
  serviceName: string,
  description: string,
  getValidity: ValidityFuncType,
  inputProps: ?{
    className?: string,
    onKeyUp?: (SyntheticKeyboardEvent<HTMLInputElement>) => mixed
  },
  name: string,
  onChange: (string, ?string) => mixed,
  onKeyUp?: ValidateOnKeyUpFuncType,
  openLaw: Object,
  savedValue: string,
  textLikeInputClass: string,
};

type State = {
  email: string,
  serviceName: string,
  validationError: boolean,
};

export class ExternalSignature extends React.PureComponent<Props, State> {
  // currently used as a helper to send the parent's "on[Event]" props
  // e.g. if it wants to be sure to do a Collection addition on enter press
  isDataValid = false;

  state = {
    email: '',
    validationError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
    self.onKeyUp = this.onKeyUp.bind(this);
  }

  componentDidMount() {
    const { getValidity, name, savedValue, serviceName } = this.props;

    if (savedValue) {
      const { isError } = getValidity(name, savedValue);

      this.setState({
        email: !isError ? JSON.parse(savedValue).identity.email : '',
        serviceName: serviceName,
      });
    }
  }

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    const eventValue = event.currentTarget.value;
    const { name, openLaw } = this.props;

    try {
      if (!eventValue) {
        this.setState({
          email: '',
          validationError: false,
        }, () => {
          this.props.onChange(name, undefined);

          this.isDataValid = false;
        });
      } else {
        this.setState({
          email: eventValue,
          validationError: false,
        });

        this.props.onChange(
          name,
          openLaw.createIdentityInternalValue('', eventValue),
        );

        this.isDataValid = true;
      }
    } catch (error) {
      this.isDataValid = false;

      this.setState({
        email: eventValue,
        validationError: true,
      });
    }
  }

  onKeyUp(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event, this.isDataValid);
    }

    if (this.props.inputProps && this.props.inputProps.onKeyUp) {
      this.props.inputProps.onKeyUp(event);
    }
  }

  render() {
    const { cleanName, description, inputProps } = this.props;
    const additionalClassName = this.state.validationError ? ' is-error' : '';
    const inputPropsClassName = (inputProps && inputProps.className) ? ` ${inputProps.className}` : '';
    const signatureServiceDescription = 'Sign with ' + this.state.serviceName;

    return (
      <div className="contract-variable external-signature">
        <label>
          <span>{description}</span>

          <input
            placeholder={description}
            title={description}

            {...inputProps}

            className={`${this.props.textLikeInputClass}${cleanName} ${cleanName}-email${additionalClassName}${inputPropsClassName}`}
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            type="email"
            value={this.state.email}
          />
          : {signatureServiceDescription}
        </label>
      </div>
    );
  }
}
