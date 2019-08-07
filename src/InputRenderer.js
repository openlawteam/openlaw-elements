// @flow

import * as React from 'react';
import deepEqual from 'deep-equal';

import { Address } from './Address';
import { Choice } from './Choice';
import { Identity } from './Identity';
import { DatePicker } from './DatePicker';
import { ImageInput } from './ImageInput';
import { LargeText } from './LargeText';
import { NumberInput } from './NumberInput';
import { Text } from './Text';
import { YesNo } from './YesNo';
import { ExternalSignature } from './ExternalSignature';
import { ELEMENT_TYPES } from './constants';
import { cacheValue } from './utils';
import type {
  FieldEnumType,
  FieldPropsType,
  OnChangeFuncType,
  OnValidateFuncType,
  ValidateOnKeyUpFuncType,
  ValidityErrorObjectType,
} from './flowTypes';

type RendererProps = {
  apiClient: Object, // opt-out of type checker until we export its Flow types
  executionResult: {},
  inputProps?: FieldPropsType,
  onKeyUp?: ValidateOnKeyUpFuncType,
  onChangeFunction: OnChangeFuncType,
  onValidate: ?OnValidateFuncType,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  textLikeInputClass: string,
  variable: {},
};

// keep React rendering happy with the same Array reference, if not changed.
const getChoiceValuesCached = cacheValue(deepEqual);
// keep React rendering happy with the same Object reference, if not changed.
const getInputPropsCached = cacheValue(deepEqual);
const variableCache = {};
let executionResultCurrent;
let openLawCached;

const getValidity = (name: string, value: string): ValidityErrorObjectType => {
  return openLawCached.checkValidity(variableCache[name], value, executionResultCurrent);
};

const getVariableData = (variable: {}, openLaw: Object) => ({
  cleanName: openLaw.getCleanName(variable),
  description: openLaw.getDescription(variable),
  name: openLaw.getName(variable),
});

export const InputRenderer = (props: RendererProps) => {
  const {
    apiClient,
    executionResult,
    inputProps,
    onChangeFunction,
    onValidate,
    onKeyUp,
    openLaw,
    savedValue,
    textLikeInputClass,
    variable,
  } = props;
  
  const {
    cleanName,
    description,
    name,
  } = getVariableData(variable, openLaw);

  const variableType: FieldEnumType = openLaw.getType(variable);

  // store latest executionResult for access outside React
  executionResultCurrent = executionResult;
  // store openLaw for access outside React
  if (!openLawCached) openLawCached = openLaw;
  // store { [name]: variable } for access outside React
  variableCache[name] = variable;

  // merge "all" `inputProps` ("*") with a specific type's props (e.g. "Address")
  const inputPropsMerged = inputProps && (
    ELEMENT_TYPES.reduce((result, key) => {
      return { ...result, [key]: { ...inputProps['*'], ...inputProps[key] } };
    }, {})
  );
  // cache the inputProps
  const inputPropsCached = getInputPropsCached(inputPropsMerged);

  // Choice type detection is different
  if (openLaw.isChoiceType(variable, executionResult)) {
    const choiceValues = getChoiceValuesCached(openLaw.getChoiceValues(variable, executionResult));

    return (
      <Choice
        choiceValues={choiceValues}
        cleanName={cleanName}
        description={description}
        getValidity={getValidity}
        inputProps={inputPropsCached && inputPropsCached.Choice}
        name={name}
        onChange={onChangeFunction}
        onValidate={onValidate}
        savedValue={savedValue}
        variableType="Choice"
      />
    );
  }

  switch (variableType) {
    case 'Address':
      return (
        <Address
          apiClient={apiClient} // for API call to Google for geo data
          cleanName={cleanName}
          description={description}
          inputProps={inputPropsCached && inputPropsCached.Address}
          name={name}
          onChange={onChangeFunction}
          onKeyUp={onKeyUp}
          onValidate={onValidate}
          openLaw={openLaw}
          savedValue={
            savedValue
              ? openLaw.getFormattedAddress(openLaw.getAddress(savedValue))
              : ''
          }
          textLikeInputClass={textLikeInputClass}
          variableType={variableType}
        />
      );

    case 'Date':
      return (
        <DatePicker
          cleanName={cleanName}
          description={description}
          enableTime={false}
          getValidity={getValidity}
          inputProps={inputPropsCached && inputPropsCached.Date}
          name={name}
          onChange={onChangeFunction}
          onValidate={onValidate}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
          variableType={variableType}
        />
      );

    case 'DateTime':
      return (
        <DatePicker
          cleanName={cleanName}
          description={description}
          getValidity={getValidity}
          inputProps={inputPropsCached && inputPropsCached.DateTime}
          name={name}
          onChange={onChangeFunction}
          onValidate={onValidate}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
          variableType={variableType}
        />
      );

    case 'Identity':
      return (
        <Identity
          cleanName={cleanName}
          description={description}
          getValidity={getValidity}
          inputProps={inputPropsCached && inputPropsCached.Identity}
          name={name}
          onChange={onChangeFunction}
          onKeyUp={onKeyUp}
          onValidate={onValidate}
          openLaw={openLaw}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
          variableType={variableType}
        />
      );

    case 'EthAddress':
      return (
        <Text
          cleanName={cleanName}
          description={description}
          getValidity={getValidity}
          inputProps={inputPropsCached && inputPropsCached.EthAddress}
          name={name}
          onChange={onChangeFunction}
          onKeyUp={onKeyUp}
          onValidate={onValidate}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
          variableType={variableType}
        />
      );

    case 'ExternalSignature':
      return (
        <ExternalSignature
          cleanName={cleanName}
          description={description}
          getValidity={getValidity}
          inputProps={inputPropsCached && inputPropsCached.ExternalSignature}
          name={name}
          onChange={onChangeFunction}
          onKeyUp={onKeyUp}
          onValidate={onValidate}
          openLaw={openLaw}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
          variableType={variableType}
        />
      );

    case 'Image':
      return (
        <ImageInput
          cleanName={cleanName}
          description={description}
          getValidity={getValidity}
          inputProps={inputPropsCached && inputPropsCached.Image}
          name={name}
          onChange={onChangeFunction}
          onValidate={onValidate}
          savedValue={savedValue}
          variableType={variableType}
        />
      );

    case 'LargeText':
      return (
        <LargeText
          cleanName={cleanName}
          description={description}
          inputProps={inputPropsCached && inputPropsCached.LargeText}
          name={name}
          onChange={onChangeFunction}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
        />
      );

    case 'Number':
      return (
        <NumberInput
          cleanName={cleanName}
          description={description}
          getValidity={getValidity}
          inputProps={inputPropsCached && inputPropsCached.Number}
          name={name}
          onChange={onChangeFunction}
          onKeyUp={onKeyUp}
          onValidate={onValidate}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
          variableType={variableType}
        />
      );

    case 'Period':
      return (
        <Text
          cleanName={cleanName}
          description={description}
          getValidity={getValidity}
          inputProps={inputPropsCached && inputPropsCached.Period}
          name={name}
          onChange={onChangeFunction}
          onKeyUp={onKeyUp}
          onValidate={onValidate}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
          variableType={variableType}
        />
      );

    case 'YesNo':
      return (
        <YesNo
          cleanName={cleanName}
          description={description}
          inputProps={inputPropsCached && inputPropsCached.YesNo}
          name={name}
          onChange={onChangeFunction}
          savedValue={savedValue}
        />
      );

    default:
      return (
        <Text
          cleanName={cleanName}
          description={description}
          getValidity={getValidity}
          inputProps={inputPropsCached && inputPropsCached.Text}
          name={name}
          onChange={onChangeFunction}
          onKeyUp={onKeyUp}
          onValidate={onValidate}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
          variableType={variableType}
        />
      );
  }
};
