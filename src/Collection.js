// @flow

import * as React from 'react';

import { InputRenderer } from './InputRenderer';
import { Structure } from './Structure';

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
  focusIndex: number | null,
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
    self.add = this.add.bind(this);
    self.onChange = this.onChange.bind(this);
    self.onEnter = this.onEnter.bind(this);
  }

  componentDidUpdate() {
    this.handleElementFocus();
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
    const { executionResult } = this.props;

    return (
      <div className="collection-variable-row" key={variableName}>
        {this.openLaw.isStructuredType(subVariable, executionResult)
          ? (
            <Structure
              apiClient={this.props.apiClient} // for API call to Google for geo data (if generating an Address)
              executionResult={executionResult}
              key={`${this.openLaw.getCleanName(subVariable)}-collection`}
              onChange={this.onChange}
              openLaw={this.openLaw}
              savedValue={savedValue}
              textLikeInputClass={this.props.textLikeInputClass}
              variable={subVariable}
            />
          ) : (
            <InputRenderer
              apiClient={this.props.apiClient}
              executionResult={this.props.executionResult}
              onChangeFunction={this.onChange}
              onKeyUp={this.onEnter}
              openLaw={this.openLaw}
              savedValue={savedValue}
              textLikeInputClass={this.props.textLikeInputClass}
              variable={subVariable}
            />
          )
        }
        <div
          className="collection-variable-remove"
          onClick={() => this.remove(index)}
        >
          <TimesSVG />
        </div>
      </div>
    );
  }

  handleElementFocus() {
    if (this.state.focusIndex !== null) {
      const index = (this.state.focusIndex >= 0) ? this.state.focusIndex : -1;

      if (index === -1) return;

      // TODO should replace things like this with a ref
      const element = document.querySelector(`.${this.openLaw.getCleanName(this.props.variable)}_${index}`);

      if (element) element.focus();

      // reset
      this.setState({
        focusIndex: null,
      });
    }
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

  onEnter(event: SyntheticKeyboardEvent<HTMLElement>, isDataValid: ?boolean = true) {
    // do nothing if the event was already processed
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Enter' && isDataValid) {
      this.add();
    }

    event.preventDefault();
  }

  remove(index: number) {
    const { variable } = this.props;
    const variableName = this.openLaw.getName(variable);
    const newValue = this.openLaw.removeElementFromCollection(
      index,
      variable,
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

    for (let index = 0; index < collectionSize; index++) {
      variables.push(
        this.generateInput(
          this.openLaw.createVariableFromCollection(
            variable,
            index,
            this.props.executionResult,
          ),
          index,
        ),
      );
    }

    return (
      <div className={`contract-variable collection-variable ${cleanName}`}>
        <div className="collection-variable-description">{description}</div>

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
