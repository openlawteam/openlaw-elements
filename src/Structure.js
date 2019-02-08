// @flow

import * as React from 'react';

import {InputRenderer} from './InputRenderer';

type Props = {
  apiClient: Object, // opt-out of type checker until we export its Flow types
  executionResult: {},
  onChange: (string, ?string) => mixed,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  variable: {},
};

type State = {
  currentValue: string,
  validationError: boolean,
  focusIndex: ?number,
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
    const currentValue = this.props.savedValue === '' ? undefined : this.props.savedValue;
    const savedValue: string = this.openLaw.getStructureFieldValue(
      this.props.variable,
      subVariable,
      currentValue,
      this.props.executionResult,
    );

    return (
      <div className="structure_variable_row" key={this.openLaw.getName(subVariable)}>
        <InputRenderer
          apiClient={this.props.apiClient}
          executionResult={this.props.executionResult}
          onChangeFunction={this.onChange}
          openLaw={this.openLaw}
          savedValue={savedValue}
          variable={subVariable}
        />
      </div>
    );
  }

  onChange(key: string, value: string) {
    const variable = this.props.variable;
    const variableName = this.openLaw.getName(variable);

    try {
      if (variable) {
        const savedValue = this.props.savedValue === '' ? undefined : this.props.savedValue;

        const currentValue = this.openLaw.setStructureFieldValue(
          variable,
          key,
          value,
          savedValue,
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
          currentValue: undefined,
          validationError: false,
        }, () => {
          this.props.onChange(this.openLaw.getName(variable), undefined);
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
      <div className={`contract_variable structure_variable ${cleanName}`}>
        {fields}
      </div>
    );
  }
}