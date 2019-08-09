// @flow

import * as React from 'react';
const uuidv4 = require('uuid/v4');

import { InputRenderer } from './InputRenderer';
import { Structure } from './Structure';
import { FieldError } from './FieldError';
import { BLUR_EVENT_ENUM, CSS_CLASS_NAMES as css } from './constants';
import { onBlurValidation, onChangeValidation } from './validation';
import type {
  FieldErrorType,
  FieldPropsType,
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
  errorMessage: string,
  focusIndex: number | null,
  shouldShowError: boolean,
};

export class Collection extends React.Component<Props, State> {
  openLaw = this.props.openLaw;
  uniqueCollectionIds: Array<string> = [];

  state = {
    currentValue: this.props.savedValue,
    errorMessage: '',
    focusIndex: null,
    shouldShowError: false,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.add = this.add.bind(this);
    self.onEnter = this.onEnter.bind(this);
    self.onValidate = this.onValidate.bind(this);
  }

  componentDidUpdate() {
    this.handleElementFocus();
  }

  add() {
    const { executionResult, savedValue, variable } = this.props;
    const variableName = this.openLaw.getName(variable);
    const newValue = this.openLaw.addElementToCollection(
      variable,
      savedValue,
      executionResult,
    );

    const { errorData } = onChangeValidation(
      newValue,
      this.getValidationProps(),
      this.state,
    );

    this.props.onChange(
      variableName,
      newValue,
      errorData,
    );

    const size = this.openLaw.getCollectionSize(
      variable,
      newValue,
      executionResult,
    );

    this.setState({
      focusIndex: size - 1,
    });
  }

  addUniqueCollectionId(id: string): Array<string> {
    this.uniqueCollectionIds = this.uniqueCollectionIds.concat([id]);
    return this.uniqueCollectionIds;
  }

  getValidationProps() {
    const { executionResult, onValidate, variable } = this.props;

    return {
      cleanName: this.openLaw.getCleanName(variable),
      getValidity: (name: string, value: string) => (
        this.openLaw.checkValidity(variable, value, executionResult)
      ),
      name: this.openLaw.getName(variable),
      onValidate,
      variableType: this.openLaw.getType(variable),
    };
  }

  handleElementFocus() {
    if (this.state.focusIndex !== null) {
      const index = (this.state.focusIndex >= 0) ? this.state.focusIndex : -1;

      if (index === -1) return;

      const element = document.querySelector(`.${this.openLaw.getCleanName(this.props.variable)}_${index}`);

      if (element) element.focus();

      // reset
      this.setState({
        focusIndex: null,
      });
    }
  }

  onChange: OnChangeFuncType = (key, value) => {
    const { executionResult, savedValue, variable } = this.props;
    const variableName = this.openLaw.getName(variable);
    const index = parseInt(key.replace(`${variableName}_`, ''));

    try {
      const currentValue = this.openLaw.setElementToCollection(
        value,
        index,
        variable,
        savedValue,
        executionResult,
      );

      const { errorData, shouldShowError } = onChangeValidation(
        currentValue,
        this.getValidationProps(),
        this.state,
      );

      this.setState({
        currentValue,
        errorMessage: errorData.errorMessage,
        shouldShowError,
      }, () => {
        this.props.onChange(
          variableName,
          currentValue,
          errorData,
        );
      });
    } catch (error) {
      // const currentValue = this.openLaw.setElementToCollection(
      //   undefined,
      //   index,
      //   variable,
      //   savedValue,
      //   executionResult,
      // );

      // const { errorData, shouldShowError } = onChangeValidation(
      //   currentValue,
      //   this.getValidationProps(),
      //   this.state,
      // );
      
      // this.setState({
      //   currentValue,
      //   errorMessage: errorData.errorMessage,
      //   shouldShowError,
      // }, () => {
      //   this.props.onChange(
      //     variableName,
      //     currentValue,
      //     errorData,
      //   );
      // });
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

  onValidate(errorData: FieldErrorType) {
    const returnedValidationData = this.props.onValidate && this.props.onValidate(errorData);

    // For Collections, tap into the `eventType` from `onValidate`, called from within a field.
    // This helps us by not needing an onBlur method to pass down to Collection-ready elements.
    if (errorData.elementType !== 'Collection' && errorData.eventType === BLUR_EVENT_ENUM) {      
      const { errorData:error, shouldShowError } = onBlurValidation(
        this.state.currentValue,
        this.getValidationProps(),
        this.state,
      );

      this.setState({
        errorMessage: error.errorMessage,
        shouldShowError,
      });
    }

    return returnedValidationData;
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

    const { errorData } = onChangeValidation(
      newValue,
      this.getValidationProps(),
      this.state,
    );

    // delete client-side unique React key
    this.removeUniqueCollectionId(index);

    this.props.onChange(
      variableName,
      newValue,
      errorData,
    );
  }

  removeUniqueCollectionId(removedIndex: number): Array<string> {
    this.uniqueCollectionIds = this.uniqueCollectionIds.filter((item, index) => {
      if (index !== removedIndex) return item;
    });

    return this.uniqueCollectionIds;
  }

  renderFields(index: number) {
    const subVariable = this.openLaw.createVariableFromCollection(
      this.props.variable,
      index,
      this.props.executionResult,
    );
    const savedValue: string = this.openLaw.getCollectionElementValue(
      this.props.variable,
      this.props.executionResult,
      this.props.savedValue,
      index,
    );
    const { executionResult, inputProps } = this.props;
    
    // append new client-side unique React key, if none exists
    if (!this.uniqueCollectionIds[index]) this.addUniqueCollectionId(uuidv4());

    return (
      <div className="collection-variable-row" key={this.uniqueCollectionIds[index]}>
        {this.openLaw.isStructuredType(subVariable, executionResult)
          ? (
            <Structure
              apiClient={this.props.apiClient} // for API call to Google for geo data (if generating an Address)
              executionResult={executionResult}
              inputProps={inputProps}
              key={`${this.openLaw.getCleanName(subVariable)}-collection`}
              onChange={this.onChange}
              onValidate={this.props.onValidate}
              openLaw={this.openLaw}
              savedValue={savedValue}
              variable={subVariable}
            />
          ) : (
            <InputRenderer
              apiClient={this.props.apiClient}
              executionResult={this.props.executionResult}
              inputProps={inputProps}
              onChangeFunction={this.onChange}
              onKeyUp={this.onEnter}
              onValidate={this.onValidate}
              openLaw={this.openLaw}
              savedValue={savedValue}
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

  render() {
    const { variable } = this.props;
    const { errorMessage, shouldShowError } = this.state;
    const cleanName = this.openLaw.getCleanName(variable);
    const description = this.openLaw.getDescription(variable);
    const collectionSize = this.openLaw.getCollectionSize(
      variable,
      this.props.savedValue,
      this.props.executionResult,
    );

    const variables = [];

    for (let index = 0; index < collectionSize; index++) {      
      variables.push(this.renderFields(index));
    }

    return (
      <div className={`contract-variable collection-variable ${cleanName}`}>
        <div className="collection-variable-description">{description}</div>

        {variables}

        <button className={`${css.button}`} onClick={this.add}>
          Add
        </button>

        <FieldError
          cleanName={cleanName}
          errorMessage={errorMessage}
          shouldShowError={shouldShowError}
        />
      </div>
    );
  }
}

const TimesSVG = (props) => (
  <svg
    height="12" width="12" {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512">
    <path
      fill="currentColor"
      d="M323.1 441l53.9-53.9c9.4-9.4 9.4-24.5 0-33.9L279.8 256l97.2-97.2c9.4-9.4 9.4-24.5 0-33.9L323.1 71c-9.4-9.4-24.5-9.4-33.9 0L192 168.2 94.8 71c-9.4-9.4-24.5-9.4-33.9 0L7 124.9c-9.4 9.4-9.4 24.5 0 33.9l97.2 97.2L7 353.2c-9.4 9.4-9.4 24.5 0 33.9L60.9 441c9.4 9.4 24.5 9.4 33.9 0l97.2-97.2 97.2 97.2c9.3 9.3 24.5 9.3 33.9 0z"
    />
  </svg>
);
