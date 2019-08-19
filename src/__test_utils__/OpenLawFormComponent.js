// @flow

import React from 'react';
import { APIClient, Openlaw } from 'openlaw';

import { OpenLawForm } from '../OpenLawForm';
import { getTemplateExecutionData } from './helpers';
import SampleTemplate from '../../example/SAMPLE_TEMPLATE';

/**
* Useful for integration tests
* where you want to test code execution from the top, down
* to a component, etc.
*
* Makes use of the SAMPLE_TEMPLATE.
*/

const TestOpenLawFormComponent = (props: { [string]: any }) => {
  const parameters = {};
  const { executedVariables, executionResult } = getTemplateExecutionData(SampleTemplate, {}, true);

  return (
    <OpenLawForm
      apiClient={new APIClient('')}
      executionResult={executionResult}
      parameters={parameters}
      onChangeFunction={() => {}}
      openLaw={Openlaw}
      variables={executedVariables}

      {...props}
    />
  );
};

export default TestOpenLawFormComponent;
