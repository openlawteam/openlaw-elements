// @flow

import * as React from 'react';

import {Collection} from './Collection';
import {GetSections} from './sectionUtil';
import {InputRenderer} from './InputRenderer';
import {Structure} from './Structure';
import Collapsible from './Collapsible';

type Props = {
  apiClient: Object, // opt-out of type checker until we export flow types for APIClient
  executionResult: {},
  onChangeFunction: (any) => mixed,
  openLaw: Object, // opt-out of type checker
  parameters: {[string]: any},
  variables: Array<string>,
};

type RendererInputProps = {
  ...Props,
  variable: {},
};

type RendererSectionProps = {
  ...Props,
  variable: {},
  variablesMap: {[string]: Object},
  variableObjects: Array<Object>,
  sections: Array<Object>,
};

const renderInputs = (props: RendererInputProps) => {
  const {
    apiClient, // for API call to Google for geo data (if generating an Address)
    executionResult = {},
    onChangeFunction = () => {},
    openLaw,
    parameters,
    variable = {},
  } = props;

  if (!openLaw) return;

  const savedValue = parameters[openLaw.getName(variable)];
  const cleanName = openLaw.getCleanName(variable);

  // Structure: can contain all types of inputs in <InputRenderer />
  if (openLaw.isStructuredType(variable, executionResult)) {
    return (
      <Structure
        apiClient={apiClient}
        executionResult={executionResult}
        key={`${cleanName}-collection`}
        onChange={onChangeFunction}
        openLaw={openLaw}
        savedValue={savedValue}
        variable={variable}
      />
    );
  }

  // Collection: can contain a <Structure />, and all types of inputs in <InputRenderer />
  if (openLaw.getType(variable) === 'Collection') {
    return (
      <Collection
        apiClient={apiClient}
        executionResult={executionResult}
        key={`${cleanName}-collection`}
        onChange={onChangeFunction}
        openLaw={openLaw}
        savedValue={
          savedValue || openLaw.getCollectionValue(variable, executionResult, '')
        }
        variable={variable}
      />
    );
  }

  return (
    <InputRenderer
      apiClient={apiClient}
      executionResult={executionResult}
      key={`${cleanName}-input`}
      onChangeFunction={onChangeFunction}
      openLaw={openLaw}
      savedValue={savedValue}
      variable={variable}
    />
  );
};

const renderSections = (props: RendererSectionProps) => {
  const {
    executionResult,
    openLaw,
    sections,
    variablesMap,
    variableObjects,
  } = props;
  const sectionVariables = openLaw.getVariableSections(executionResult);
  const variableNames = variableObjects.map(variable =>
    openLaw.getName(variable),
  );

  return GetSections(variableNames, sectionVariables, sections)
    .map(collapsible => {
      const section = collapsible.section;
      const currentVariables = collapsible.variables.map(
        name => variablesMap[name],
      );

      return (
        <Collapsible
          key={`section-${section}`}
          open
          overflowWhenOpen="visible"
          trigger={section}
        >
          {currentVariables.map(variable =>
            renderInputs({variable, ...props})
          )}
        </Collapsible>
      );
    });
};

export const OpenLawForm = (props: Props): Array<React.Node> => {
  const {executionResult, openLaw, variables} = props;

  const allVariables = openLaw.getVariables(executionResult, {});
  const executedVariables = variables.map(variable =>
    openLaw.getName(variable),
  );
  const sections = openLaw.getSections(executionResult);
  const variableObjects = allVariables
    .filter(variable =>
      openLaw.showInForm(variable, executionResult),
    )
    .filter(
      variable => executedVariables.indexOf(openLaw.getName(variable)) > -1,
    );

  let variablesMap: {[string]: any} = {};

  variableObjects.forEach(variable => {
    variablesMap[openLaw.getName(variable)] = variable;
  });

  let formContent;

  // loop to render sections
  if (sections.length > 0) {
    formContent = renderSections({
      sections,
      variablesMap,
      variableObjects,
      ...props,
    });
  } else {
    formContent = executedVariables
      .map(name => variablesMap[name])
      .filter(variable => variable !== undefined)
      .map(variable => renderInputs({variable, ...props}));
  }

  // loop to render inputs
  return (
    <div className="openlaw-form">
      {formContent}
    </div>
  );
};
