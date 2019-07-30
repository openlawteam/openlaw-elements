/* eslint-disable react/prop-types, react/display-name */

import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { APIClient, Openlaw } from 'openlaw';

import { Text } from '../Text';
import { OpenLawForm } from '../OpenLawForm';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';

const getValidity = (name, value) => {
  const v = executedVariables.filter(v =>
    Openlaw.getName(v) === name
  );

  return Openlaw.checkValidity(v[0], value, executionResult);
};

const ethPlaceholderTextRegex = /your eth address for the registration fee/i;
const ethErrorTextRegex = /ethereum address: something looks incorrect/i;
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

test('Can render with savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-ETH-Address"
      description="Contestant ETH Address"
      getValidity={getValidity}
      name="Contestant ETH Address"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="0xc0ffee254729296a45a3885639AC7E10F9d54979"
    />
  );

  getByPlaceholderText(/contestant eth address/i);
  getByDisplayValue(/0xc0ffee254729296a45a3885639AC7E10F9d54979/i);
});

test('Can render with savedValue and type another value', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-ETH-Address"
      description="Contestant ETH Address"
      getValidity={getValidity}
      name="Contestant ETH Address"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="0xc0ffee254729296a45a3885639AC7E10F9d54979"
    />
  );

  getByPlaceholderText(/contestant eth address/i);
  getByDisplayValue(/0xc0ffee254729296a45a3885639AC7E10F9d54979/i);

  fireEvent.change(getByDisplayValue(/0xc0ffee254729296a45a3885639AC7E10F9d54979/i), { target: { value: '0xd9AAee254729296a45a3885639AC7E10F9d54979' } });
  
  getByDisplayValue(/0xd9AAee254729296a45a3885639AC7E10F9d54979/i);
});

test('Can render without bad savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-ETH-Address"
      description="Contestant ETH Address"
      getValidity={getValidity}
      name="Contestant ETH Address"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="0xc0ffe"
    />
  );

  getByPlaceholderText(/contestant eth address/i);
  expect(() => getByDisplayValue(/0xc0ffe/i)).toThrow();
});

test('Can call inputProps: onChange, onBlur', () => {
  const changeSpy = jest.fn();
  const blurSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <FakeOpenlawComponent
      inputProps={{
        'EthAddress': {
          onChange: changeSpy,
          onBlur: blurSpy,
        },
      }}
    />
  );

  fireEvent.change(
    getByPlaceholderText(ethPlaceholderTextRegex),
    { target: { value: '0xc0ffee254729296a45a3885639AC7E10F9d54979' } },
  );
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(blurSpy.mock.calls.length).toBe(1);
});

test('Can validate EthAddress type', () => {
  const { getByDisplayValue, getByTestId, getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
  );

  fireEvent.change(
    getByPlaceholderText(ethPlaceholderTextRegex),
    { target: { value: '0xc0ffee254729296a45a3885639AC7E10F9d54979' } },
  );
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  // value should be set
  getByDisplayValue(/0xc0ffee254729296a45a3885639AC7E10F9d54979/i);
  // no error message field
  expect(() => getByText(ethErrorTextRegex)).toThrow();
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

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  // error message field
  getByText(ethErrorTextRegex);
});

test('Can show field-level, user-provided error onValidate (blur)', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent
      onValidate={({ errorMessage, eventType }) => {
        if (errorMessage && eventType === 'blur') {
          return {
            errorMessage: 'This is a custom ETH error',
          };
        }
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  // error message field
  getByText(/this is a custom eth error/i);
});

test('Can clear previous field-level, user-provided error onValidate (blur) with valid entry', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent
      onValidate={({ errorMessage }) => {
        if (errorMessage) {
          return {
            errorMessage: 'This is a custom ETH error',
          };
        }
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  getByText(/this is a custom eth error/i);

  fireEvent.change(
    getByPlaceholderText(ethPlaceholderTextRegex),
    { target: { value: '0xc0ffee254729296a45a3885639AC7E10F9d54979' } },
  );
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  // don't show error message on the field
  expect(() => getByText(/this is a custom eth error/i)).toThrow();
});

test('Should not show error onBlur with no content', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
  );

  fireEvent.focus(getByPlaceholderText(ethPlaceholderTextRegex));
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  // error message field should not show
  expect(() => getByText(ethErrorTextRegex)).toThrow();
});

test('Should not show error onBlur with no content, after previous content typed', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  // error message field
  getByText(ethErrorTextRegex);

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '' } });
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  // error message field should not show
  expect(() => getByText(ethErrorTextRegex)).toThrow();
});

/**
 * onChange
 */

test('Can show error onChange', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });

  // don't show error message on the field
  expect(() => getByText(ethErrorTextRegex)).toThrow();
});

test('Can show field-level, user-provided error onValidate (change)', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent
      onValidate={({ errorMessage, eventType }) => {
        if (errorMessage && eventType === 'change') {
          return {
            errorMessage: 'This is a custom ETH error',
          };
        }
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });

  // error message field
  getByText(/this is a custom eth error/i);
});

test('Can clear previous field-level, user-provided error onValidate (change event) with valid entry', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent
      onValidate={({ errorMessage }) => {
        if (errorMessage) {
          return {
            errorMessage: 'This is a custom ETH error',
          };
        }
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  getByText(/this is a custom eth error/i);

  fireEvent.change(
    getByPlaceholderText(ethPlaceholderTextRegex),
    { target: { value: '0xc0ffee254729296a45a3885639AC7E10F9d54979' } },
  );

  // don't show error message on the field
  expect(() => getByText(/this is a custom eth error/i)).toThrow();
});

test('Can clear previous error onChange with valid entry', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  getByText(ethErrorTextRegex);

  fireEvent.change(
    getByPlaceholderText(ethPlaceholderTextRegex),
    { target: { value: '0xc0ffee254729296a45a3885639AC7E10F9d54979' } },
  );

  // don't show error message on the field
  expect(() => getByText(ethErrorTextRegex)).toThrow();
});

test('Field error is reset when no value and doesn\'t show onChange', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  getByText(ethErrorTextRegex);

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '' } });
  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x' } });

  // don't show error message on the field
  expect(() => getByText(ethErrorTextRegex)).toThrow();
});

test('Can clear previous error onChange', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  getByText(ethErrorTextRegex);

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0xc0ffee254729296a45a3885639AC7E10F9d54979' } });

  // don't show error message on the field
  expect(() => getByText(ethErrorTextRegex)).toThrow();
});
