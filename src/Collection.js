// @flow

import * as React from 'react';
const uuidv4 = require('uuid/v4');

import { InputRenderer } from './InputRenderer';
import { Structure } from './Structure';
import { CSS_CLASS_NAMES as css } from './constants';
import { singleSpaceString } from './utils';
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
};

export class Collection extends React.Component<Props, State> {
  focusIndex: number | null = null;
  openLaw = this.props.openLaw;
  uniqueCollectionIds: Array<string> = [];

  state = {
    currentValue: this.props.savedValue,
  };

  constructor(props: Props) {
    super(props);

    const self: any = this;
    self.add = this.add.bind(this);
    self.isCollectionDisabled = this.isCollectionDisabled.bind(this);
    self.onKeyUp = this.onKeyUp.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.savedValue !== this.props.savedValue) {
      this.handleElementFocus(this.focusIndex);
    }
  }

  add() {
    const { executionResult, onChange, savedValue, variable } = this.props;
    const variableName = this.openLaw.getName(variable);
    const newValue = this.openLaw.addElementToCollection(
      variable,
      savedValue,
      executionResult,
    );
    const errorData: FieldErrorType = {
      elementName: this.openLaw.getCleanName(variable),
      elementType: 'Collection',
      eventType: 'change',
      errorMessage: '',
      isError: false,
      value: newValue,
    };

    onChange(
      variableName,
      newValue,
      errorData,
    );

    const size = this.openLaw.getCollectionSize(
      variable,
      newValue,
      executionResult,
    );

    this.focusIndex = size - 1;
  }

  addUniqueCollectionId(id: string): Array<string> {
    this.uniqueCollectionIds = this.uniqueCollectionIds.concat([id]);
    return this.uniqueCollectionIds;
  }

  handleElementFocus(updatedIndex: number | null) {
    if (updatedIndex === null) return;
    
    const index = (updatedIndex >= 0) ? updatedIndex : -1;
    if (index === -1) return;

    const element = document.querySelector(`.${this.openLaw.getCleanName(this.props.variable)}_${index}`);
    if (element) element.focus();

    // reset
    this.focusIndex = null;
  }

  isCollectionDisabled(): boolean {
    const { inputProps } = this.props;
    return (inputProps && inputProps.Collection && inputProps.Collection.disabled)
      ? true
      : (inputProps && inputProps['*'] && inputProps['*'].disabled)
      ? true
      : false;
  }

  onChange: OnChangeFuncType = (key, value, errorData) => {
    const { executionResult, onChange, savedValue, variable } = this.props;
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
      const currentValueUnsetAtIndex = this.openLaw.setElementToCollection(
        undefined,
        index,
        variable,
        savedValue,
        executionResult,
      );
      
      this.setState({
        currentValue: currentValueUnsetAtIndex,
      }, () => {
        onChange(
          variableName,
          this.state.currentValue,
          errorData,
        );
      });
    }
  }

  onKeyUp(event: SyntheticKeyboardEvent<HTMLElement>) {
    // do nothing if the event was already processed
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Enter') {
      this.add();
    }

    event.preventDefault();
  }

  remove(index: number) {
    const { executionResult, onChange, savedValue, variable } = this.props;
    const variableName = this.openLaw.getName(variable);
    const newValue = this.openLaw.removeElementFromCollection(
      index,
      variable,
      executionResult,
      savedValue,
    );
    const errorData: FieldErrorType = {
      elementName: this.openLaw.getCleanName(variable),
      elementType: 'Collection',
      eventType: 'change',
      errorMessage: '',
      isError: false,
      value: newValue,
    };

    // delete client-side unique React key
    this.removeUniqueCollectionId(index);

    onChange(
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

    const assistiveTextRemoveButton =
      `Remove Collection item ${index} for ${this.openLaw.getDescription(subVariable)}`;

    return (
      <div className={css.collectionRow} key={this.uniqueCollectionIds[index]}>
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
              onKeyUp={this.onKeyUp}
              onValidate={this.props.onValidate}
              openLaw={this.openLaw}
              savedValue={savedValue}
              variable={subVariable}
            />
          )
        }
        <button
          aria-hidden="true"
          className={css.collectionButtonRemove}
          disabled={this.isCollectionDisabled()}
          onClick={() => !this.isCollectionDisabled() && this.remove(index)}
          title={assistiveTextRemoveButton}
          type="button">
          <TimesSVG />
          <span>
            {assistiveTextRemoveButton}
          </span>
        </button>
      </div>
    );
  }

  render() {
    const { executionResult, savedValue, variable } = this.props;
    const cleanName = this.openLaw.getCleanName(variable);
    const description = this.openLaw.getDescription(variable);
    const collectionSize = this.openLaw.getCollectionSize(
      variable,
      savedValue,
      executionResult,
    );

    const fields = [];

    for (let index = 0; index < collectionSize; index++) {      
      fields.push(this.renderFields(index));
    }

    return (
      <div className={singleSpaceString(`${css.collection} ${cleanName}`)}>
        <div className={css.collectionDescription}>
          <span>{description}</span>
        </div>

        {fields}

        <button
          className={`${css.button}`}
          disabled={this.isCollectionDisabled()}
          onClick={this.isCollectionDisabled() ? null : this.add}
          onKeyDown={event => {
            if (this.isCollectionDisabled()) return;
            // no collisions with onKeyUp event
            // on input (after focus)
            if (event.key === 'Enter') {
              event.preventDefault();
            }
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              if (this.isCollectionDisabled()) return;
              // no collisions with onKeyUp event
              // on input (after focus)
              event.preventDefault();
              // click the "Add" button
              event.target.click();
            }
          }}
          type="button">
          Add
        </button>
      </div>
    );
  }
}

const TimesSVG = props => (
  <svg
    height="12" width="12"
    
    {...props}

    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512">
    <path
      fill="currentColor"
      d="M323.1 441l53.9-53.9c9.4-9.4 9.4-24.5 0-33.9L279.8 256l97.2-97.2c9.4-9.4 9.4-24.5 0-33.9L323.1 71c-9.4-9.4-24.5-9.4-33.9 0L192 168.2 94.8 71c-9.4-9.4-24.5-9.4-33.9 0L7 124.9c-9.4 9.4-9.4 24.5 0 33.9l97.2 97.2L7 353.2c-9.4 9.4-9.4 24.5 0 33.9L60.9 441c9.4 9.4 24.5 9.4 33.9 0l97.2-97.2 97.2 97.2c9.3 9.3 24.5 9.3 33.9 0z"
    />
  </svg>
);
