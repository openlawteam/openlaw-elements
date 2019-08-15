// @flow

import { Openlaw } from 'openlaw';

import getExternalCallStructures from '../../example/externalCallStructuresHelper';

export const getTemplateExecutionData = (template: string, parameters: {[string]: any} = {}, includeExternalCallStructures: boolean) => {
  const externalCallStructures = includeExternalCallStructures
    ? getExternalCallStructures()
    : {};
  const { compiledTemplate } = Openlaw.compileTemplate(template);
  const executionResult = Openlaw.execute(compiledTemplate, {}, parameters, externalCallStructures).executionResult;
  const executedVariables = Openlaw.getExecutedVariables(executionResult, {});

  return {
    compiledTemplate,
    executedVariables,
    executionResult,
  };
};

type ExecutionDataType = {
  compiledTemplate: { [string]: any },
  executedVariables: { [string]: any },
  executionResult: { [string]: any },
};

export const getValidity = (templateExecutionData: ExecutionDataType) => (name: string, value: any) => {
  const { executedVariables, executionResult } = templateExecutionData;

  const v = executedVariables.filter(v =>
    Openlaw.getName(v) === name
  );

  return Openlaw.checkValidity(v[0], value, executionResult);
};
