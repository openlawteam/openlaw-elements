/* eslint-disable react/prop-types, react/display-name */

import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Openlaw } from 'openlaw';

import { Identity } from '../Identity';
import { FIELD_DEFAULT_ERROR_MESSAGE, TYPE_TO_READABLE } from '../constants';
import TestOpenLawFormComponent from '../__test_utils__/OpenLawFormComponent';
import { getTemplateExecutionData, getValidity as testGetValidity } from '../__test_utils__/helpers';

const template = 'Please sign below: [[Contestant Email: Identity | Signature]]';
const getValidity = testGetValidity(
  getTemplateExecutionData(template),
);

const genericErrorMessage = `${TYPE_TO_READABLE.Identity}: ${FIELD_DEFAULT_ERROR_MESSAGE}`;
const placeholderTextRegex = /contestant email/i;

afterEach(cleanup);

test('Can render Identity', () => {
  const { getByPlaceholderText } = render(
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={getValidity}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
      variableType="Identity"
    />
  );

  getByPlaceholderText(placeholderTextRegex);
});

test('Can type a value', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={getValidity}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
      variableType="Identity"
    />
  );

  fireEvent.change(getByPlaceholderText(placeholderTextRegex), { target: { value: 'morgan@openlaw.io' } });
  
  getByDisplayValue(/morgan@openlaw\.io/i);
});

test('Can render with savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={getValidity}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue={'{"email": "alex@openlaw.io"}'}
      variableType="Identity"
    />
  );

  getByPlaceholderText(placeholderTextRegex);
  getByDisplayValue(/alex@openlaw\.io/i);
});

test('Can render with savedValue and type another value', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={getValidity}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue={'{"email": "alex@openlaw.io"}'}
      variableType="Identity"
    />
  );

  getByPlaceholderText(placeholderTextRegex);
  getByDisplayValue(/alex@openlaw\.io/i);

  fireEvent.change(getByDisplayValue(/alex@openlaw\.io/i), { target: { value: 'morgan@openlaw.io' } });
  
  getByDisplayValue(/morgan@openlaw\.io/i);
});

test('Can render without bad savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={getValidity}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue={'{"email": "alex.bad@"}'}
      variableType="Identity"
    />
  );

  getByPlaceholderText(placeholderTextRegex);
  expect(() => getByDisplayValue(/alex\.bad@/i)).toThrow();
});

test('Can call onChangeFunction', () => {
  const changeSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.change(
    getByPlaceholderText(placeholderTextRegex),
    { target: { value: 'alex@openlaw.io' } },
  );
  fireEvent.blur(getByPlaceholderText(placeholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(changeSpy.mock.calls[0][0]).toMatch(/contestant email/i);
  expect(changeSpy.mock.calls[0][1]).toBe('{"email":"alex@openlaw.io"}');
});

test('Can call onChangeFunction: bad value should equal undefined', () => {
  const changeSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.change(
    getByPlaceholderText(placeholderTextRegex),
    { target: { value: 'alex@' } },
  );
  fireEvent.blur(getByPlaceholderText(placeholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(changeSpy.mock.calls[0][0]).toMatch(/contestant email/i);
  expect(changeSpy.mock.calls[0][1]).toBe(undefined);
});

test('Can call inputProps: onChange, onBlur', () => {
  const changeSpy = jest.fn();
  const blurSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      inputProps={{
        'Identity': {
          onChange: changeSpy,
          onBlur: blurSpy,
        },
      }}
    />
  );

  fireEvent.change(
    getByPlaceholderText(placeholderTextRegex),
    { target: { value: 'alex@openlaw.io' } },
  );
  fireEvent.blur(getByPlaceholderText(placeholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(blurSpy.mock.calls.length).toBe(1);
});

test('Can show field-level error onBlur with bad value', () => {
  const { getByDisplayValue, getByPlaceholderText, getByText } = render(
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={getValidity}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
      variableType="Identity"
    />
  );

  fireEvent.change(getByPlaceholderText(placeholderTextRegex), { target: { value: 'morgan@' } });
  fireEvent.blur(getByDisplayValue(/morgan@/i));

  getByText(genericErrorMessage);
});

test('Should not show error onBlur (no value)', () => {
  const { getByPlaceholderText, getByText } = render(
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={getValidity}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
      variableType="Identity"
    />
  );

  fireEvent.blur(getByPlaceholderText(placeholderTextRegex));

  expect(() => getByText(`${TYPE_TO_READABLE.Identity}: ${FIELD_DEFAULT_ERROR_MESSAGE}`)).toThrow();
});

test('Should not show error onChange by default', () => {
  const { getByPlaceholderText, getByText } = render(
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={getValidity}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
      variableType="Identity"
    />
  );

  fireEvent.change(getByPlaceholderText(placeholderTextRegex), { target: { value: 'morgan@' } });

  expect(() => getByText(`${TYPE_TO_READABLE.Identity}: ${FIELD_DEFAULT_ERROR_MESSAGE}`)).toThrow();
});

test('Can show generic, field-level error onValidate (change) with bad value', () => {
  const { getByPlaceholderText, getByText } = render(
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={getValidity}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ errorMessage }) => {
        if (errorMessage) {
          return {
            errorMessage,
          };
        }
      }}
      openLaw={Openlaw}
      savedValue=""
      variableType="Identity"
    />
  );

  fireEvent.change(getByPlaceholderText(placeholderTextRegex), { target: { value: 'morgan@' } });

  getByText(genericErrorMessage);
});

test('Can show a user-provided, field-level error onChange with bad value', () => {
  const { getByPlaceholderText, getByText } = render(
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={getValidity}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ isError }) => {
        if (isError) {
          return {
            errorMessage: 'This is a custom error.'
          };
        }
      }}
      openLaw={Openlaw}
      savedValue=""
      variableType="Identity"
    />
  );

  fireEvent.change(getByPlaceholderText(placeholderTextRegex), { target: { value: 'morgan@' } });

  getByText(/this is a custom error/i);
});

test('Should not clear previous error onChange, if value is bad', () => {
  const { getByDisplayValue, getByText, getByPlaceholderText } = render(
    <TestOpenLawFormComponent />
  );

  fireEvent.change(getByPlaceholderText(placeholderTextRegex), { target: { value: 'morgan@' } });
  fireEvent.blur(getByDisplayValue(/morgan@/i));

  getByText(genericErrorMessage);

  fireEvent.change(getByDisplayValue(/morgan@/i), { target: { value: 'morga' } });

  // continue to show error message on the field
  getByText(genericErrorMessage);
});

test('Should not show error message onBlur if user has set empty string for "errorMessage"', () => {
  const { getByDisplayValue, getByPlaceholderText, getByText } = render(
    <TestOpenLawFormComponent
      onValidate={({ elementType, isError }) => {
        if (isError && elementType === 'Identity') {
          return {
            // do not show error
            errorMessage: '',
          };
        }
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(placeholderTextRegex), { target: { value: 'morgan@' } });
  fireEvent.blur(getByDisplayValue(/morgan@/i));

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

  fireEvent.change(getByPlaceholderText(placeholderTextRegex), { target: { value: 'morgan@' } });
  fireEvent.change(getByPlaceholderText(placeholderTextRegex), { target: { value: 'morgan' } });

  // should not show error
  expect(() => getByText(genericErrorMessage)).toThrow();

  fireEvent.blur(getByDisplayValue(/morgan/i));

  // error shows again as normal onBlur
  getByText(genericErrorMessage);
});
