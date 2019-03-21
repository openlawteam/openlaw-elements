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
import { cacheValue } from './utils';

type RendererProps = {
  apiClient: Object, // opt-out of type checker until we export its Flow types
  executionResult: {},
  onChangeFunction: (string, ?string, ?boolean) => mixed,
  onKeyUp?: (SyntheticKeyboardEvent<HTMLInputElement>) => mixed,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  textLikeInputClass: string,
  variable: {},
};

// keep React rendering happy with the same Array reference, if not changed.
const getChoiceValuesCached = cacheValue(deepEqual);
const variableCache = {};
let executionResultCached;
let openLawCached;

const attemptCheckValidity = (name: string, value: string) => {
  try {
    return openLawCached.checkValidity(variableCache[name], value, executionResultCached);
  } catch (error) {
    return false;
  }
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
    onChangeFunction,
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

  // store latest executionResult for access outside React
  executionResultCached = executionResult;
  // store openLaw for access outside React
  if (!openLawCached) openLawCached = openLaw;
  // store { [name]: variable } for access outside React
  variableCache[name] = variable;

  // Choice type detection is different
  if (openLaw.isChoiceType(variable, executionResult)) {
    const choiceValues = getChoiceValuesCached(openLaw.getChoiceValues(variable, executionResult));

    return (
      <Choice
        choiceValues={choiceValues}
        cleanName={cleanName}
        description={description}
        getValidity={attemptCheckValidity}
        name={name}
        onChange={onChangeFunction}
        savedValue={savedValue}
        textLikeInputClass={textLikeInputClass}
      />
    );
  }

  switch (openLaw.getType(variable)) {
    case 'Address':
      return (
        <Address
          apiClient={apiClient} // for API call to Google for geo data
          cleanName={cleanName}
          description={description}
          name={name}
          onChange={onChangeFunction}
          onKeyUp={onKeyUp}
          openLaw={openLaw}
          savedValue={
            savedValue
              ? openLaw.getFormattedAddress(openLaw.getAddress(savedValue))
              : ''
          }
          textLikeInputClass={textLikeInputClass}
        />
      );

    case 'Date':
      return (
        <DatePicker
          cleanName={cleanName}
          description={description}
          enableTime={false}
          name={name}
          onChange={onChangeFunction}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
        />
      );

    case 'DateTime':
      return (
        <DatePicker
          cleanName={cleanName}
          description={description}
          enableTime
          name={name}
          onChange={onChangeFunction}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
        />
      );

    case 'Identity':
      return (
        <Identity
          apiClient={apiClient}
          cleanName={cleanName}
          description={description}
          getValidity={attemptCheckValidity}
          name={name}
          onChange={onChangeFunction}
          onKeyUp={onKeyUp}
          openLaw={openLaw}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
        />
      );

    case 'Image':
      return (
        <ImageInput
          cleanName={cleanName}
          description={description}
          getValidity={attemptCheckValidity}
          name={name}
          onChange={onChangeFunction}
          savedValue={savedValue}
        />
      );

    case 'LargeText':
      return (
        <LargeText
          cleanName={cleanName}
          description={description}
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
          getValidity={attemptCheckValidity}
          name={name}
          onChange={onChangeFunction}
          onKeyUp={onKeyUp}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
        />
      );

    case 'YesNo':
      return (
        <YesNo
          cleanName={cleanName}
          description={description}
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
          getValidity={attemptCheckValidity}
          name={name}
          onChange={onChangeFunction}
          onKeyUp={onKeyUp}
          savedValue={savedValue}
          textLikeInputClass={textLikeInputClass}
        />
      );
  }
};
