// @flow

import * as React from 'react';

import { InputRenderer } from './InputRenderer';

type Props = {
  apiClient: Object, // opt-out of type checker until we export its Flow types
  executionResult: {},
  onChange: (string, ?string) => mixed,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  textLikeInputClass: string,
  variable: {},
};

type State = {
  currentValue: string,
  validationError: boolean,
  errorMsg: string,
};

export class Structure extends React.Component<Props, State> {
  openLaw = this.props.openLaw;

  state = {
    currentValue: this.props.savedValue,
    errorMsg: '',
    needsFocus: undefined,
    validationError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
  }

  generateInput(subVariable: Object) {
    const savedValueProp = this.props.savedValue === '' ? undefined : this.props.savedValue;
    const structureFieldValue = this.openLaw.getStructureFieldValue(
      this.props.variable,
      subVariable,
      savedValueProp,
      this.props.executionResult,
    );

    return (
      <div className="structure-variable-row" key={this.openLaw.getName(subVariable)}>
        <InputRenderer
          apiClient={this.props.apiClient}
          executionResult={this.props.executionResult}
          onChangeFunction={this.onChange}
          openLaw={this.openLaw}
          savedValue={structureFieldValue || ''}
          textLikeInputClass={this.props.textLikeInputClass}
          variable={subVariable}
        />
      </div>
    );
  }

  onChange(key: string, value: ?string) {
    const variable = this.props.variable;
    const variableName = this.openLaw.getName(variable);

    try {
      if (variable) {
        const { savedValue } = this.props;

        const currentValue = this.openLaw.setStructureFieldValue(
          variable,
          key,
          value,
          (savedValue || undefined),
          this.props.executionResult,
        );
        this.setState({
          currentValue,
          validationError: false,
        }, () => {
          this.props.onChange(variableName, currentValue);
        });
      } else {
        this.setState({
          currentValue: '',
          validationError: false,
        }, () => {
          this.props.onChange(this.openLaw.getName(variable));
        });
      }
    } catch (error) {
      this.setState({
        validationError: true,
      });
    }
  }

  render() {
    const variable = this.props.variable;
    const cleanName = this.openLaw.getCleanName(variable);

    const fields = this.openLaw.getStructureFieldDefinitions(
      variable,
      this.props.executionResult,
    ).map(field => this.generateInput(field));

    return (
      <div className={`contract-variable structure-variable ${cleanName}`}>
        {fields}
      </div>
    );
  }
}
