// @flow

import React from 'react';

import {Address} from './Address';
import {Choice} from './Choice';
import {Identity} from './Identity';
import {DatePicker} from './DatePicker';
import {ImageInput} from './ImageInput';
import {LargeText} from './LargeText';
import {NumberInput} from './NumberInput';
import {Text} from './Text';
import {YesNo} from './YesNo';

type RendererProps = {
  apiClient: Object, // opt-out of type checker until we export its Flow types
  executionResult: {},
  onChangeFunction: (string, ?string, ?boolean) => mixed,
  openLaw: Object, // opt-out of type checker
  savedValue: string,
  variable: {},
};

export const InputRenderer = (props: RendererProps) => {
  const {
    apiClient,
    executionResult,
    onChangeFunction,
    openLaw,
    savedValue,
    variable,
  } = props;

  const nameWithDashes = openLaw.getCleanName(variable);
  // TODO refactor; `force = true` is specific to the OpenLaw apps
  const onChangeFunctionForce = (key, value) => onChangeFunction(key, value, true);

  // Choice type detection is different
  if (openLaw.isChoiceType(variable, executionResult)) {
    return (
      <Choice
        executionResult={executionResult}
        key={`${nameWithDashes}-choice`}
        onChange={onChangeFunction}
        openLaw={openLaw}
        savedValue={savedValue}
        variable={variable}
      />
    );
  }

  switch (openLaw.getType(variable)) {
    case 'Address':
      return (
        <Address
          apiClient={apiClient} // for API call to Google for geo data
          key={`${nameWithDashes}-address`}
          onChange={onChangeFunction}
          openLaw={openLaw}
          savedValue={
            savedValue
              ? openLaw.getFormattedAddress(openLaw.getAddress(savedValue))
              : ''
          }
          variable={variable}
        />
      );

    case 'Date':
      return (
        <DatePicker
          enableTime={false}
          key={`${nameWithDashes}-date`}
          onChange={onChangeFunction}
          openLaw={openLaw}
          savedValue={savedValue}
          variable={variable}
        />
      );

    case 'DateTime':
      return (
        <DatePicker
          enableTime
          key={`${nameWithDashes}-date`}
          onChange={onChangeFunction}
          openLaw={openLaw}
          savedValue={savedValue}
          variable={variable}
        />
      );

    case 'Identity':
      return (
        <Identity
          apiClient={apiClient}
          executionResult={executionResult}
          key={`${nameWithDashes}-identity`}
          onChange={onChangeFunction}
          openLaw={openLaw}
          savedValue={savedValue}
          variable={variable}
        />
      );

    case 'Image':
      return (
        <ImageInput
          executionResult={executionResult}
          key={`${nameWithDashes}-image`}
          onChange={onChangeFunction}
          openLaw={openLaw}
          savedValue={savedValue}
          variable={variable}
        />
      );

    case 'LargeText':
      return (
        <LargeText
          executionResult={executionResult}
          key={`${nameWithDashes}-large-text`}
          onChange={onChangeFunction}
          openLaw={openLaw}
          savedValue={savedValue}
          variable={variable}
        />
      );

    case 'Number':
      return (
        <NumberInput
          executionResult={executionResult}
          key={`${nameWithDashes}-number`}
          onChange={onChangeFunction}
          openLaw={openLaw}
          savedValue={savedValue}
          variable={variable}
        />
      );

    case 'YesNo':
      return (
        <YesNo
          key={`${nameWithDashes}-yesno`}
          // uses a param `force` set to `true`
          // TODO re-evaluate overriding onChange from the top-level
          // as we really only use this function in OpenLaw's front-end to tell Redux something.
          onChange={onChangeFunctionForce}
          openLaw={openLaw}
          savedValue={savedValue}
          variable={variable}
        />
      );

    default:
      return (
        <Text
          executionResult={executionResult}
          key={`${nameWithDashes}-text`}
          onChange={onChangeFunction}
          openLaw={openLaw}
          savedValue={savedValue}
          variable={variable}
        />
      );
  }
};