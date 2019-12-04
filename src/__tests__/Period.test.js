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

const template = '[[Contestant Longest BBQ: Period "What is the longest BBQ you ever conducted? (e.g. 1 week, 1 day 2 hours)"]]';
const getValidity = testGetValidity(
  getTemplateExecutionData(template),
);

const genericErrorMessage = `${TYPE_TO_READABLE.Period}: ${FIELD_DEFAULT_ERROR_MESSAGE}`;
const periodPlaceholderTextRegex = /what is the longest bbq you ever conducted/i;
const periodErrorTextRegex = /period of time: something looks incorrect/i;

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

test('Can render user-provided extra text string', () => {
  const { getByText } = render(
    <Text
      cleanName="Contestant-Longest-BBQ"
      description="Contestant Longest BBQ"
      getValidity={getValidity}
      inputExtraText="Contestant Longest BBQ extra text"
      name="Contestant Longest BBQ"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="1 week"
    />
  );
  
  getByText(/contestant longest bbq extra text/i);
});

test('Can call onChangeFunction', () => {
  const changeSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.change(
    getByPlaceholderText(periodPlaceholderTextRegex),
    { target: { value: '1 week' } },
  );
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(changeSpy.mock.calls[0][0]).toMatch(/contestant longest bbq/i);
  expect(changeSpy.mock.calls[0][1]).toMatch(/1 week/i);
});

test('Can call onChangeFunction: bad value should be undefined', () => {
  const changeSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.change(
    getByPlaceholderText(periodPlaceholderTextRegex),
    { target: { value: '1 we' } },
  );
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(changeSpy.mock.calls[0][0]).toMatch(/contestant longest bbq/i);
  expect(changeSpy.mock.calls[0][1]).toBe(undefined);
});

test('Can convert case to lowercase (otherwise it will fail Core validation)', () => {
  const changeSpy = jest.fn();

  const { getByDisplayValue, getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.change(
    getByPlaceholderText(periodPlaceholderTextRegex),
    { target: { value: '1 Week' } },
  );
  fireEvent.blur(getByDisplayValue('1 week'));

  expect(changeSpy.mock.calls[0][1]).toBe('1 week');

  fireEvent.change(
    getByDisplayValue('1 week'),
    { target: { value: '1 YEAR' } },
  );
  fireEvent.blur(getByDisplayValue('1 year'));

  expect(changeSpy.mock.calls[1][1]).toBe('1 year');

  fireEvent.change(
    getByDisplayValue('1 year'),
    { target: { value: '1 mOnTh' } },
  );
  fireEvent.blur(getByDisplayValue('1 month'));

  expect(changeSpy.mock.calls[2][1]).toBe('1 month');
});

test('Can call inputProps: onChange, onBlur', () => {
  const changeSpy = jest.fn();
  const blurSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <TestOpenLawFormComponent
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
    <TestOpenLawFormComponent />
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
    <TestOpenLawFormComponent />
  );

  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 we' } });
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  // error message field
  getByText(periodErrorTextRegex);
});

test('Can show field-level, user-provided error onValidate (blur)', () => {
  const { getByText, getByPlaceholderText } = render(
    <TestOpenLawFormComponent
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
    <TestOpenLawFormComponent
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
    <TestOpenLawFormComponent />
  );

  fireEvent.focus(getByPlaceholderText(periodPlaceholderTextRegex));
  fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

  // error message field should not show
  expect(() => getByText(periodErrorTextRegex)).toThrow();
});

test('Should not show error onBlur with no content, after previous content typed', () => {
  const { getByText, getByPlaceholderText } = render(
    <TestOpenLawFormComponent />
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
    <TestOpenLawFormComponent />
  );

  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 we' } });

  // don't show error message on the field
  expect(() => getByText(periodErrorTextRegex)).toThrow();
});

test('Can show field-level, user-provided error onValidate (change)', () => {
  const { getByText, getByPlaceholderText } = render(
    <TestOpenLawFormComponent
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
    <TestOpenLawFormComponent />
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
    <TestOpenLawFormComponent
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

  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 we' } });
  fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 w' } });

  // should not show error
  expect(() => getByText(genericErrorMessage)).toThrow();

  fireEvent.blur(getByDisplayValue(/1 w/i));

  // error shows again as normal onBlur
  getByText(genericErrorMessage);
});
