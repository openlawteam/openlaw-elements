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
import { FIELD_DEFAULT_ERROR_MESSAGE, TYPE_TO_READABLE } from '../constants';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';
import externalCallStructures from '../../example/externalCallStructuresHelper.js';

const getValidity = (name, value) => {
  const v = executedVariables.filter(v =>
    Openlaw.getName(v) === name
  );

  return Openlaw.checkValidity(v[0], value, executionResult);
};
const genericErrorMessage = `${TYPE_TO_READABLE.Period}: ${FIELD_DEFAULT_ERROR_MESSAGE}`;
const periodPlaceholderTextRegex = /what is the longest bbq you ever conducted/i;
const periodErrorTextRegex = /period of time: something looks incorrect/i;
let apiClient;
let parameters;
let compiledTemplate;
let executionResult;
let executedVariables;
let FakeOpenlawComponent;

beforeEach(() => {
  apiClient = new APIClient('');
  parameters = {};
  compiledTemplate = Openlaw.compileTemplate(SampleTemplateText).compiledTemplate;
  executionResult = Openlaw.execute(compiledTemplate, {}, parameters, externalCallStructures).executionResult;
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

test('Can render with savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-Longest-BBQ"
      description="Contestant Longest BBQ"
      getValidity={getValidity}
      name="Contestant Longest BBQ"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="1 week"
    />
  );

  getByPlaceholderText(/contestant longest bbq/i);
  getByDisplayValue(/1 week/i);
});

test('Can render with savedValue and type another value', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-Longest-BBQ"
      description="Contestant Longest BBQ"
      getValidity={getValidity}
      name="Contestant Longest BBQ"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="1 week"
    />
  );

  getByPlaceholderText(/contestant longest bbq/i);
  getByDisplayValue(/1 week/i);

  fireEvent.change(getByDisplayValue(/1 week/i), { target: { value: '2 months' } });
  
  getByDisplayValue(/2 months/i);
});

test('Can render without bad savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-Longest-BBQ"
      description="Contestant Longest BBQ"
      getValidity={getValidity}
      name="Contestant Longest BBQ"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="1 we"
    />
  );

  getByPlaceholderText(/contestant longest bbq/i);
  expect(() => getByDisplayValue(/1 we/i)).toThrow();
});

test('Can call onChangeFunction', () => {
  const changeSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <FakeOpenlawComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.change(
    getByPlaceholderText(periodPlaceholderTextRegex),
    { target: { value: '1 Week' } },
  );
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(changeSpy.mock.calls[0][0]).toMatch(/contestant longest bbq/i);
  expect(changeSpy.mock.calls[0][1]).toMatch(/1 week/i);
});

test('Can call inputProps: onChange, onBlur', () => {
  const changeSpy = jest.fn();
  const blurSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <FakeOpenlawComponent
      inputProps={{
        'Period': {
          onChange: changeSpy,
          onBlur: blurSpy,
        },
      }}
    />
  );

  fireEvent.change(
    getByPlaceholderText(periodPlaceholderTextRegex),
    { target: { value: '1 week' } },
  );
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(blurSpy.mock.calls.length).toBe(1);
});

test('Can validate Period type', () => {
  const { getByDisplayValue, getByTestId, getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
  );

  fireEvent.change(
    getByPlaceholderText(periodPlaceholderTextRegex),
    { target: { value: '1 week' } },
  );
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  // value should be set
  getByDisplayValue(/1 week/i);
  // no error message field
  expect(() => getByText(periodErrorTextRegex)).toThrow();
  // no error message top
  expect(() => getByTestId('error-message')).toThrow();
});

/**
 * onBlur
 */

test('Can show field-level error onBlur', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
  );

  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 we' } });
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  // error message field
  getByText(periodErrorTextRegex);
});

test('Can show field-level, user-provided error onValidate (blur)', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent
      onValidate={({ errorMessage, eventType }) => {
        if (errorMessage && eventType === 'blur') {
          return {
            errorMessage: 'This is a custom Period error',
          };
        }
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 we' } });
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  // error message field
  getByText(/this is a custom period error/i);
});

test('Can clear previous field-level, user-provided error onValidate (blur) with valid entry', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent
      onValidate={({ errorMessage }) => {
        if (errorMessage) {
          return {
            errorMessage: 'This is a custom Period error',
          };
        }
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 we' } });
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  getByText(/this is a custom period error/i);

  fireEvent.change(
    getByPlaceholderText(periodPlaceholderTextRegex),
    { target: { value: '1 week' } },
  );
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  // don't show error message on the field
  expect(() => getByText(/this is a custom period error/i)).toThrow();
});

test('Should not show error onBlur with no content', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
  );

  fireEvent.focus(getByPlaceholderText(periodPlaceholderTextRegex));
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  // error message field should not show
  expect(() => getByText(periodErrorTextRegex)).toThrow();
});

test('Should not show error onBlur with no content, after previous content typed', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
  );

  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 we' } });
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  // error message field
  getByText(periodErrorTextRegex);

  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '' } });
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  // error message field should not show
  expect(() => getByText(periodErrorTextRegex)).toThrow();
});

/**
 * onChange
 */

test('Can show error onChange', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
  );

  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 we' } });

  // don't show error message on the field
  expect(() => getByText(periodErrorTextRegex)).toThrow();
});

test('Can show field-level, user-provided error onValidate (change)', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent
      onValidate={({ errorMessage, eventType }) => {
        if (errorMessage && eventType === 'change') {
          return {
            errorMessage: 'This is a custom Period error',
          };
        }
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 we' } });

  // error message field
  getByText(/this is a custom period error/i);
});

test('Should not clear previous error onChange, if value is bad', () => {
  const { getByDisplayValue, getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
  );

  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 we' } });
  fireEvent.blur(getByDisplayValue(/1 we/i));

  getByText(genericErrorMessage);

  fireEvent.change(getByDisplayValue(/1 we/i), { target: { value: '1 w' } });

  // continue to show error message on the field
  getByText(genericErrorMessage);
});

test('Should not show error message onBlur if user has set empty string for "errorMessage"', () => {
  const { getByDisplayValue, getByPlaceholderText, getByText } = render(
    <FakeOpenlawComponent
      onValidate={({ elementType, isError }) => {
        if (isError && elementType === 'Period') {
          return {
            // do not show error
            errorMessage: '',
          };
        }
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 we' } });
  fireEvent.blur(getByDisplayValue(/1 we/i));

  expect(() => getByText(genericErrorMessage)).toThrow();
});

test('Should not show error message onChange if user has set empty string for "errorMessage"', () => {
  const { getByDisplayValue, getByPlaceholderText, getByText } = render(
    <FakeOpenlawComponent
      onValidate={(errorData) => {
        const { eventType, isError } = errorData;
        return {
          // do not show error if user is making changes
          errorMessage: (isError && eventType === 'change') && '',
        };
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 we' } });
  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 w' } });

  // should not show error
  expect(() => getByText(genericErrorMessage)).toThrow();

  fireEvent.blur(getByDisplayValue(/1 w/i));

  // error shows again as normal onBlur
  getByText(genericErrorMessage);
});
