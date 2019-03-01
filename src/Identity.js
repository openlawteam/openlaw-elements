// @flow

import * as React from 'react';

type Props = {
  apiClient: Object, // opt-out of type checker until Flow types are exported for APIClient
  executionResult: {},
  onChange: (string, ?string) => mixed,
  onKeyUp?: (SyntheticKeyboardEvent<HTMLInputElement>, boolean) => mixed,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  textLikeInputClass: string,
  variable: {},
};

type State = {
  email: string,
  validationError: boolean,
};

export class Identity extends React.Component<Props, State> {
  openLaw = this.props.openLaw;

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
    try {
      if (this.props.savedValue) {
        const identity = this.openLaw.checkValidity(
          this.props.variable,
          this.props.savedValue,
          this.props.executionResult,
        );

        this.setState({
          email: this.openLaw.getIdentityEmail(identity),
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

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    const eventValue = event.currentTarget.value;

    try {
      if (!eventValue) {
        this.setState({
          email: '',
          validationError: false,
        }, () => {
          this.props.onChange(this.openLaw.getName(this.props.variable), undefined);

          this.isDataValid = false;
        });
      } else {
        this.setState({
          email: eventValue,
          validationError: false,
        });

        const variableName = this.openLaw.getName(this.props.variable);

        this.props.onChange(
          variableName,
          this.openLaw.createIdentityInternalValue('', eventValue),
        );

        this.isDataValid = true;

        this.props.apiClient.getUserDetails(eventValue).then(result => {
          if (result.email) {
            this.props.onChange(
              variableName,
              this.openLaw.createIdentityInternalValue(result.id, result.email),
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
    const variable = this.props.variable;
    const cleanName = this.openLaw.getCleanName(variable);
    const description = this.openLaw.getDescription(variable);
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
