/* eslint-disable react/prop-types, react/display-name */

import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Openlaw } from 'openlaw';

import { Text } from '../Text';
import { FIELD_DEFAULT_ERROR_MESSAGE, TYPE_TO_READABLE } from '../constants';
import TestOpenLawFormComponent from '../__test_utils__/OpenLawFormComponent';
import { getTemplateExecutionData, getValidity as testGetValidity } from '../__test_utils__/helpers';

const template = 'Please, be a giver of ETH: [[Contestant ETH Address: EthAddress "Your ETH address for the registration fee ($200)"]]';
const getValidity = testGetValidity(
  getTemplateExecutionData(template),
);

const genericErrorMessage = `${TYPE_TO_READABLE.EthAddress}: ${FIELD_DEFAULT_ERROR_MESSAGE}`;
const ethPlaceholderTextRegex = /your eth address for the registration fee/i;
const ethErrorTextRegex = /ethereum address: something looks incorrect/i;

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

test('Can call onChangeFunction', () => {
  const changeSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.change(
    getByPlaceholderText(ethPlaceholderTextRegex),
    { target: { value: '1 Week' } },
  );
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(changeSpy.mock.calls[0][0]).toMatch(/contestant eth address/i);
  expect(changeSpy.mock.calls[0][1]).toMatch(/1 week/i);
});

test('Can call inputProps: onChange, onBlur', () => {
  const changeSpy = jest.fn();
  const blurSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <TestOpenLawFormComponent
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
    <TestOpenLawFormComponent />
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
    <TestOpenLawFormComponent />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  // error message field
  getByText(ethErrorTextRegex);
});

test('Can show field-level, user-provided error onValidate (blur)', () => {
  const { getByText, getByPlaceholderText } = render(
    <TestOpenLawFormComponent
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
    <TestOpenLawFormComponent
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
    <TestOpenLawFormComponent />
  );

  fireEvent.focus(getByPlaceholderText(ethPlaceholderTextRegex));
  fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

  // error message field should not show
  expect(() => getByText(ethErrorTextRegex)).toThrow();
});

test('Should not show error onBlur with no content, after previous content typed', () => {
  const { getByText, getByPlaceholderText } = render(
    <TestOpenLawFormComponent />
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
    <TestOpenLawFormComponent />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });

  // don't show error message on the field
  expect(() => getByText(ethErrorTextRegex)).toThrow();
});

test('Can show field-level, user-provided error onValidate (change)', () => {
  const { getByText, getByPlaceholderText } = render(
    <TestOpenLawFormComponent
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

test('Should not clear previous error onChange, if value is bad', () => {
  const { getByDisplayValue, getByText, getByPlaceholderText } = render(
    <TestOpenLawFormComponent />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
  fireEvent.blur(getByDisplayValue(/0x123/i));

  getByText(genericErrorMessage);

  fireEvent.change(getByDisplayValue(/0x123/i), { target: { value: '0x1' } });

  // continue to show error message on the field
  getByText(genericErrorMessage);
});

test('Should not show error message onBlur if user has set empty string for "errorMessage"', () => {
  const { getByDisplayValue, getByPlaceholderText, getByText } = render(
    <TestOpenLawFormComponent
      onValidate={({ elementType, isError }) => {
        if (isError && elementType === 'EthAddress') {
          return {
            // do not show error
            errorMessage: '',
          };
        }
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
  fireEvent.blur(getByDisplayValue(/0x123/i));

  expect(() => getByText(genericErrorMessage)).toThrow();
});

test('Should not show error message onChange if user has set empty string for "errorMessage"', () => {
  const { getByDisplayValue, getByPlaceholderText, getByText } = render(
    <TestOpenLawFormComponent
      onValidate={(errorData) => {
        const { eventType, isError } = errorData;
        return {
          // do not show error if user is making changes
          errorMessage: (isError && eventType === 'change') && '',
        };
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
  fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x1' } });

  // should not show error
  expect(() => getByText(genericErrorMessage)).toThrow();

  fireEvent.blur(getByDisplayValue(/0x1/i));

  // error shows again as normal onBlur
  getByText(genericErrorMessage);
});
