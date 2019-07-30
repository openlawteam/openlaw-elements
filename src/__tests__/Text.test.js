/* eslint-disable react/prop-types */

import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { Openlaw } from 'openlaw';

import { Text } from '../Text';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';

const getValidity = (name, value) => {
  const v = executedVariables.filter(v =>
    Openlaw.getName(v) === name
  );

  return Openlaw.checkValidity(v[0], value, executionResult);
};

let parameters;
let compiledTemplate;
let executionResult;
let executedVariables;

beforeEach(() => {
  parameters = {};
  compiledTemplate = Openlaw.compileTemplate(SampleTemplateText).compiledTemplate;
  executionResult = Openlaw.execute(compiledTemplate, {}, parameters).executionResult;
  executedVariables = Openlaw.getExecutedVariables(executionResult, {});
});

afterEach(cleanup);

test('Can render Text', () => {
  const { getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-Name"
      description="Contestant Name"
      getValidity={getValidity}
      name="Contestant Name"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  getByPlaceholderText(/contestant name/i);
});

test('Can render with savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-Name"
      description="Contestant Name"
      getValidity={getValidity}
      name="Contestant Name"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="Alex Smith"
    />
  );

  getByPlaceholderText(/contestant name/i);
  getByDisplayValue(/alex smith/i);
});

test('Can render with savedValue and type another value', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-Name"
      description="Contestant Name"
      getValidity={getValidity}
      name="Contestant Name"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="Alex Smith"
    />
  );

  getByPlaceholderText(/contestant name/i);
  getByDisplayValue(/alex smith/i);

  fireEvent.change(getByDisplayValue(/alex smith/i), { target: { value: 'Morgan Smith' } });
  
  getByDisplayValue(/morgan smith/i);
});

test('Can render with field-level, user-provided error onValidate', () => {
  const { getByPlaceholderText, getByText } = render(
    <Text
      cleanName="Contestant-Name"
      description="Contestant Name"
      getValidity={getValidity}
      name="Contestant Name"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ eventType, value }) => {
        if (value && eventType === 'blur') {
          return {
            errorMessage: `Sorry, ${value} is incorrect.`,
          };
        }
      }}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  fireEvent.change(getByPlaceholderText(/contestant name/i), { target: { value: 'Morgan Smith' } });
  fireEvent.blur(getByPlaceholderText(/contestant name/i));
  
  getByText(/sorry, morgan smith is incorrect/i);
});
