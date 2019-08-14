/* eslint-disable react/prop-types, react/display-name */

import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { APIClient, Openlaw } from 'openlaw';

import { LargeText } from '../LargeText';
import { OpenLawForm } from '../OpenLawForm';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';

const apiClient = new APIClient('');
const placeholderTextRegex = /contestant personal statement/i;
const appPlaceholderTextRegex = /please write a brief personal statement/i;
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
let FakeOpenlawComponent;

beforeEach(() => {
  parameters = {};
  compiledTemplate = Openlaw.compileTemplate(SampleTemplateText).compiledTemplate;
  executionResult = Openlaw.execute(compiledTemplate, {}, parameters).executionResult;
  executedVariables = Openlaw.getExecutedVariables(executionResult, {});
  FakeOpenlawComponent = props => (
    <OpenLawForm
      apiClient={apiClient}
      executionResult={executionResult}
      parameters={parameters}
      onChangeFunction={() => {}}
      openLaw={Openlaw}
      variables={executedVariables}

      {...props}
    />
  );
});

afterEach(cleanup);

test('Can render Text', () => {
  const { getByPlaceholderText } = render(
    <LargeText
      cleanName="Contestant-Personal-Statement"
      description="Contestant Personal Statement"
      getValidity={getValidity}
      name="Contestant Personal Statement"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  getByPlaceholderText(placeholderTextRegex);
});

test('Can render with savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <LargeText
      cleanName="Contestant-Personal-Statement"
      description="Contestant Personal Statement"
      getValidity={getValidity}
      name="Contestant Personal Statement"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="This is my personal statement"
    />
  );

  getByPlaceholderText(placeholderTextRegex);
  getByDisplayValue(/this is my personal statement/i);
});

test('Can render with savedValue and type another value', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <LargeText
      cleanName="Contestant-Personal-Statement"
      description="Contestant Personal Statement"
      getValidity={getValidity}
      name="Contestant Personal Statement"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="This is my personal statement"
    />
  );

  getByPlaceholderText(placeholderTextRegex);
  getByDisplayValue(/this is my personal statement/i);

  fireEvent.change(getByDisplayValue(/this is my personal statement/i), { target: { value: 'Morgan Smith' } });
  
  getByDisplayValue(/morgan smith/i);
});

test('Can render with field-level, user-provided error onValidate (change)', () => {
  const { getByPlaceholderText, getByText } = render(
    <LargeText
      cleanName="Contestant-Personal-Statement"
      description="Contestant Personal Statement"
      getValidity={getValidity}
      name="Contestant Personal Statement"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ eventType, value }) => {
        if (value && eventType === 'change') {
          return {
            errorMessage: `Sorry, ${value} is incorrect.`,
          };
        }
      }}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  fireEvent.change(getByPlaceholderText(placeholderTextRegex), { target: { value: 'Hi' } });
  
  getByText(/sorry, hi is incorrect/i);
});

test('Can render with field-level, user-provided error onValidate (blur)', () => {
  const { getByPlaceholderText, getByText } = render(
    <LargeText
      cleanName="Contestant-Personal-Statement"
      description="Contestant Personal Statement"
      getValidity={getValidity}
      name="Contestant Personal Statement"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ eventType }) => {
        if (eventType === 'blur') {
          return {
            errorMessage: 'This is a custom blur error',
          };
        }
      }}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  fireEvent.focus(getByPlaceholderText(placeholderTextRegex));
  fireEvent.blur(getByPlaceholderText(placeholderTextRegex));
  
  getByText(/this is a custom blur error/i);
});

test('Can call onChangeFunction', () => {
  const changeSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <FakeOpenlawComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.change(
    getByPlaceholderText(appPlaceholderTextRegex),
    { target: { value: 'This is my personal statement' } },
  );
  fireEvent.blur(getByPlaceholderText(appPlaceholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(changeSpy.mock.calls[0][0]).toMatch(/contestant personal statement/i);
  expect(changeSpy.mock.calls[0][1]).toMatch(/this is my personal statement/i);
});

test('Can call inputProps: onChange, onBlur', () => {
  const changeSpy = jest.fn();
  const blurSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <FakeOpenlawComponent
      inputProps={{
        'LargeText': {
          onChange: changeSpy,
          onBlur: blurSpy,
        },
      }}
    />
  );

  fireEvent.change(
    getByPlaceholderText(appPlaceholderTextRegex),
    { target: { value: 'This is my personal statement' } },
  );
  fireEvent.blur(getByPlaceholderText(appPlaceholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(blurSpy.mock.calls.length).toBe(1);
});
