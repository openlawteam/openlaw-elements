// @flow

import * as React from 'react';

import {InputRenderer} from './InputRenderer';
import {Structure} from './Structure';

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

export class Collection extends React.Component<Props, State> {
  openLaw = this.props.openLaw;

  state = {
    currentValue: this.props.savedValue,
    errorMsg: '',
    focusIndex: null,
    validationError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.onChange = this.onChange.bind(this);
    self.add = this.add.bind(this);
  }

  componentDidUpdate() {
    if (this.state.focusIndex !== null) {
      const index = this.state.focusIndex || '';
      // TODO should replace things like this with a ref
      const element = document.querySelector(`.${this.openLaw.getName(this.props.variable)}_${index}`);

      if (element) element.focus();

      // reset
      this.setState({
        focusIndex: null,
      });
    }
  }

  add() {
    const variable = this.props.variable;
    const variableName = this.openLaw.getName(variable);
    const newValue = this.openLaw.addElementToCollection(
      variable,
      this.props.savedValue,
      this.props.executionResult,
    );
    const size = this.openLaw.getCollectionSize(
      variable,
      newValue,
      this.props.executionResult,
    );

    this.props.onChange(variableName, newValue);

    this.setState({
      focusIndex: size - 1,
    });
  }

  generateInput(subVariable: Object, index: number) {
    const savedValue: string = this.openLaw.getCollectionElementValue(
      this.props.variable,
      this.props.executionResult,
      this.props.savedValue,
      index,
    );
    const variableName = this.openLaw.getName(subVariable);
    const {executionResult} = this.props;

    return (
      <div className="collection_variable_row" key={variableName}>
        {this.openLaw.isStructuredType(subVariable, executionResult)
          ? (
            <Structure
              apiClient={this.props.apiClient} // for API call to Google for geo data (if generating an Address)
              executionResult={executionResult}
              key={`${this.openLaw.getCleanName(subVariable)}-collection`}
              onChange={this.onChange}
              openLaw={this.openLaw}
              savedValue={savedValue}
              variable={subVariable}
            />
          ) : (
            <InputRenderer
              apiClient={this.props.apiClient}
              executionResult={this.props.executionResult}
              onChangeFunction={this.onChange}
              openLaw={this.openLaw}
              savedValue={savedValue}
              variable={subVariable}
            />
          )
        }{' '}
        <div
          className="collection_variable_remove"
          onClick={() => this.remove(index)}
        >
          <TimesSVG />
        </div>
      </div>
    );
  }

  onChange(key: string, value: ?string) {
    const variable = this.props.variable;
    const variableName = this.openLaw.getName(variable);
    const index = parseInt(key.replace(variableName + '_', ''));

    try {
      if (variable) {
        const currentValue = this.openLaw.setElementToCollection(
          value,
          index,
          variable,
          this.props.savedValue,
          this.props.executionResult,
        );
        this.setState({
          validationError: false,
          currentValue,
        });
        this.props.onChange(variableName, currentValue);
      } else {
        this.setState({
          validationError: false,
          currentValue: undefined,
        });
        this.props.onChange(this.openLaw.getName(variable), undefined);
      }
    } catch (err) {
      this.setState({
        validationError: true,
      });
    }
  }

  remove(index: number) {
    const variable = this.props.variable;
    const variableName = this.openLaw.getName(variable);
    const newValue = this.openLaw.removeElementFromCollection(
      index,
      this.props.variable,
      this.props.executionResult,
      this.props.savedValue,
    );
    this.props.onChange(variableName, newValue);
  }

  render() {
    const variable = this.props.variable;
    const cleanName = this.openLaw.getCleanName(variable);
    const description = this.openLaw.getDescription(variable);

    const collectionSize = this.openLaw.getCollectionSize(
      variable,
      this.props.savedValue,
      this.props.executionResult,
    );

    const variables = [];

    for (let i = 0; i < collectionSize; i++) {
      variables.push(
        this.generateInput(
          this.openLaw.createVariableFromCollection(
            variable,
            i,
            this.props.executionResult,
          ),
          i,
        ),
      );
    }

    return (
      <div className={'contract_variable collection_variable' + cleanName}>
        <div className="collection_variable_description">{description}</div>
        {/* TODO we shouldn't need to use space-occupying divs */}
        <div className="collection_variable_row" />

        {variables}

        {/* TODO this should be a <button /> */}
        <div className="button is-light" onClick={this.add}>
          Add
        </div>
      </div>
    );
  }
}

const TimesSVG = (props) => (
  <svg className="svg-inline--fa fa-w-12" height="12" width="12" {...props} data-icon="times" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
    <path
      fill="currentColor"
      d="M323.1 441l53.9-53.9c9.4-9.4 9.4-24.5 0-33.9L279.8 256l97.2-97.2c9.4-9.4 9.4-24.5 0-33.9L323.1 71c-9.4-9.4-24.5-9.4-33.9 0L192 168.2 94.8 71c-9.4-9.4-24.5-9.4-33.9 0L7 124.9c-9.4 9.4-9.4 24.5 0 33.9l97.2 97.2L7 353.2c-9.4 9.4-9.4 24.5 0 33.9L60.9 441c9.4 9.4 24.5 9.4 33.9 0l97.2-97.2 97.2 97.2c9.3 9.3 24.5 9.3 33.9 0z"
    />
  </svg>
);
