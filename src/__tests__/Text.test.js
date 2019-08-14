/* eslint-disable react/prop-types, react/display-name */

import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { APIClient, Openlaw } from 'openlaw';

import { Text } from '../Text';
import { OpenLawForm } from '../OpenLawForm';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';

const apiClient = new APIClient('');
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

test('Can render with field-level, user-provided error onValidate (change)', () => {
  const { getByPlaceholderText, getByText } = render(
    <Text
      cleanName="Contestant-Name"
      description="Contestant Name"
      getValidity={getValidity}
      name="Contestant Name"
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

  fireEvent.change(getByPlaceholderText(/contestant name/i), { target: { value: 'Morgan Smith' } });
  
  getByText(/sorry, morgan smith is incorrect/i);
});

test('Can render with field-level, user-provided error onValidate (blur)', () => {
  const { getByPlaceholderText, getByText } = render(
    <Text
      cleanName="Contestant-Name"
      description="Contestant Name"
      getValidity={getValidity}
      name="Contestant Name"
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

  fireEvent.focus(getByPlaceholderText(/contestant name/i));
  fireEvent.blur(getByPlaceholderText(/contestant name/i));
  
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
    getByPlaceholderText(/contestant name/i),
    { target: { value: 'Morgan Smith' } },
  );
  fireEvent.blur(getByPlaceholderText(/contestant name/i));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(changeSpy.mock.calls[0][0]).toMatch(/contestant name/i);
  expect(changeSpy.mock.calls[0][1]).toMatch(/morgan smith/i);
});

test('Can call inputProps: onChange, onBlur', () => {
  const changeSpy = jest.fn();
  const blurSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <FakeOpenlawComponent
      inputProps={{
        'Text': {
          onChange: changeSpy,
          onBlur: blurSpy,
        },
      }}
    />
  );

  fireEvent.change(
    getByPlaceholderText(/contestant name/i),
    { target: { value: 'Morgan Smith' } },
  );
  fireEvent.blur(getByPlaceholderText(/contestant name/i));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(blurSpy.mock.calls.length).toBe(1);
});
