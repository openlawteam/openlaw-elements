// @flow

import * as React from 'react';

type Props = {
  apiClient: Object, // opt-out of type checker until Flow types are exported for APIClient
  cleanName: string,
  description: string,
  getValidity: (string, string) => any | false,
  name: string,
  onChange: (string, ?string) => mixed,
  onKeyUp?: (SyntheticKeyboardEvent<HTMLInputElement>, boolean) => mixed,
  openLaw: Object,
  savedValue: string,
  textLikeInputClass: string,
};

type State = {
  email: string,
  validationError: boolean,
};

export class Identity extends React.PureComponent<Props, State> {
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
  }

  componentDidMount() {
    const { getValidity, name, openLaw, savedValue } = this.props;

    try {
      if (this.props.savedValue) {
        const identity = getValidity(name, savedValue);

        this.setState({
          email: openLaw.getIdentityEmail(identity),
        });
      } else {
        this.setState({
          email: '',
        });
      }
    } catch (error) {
      this.setState({
        email: '',
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { getValidity, name, openLaw, savedValue } = this.props;

    if (
      !this.state.validationError
      && (savedValue !== prevProps.savedValue)
    ) {
      try {
        const identity = getValidity(name, savedValue);

        this.setState({
          email: openLaw.getIdentityEmail(identity) || '',
        });
      }
      catch (error) {
        this.setState({
          email: '',
          validationError: true,
        });
      }
    }
  }

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    const eventValue = event.currentTarget.value;
    const { apiClient, name, openLaw } = this.props;

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

        apiClient.getUserDetails(eventValue).then(result => {
          if (result.email) {
            this.props.onChange(
              name,
              openLaw.createIdentityInternalValue(result.id, result.email),
            );

            this.setState({
              email: result.email,
              validationError: false,
            });
          }
        });
      }
    } catch (error) {
      this.isDataValid = false;

      this.setState({
        email: eventValue,
        validationError: true,
      });
    }
  }

  render() {
    const { cleanName, description } = this.props;
    const additionalClassName = this.state.validationError ? ' is-error' : '';

    return (
      <div className="contract-variable identity">
        <label>
          <span>{description}</span>

          <input
            className={`${this.props.textLikeInputClass}${cleanName} ${cleanName}-email${additionalClassName}`}
            onChange={this.onChange}
            onKeyUp={(event) => this.props.onKeyUp ? this.props.onKeyUp(event, this.isDataValid) : undefined}
            placeholder={description}
            title={description}
            type="email"
            value={this.state.email}
          />
        </label>
      </div>
    );
  }
}
