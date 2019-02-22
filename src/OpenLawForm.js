// @flow

import * as React from 'react';

import { Collection } from './Collection';
import { GetSections } from './sectionUtil';
import { InputRenderer } from './InputRenderer';
import { Structure } from './Structure';

type Props = {
  apiClient: Object, // opt-out of type checker until we export flow types for APIClient
  executionResult: {},
  onChangeFunction: (any) => mixed,
  openLaw: Object, // opt-out of type checker
  parameters: {[string]: any},
  renderSections?: ({
    children: React.Node,
    section: string,
  }) => React.Node,
  sections: Array<any>,
  sectionTransform?: (any, number) => {},
  sectionVariablesMap: (any, number) => { [string]: Array<string> },
  textLikeInputClass?: string,
  unsectionedTitle?: string,
  variables: Array<{}>,
};

type RendererInputProps = {
  ...Props,
  variable: {},
};

type RendererSectionProps = {
  ...Props,
  variablesMap: { [string]: Object },
  variableObjects: Array<Object>,
  sections: Array<Object>,
};

const renderInputs = (props: RendererInputProps) => {
  const {
    apiClient, // for API call to Google for geo data (if generating an Address)
    executionResult = {},
    onChangeFunction = () => {},
    openLaw = {},
    parameters = {},
    variable = {},
  } = props;

  const savedValue = parameters[openLaw.getName(variable)] || '';
  const cleanName = openLaw.getCleanName(variable);
  const textLikeInputClass = props.textLikeInputClass ? `${props.textLikeInputClass} ` : '';

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
        textLikeInputClass={textLikeInputClass}
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
        textLikeInputClass={textLikeInputClass}
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
      textLikeInputClass={textLikeInputClass}
      variable={variable}
    />
  );
};

const renderSectionsAndInputs = (props: RendererSectionProps) => {
  const {
    executionResult,
    openLaw = {},
    renderSections,
    sections,
    sectionTransform,
    sectionVariablesMap,
    unsectionedTitle,
    variablesMap,
    variableObjects,
  } = props;
  const sectionVariables = openLaw.getVariableSections(executionResult);
  const variableNames = variableObjects.map(v => openLaw.getName(v));
  const getSectionsConfig = {
    sectionTransform,
    sectionVariablesMap,
    unsectionedTitle,
  };

  return GetSections(variableNames, sectionVariables, sections, getSectionsConfig)
    .map(({ variables, ...sectionData }, index, { length:sectionCount }) => {
      if (renderSections) {
        const inputsChildrenComponent = () => (
          variables
            .map(name => variablesMap[name])
            .map(variable => renderInputs({ variable, ...props }))
        );

        return renderSections({
          children: inputsChildrenComponent,
          ...sectionData,
          sectionCount,
        });
      }

      return (
        <div className="contract-section" key={`${sectionData.section}-${index}`}>
          <span>{sectionData.section}</span>

          {variables
            .map(name => variablesMap[name])
            .map(variable => renderInputs({ variable, ...props }))
          }
        </div>
      );
    });
};

export const OpenLawForm = (props: Props): React.Node | Array<React.Node> => {
  const { executionResult, openLaw, sections:sectionsProp, variables } = props;
  const allVariables = openLaw.getVariables(executionResult, {});
  const executedVariables = variables.map(variable =>
    openLaw.getName(variable),
  );
  const sections = sectionsProp ? sectionsProp : openLaw.getSections(executionResult);
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
  if (sections.length) {
    formContent = renderSectionsAndInputs({
      sections,
      variablesMap,
      variableObjects,
      ...props,
    });
  // loop to render inputs
  } else {
    formContent = executedVariables
      .map(name => variablesMap[name])
      .filter(variable => variable !== undefined)
      .map(variable => renderInputs({ variable, ...props }));
  }

  return (
    <div className="openlaw-form">
      {formContent}
    </div>
  );
};
