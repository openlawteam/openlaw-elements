// @flow

import * as React from 'react';

import { InputRenderer } from './InputRenderer';
import { CSS_CLASS_NAMES as css } from './constants';
import { singleSpaceString } from './utils';
import type {
  FieldPropsType,
  ObjectAnyType,
  OnChangeFuncType,
  OnValidateFuncType,
} from './flowTypes';

type Props = {
  apiClient: Object, // opt-out of type checker until we export its Flow types
  executionResult: {},
  inputProps?: FieldPropsType,
  onChange: OnChangeFuncType,
  onValidate: ?OnValidateFuncType,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  variable: {},
};

type State = {
  currentValue: string,
};

export class Structure extends React.Component<Props, State> {
  openLaw = this.props.openLaw;

  state = {
    currentValue: this.props.savedValue,
  };

  onChange: OnChangeFuncType = (key, value, errorData) => {
    const { executionResult, onChange, variable } = this.props;
    const variableName = this.openLaw.getName(variable);

    try {
      const { savedValue } = this.props;

      const currentValue = this.openLaw.setStructureFieldValue(
        variable,
        key,
        value,
        (savedValue || undefined),
        executionResult,
      );

      this.setState({
        currentValue,
      }, () => {
        onChange(
          variableName,
          currentValue,
          errorData,
        );
      });
    } catch (error) {
      onChange(
        variableName,
        this.state.currentValue || undefined,
        errorData,
      );
    }
  }

  renderFields(subVariable: ObjectAnyType) {
    const { apiClient, executionResult, inputProps, onValidate, variable } = this.props;
    const savedValueProp = this.props.savedValue === '' ? undefined : this.props.savedValue;
    const structureFieldValue = this.openLaw.getStructureFieldValue(
      variable,
      subVariable,
      savedValueProp,
      executionResult,
    );

    return (
      <div
        className={css.structureRow}
        key={this.openLaw.getName(subVariable)}>
        <InputRenderer
          apiClient={apiClient}
          executionResult={executionResult}
          inputProps={inputProps}
          onChangeFunction={this.onChange}
          onValidate={onValidate}
          openLaw={this.openLaw}
          savedValue={structureFieldValue || ''}
          variable={subVariable}
        />
      </div>
    );
  }

  render() {
    const { executionResult, variable } = this.props;
    const cleanName = this.openLaw.getCleanName(variable);
    const fields = this.openLaw.getStructureFieldDefinitions(
      variable,
      executionResult,
    ).map(field => this.renderFields(field));

    return (
      <div className={singleSpaceString(`${css.structure} ${cleanName}`)}>
        {fields}
      </div>
    );
  }
}
