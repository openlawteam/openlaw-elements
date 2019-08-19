import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { APIClient, Openlaw } from 'openlaw';

import { OpenLawForm } from '../OpenLawForm';
import SampleTemplate from '../../example/SAMPLE_TEMPLATE';
import { getTemplateExecutionData } from '../__test_utils__/helpers';

const FakeApp = () => {
  const { executedVariables, executionResult: initialExecutionResult } = getTemplateExecutionData(SampleTemplate, {}, true);

  const [ result, setNewResult ] = useState({
    executionResult: initialExecutionResult,
    parameters: {},
    variables: executedVariables,
  });

  const onChange = (key, value, validationResult) => {
    if (validationResult && validationResult.isError) {
      // eslint-disable-next-line no-undef
      console.error('Openlaw Execution Error:', validationResult.errorMessage);
    }

    const concatParameters = { ...result.parameters, [key]: value };
    const { executedVariables, executionResult, errorMessage } = getTemplateExecutionData(SampleTemplate, concatParameters, true);

    if (errorMessage) {
      // eslint-disable-next-line no-undef
      console.error('Openlaw Execution Error:', errorMessage);
      return;
    }

    setNewResult({
      executionResult,
      parameters: concatParameters,
      variables: executedVariables,
    });
  };

  const { executionResult, parameters, variables } = result;

  return (
    <OpenLawForm
      apiClient={new APIClient('')}
      executionResult={executionResult}
      parameters={parameters}
      onChangeFunction={(key, value, validationResult) => (
        act(() => onChange(key, value, validationResult))
      )}
      openLaw={Openlaw}
      variables={variables}
    />
  );
};

afterEach(cleanup);

describe('Structure', () => {
  test('Can render a Structure variable with all inputs', () => {
    const { getByDisplayValue, getByPlaceholderText } = render(
      <FakeApp />
    );

    const contactName = getByPlaceholderText(/emergency contact name/i);
    const contactPhone = getByPlaceholderText(/emergency contact phone/i);

    fireEvent.change(contactName, { target: { value: 'Alex' } });
    fireEvent.change(contactPhone, { target: { value: '123-456-7890' } });

    getByDisplayValue(/alex/i);
    getByDisplayValue(/123-456-7890/i);
  });

  test('Can render a Structure variable within a Collection', () => {
    const { getByPlaceholderText } = render(
      <FakeApp />
    );
    const certificationDate = document.querySelector('input.Certification-Date');

    getByPlaceholderText(/certification title/i);
    expect(certificationDate).not.toBeNull();
    getByPlaceholderText(/certifier eth address/i);
  });
});
