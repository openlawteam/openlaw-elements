import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Openlaw } from 'openlaw';

import { NumberInput } from '../NumberInput';
import { FIELD_DEFAULT_ERROR_MESSAGE, TYPE_TO_READABLE } from '../constants';
import TestOpenLawFormComponent from '../__test_utils__/OpenLawFormComponent';
import { getTemplateExecutionData, getValidity as testGetValidity } from '../__test_utils__/helpers';

const template = '[[Contestant BBQ Experience Years: Number "How many years of BBQ experience do you have?"]]';
const getValidity = testGetValidity(
  getTemplateExecutionData(template),
);

const numberPlaceholderTextRegex = /contestant bbq experience years/i;
const numberTemplatePlaceholderTextRegex = /how many years of bbq experience do you have\?/i;
const numberErrorTextRegex = `${TYPE_TO_READABLE.Number}: ${FIELD_DEFAULT_ERROR_MESSAGE}`;

afterEach(cleanup);

test('Can render Number', () => {
  const { getByPlaceholderText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={getValidity}
      name="Contestant BBQ Experience Years"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  getByPlaceholderText(numberPlaceholderTextRegex);
});

test('Can render with savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={getValidity}
      name="Contestant BBQ Experience Years"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="1200000000"
    />
  );

  getByPlaceholderText(numberPlaceholderTextRegex);
  getByDisplayValue(/1200000000/i);
});

test('Can render with savedValue and type another value', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={getValidity}
      name="Contestant BBQ Experience Years"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="1200000000"
    />
  );

  getByPlaceholderText(numberPlaceholderTextRegex);
  getByDisplayValue(/1200000000/i);

  fireEvent.change(getByDisplayValue(/1200000000/i), { target: { value: '12' } });
  
  getByDisplayValue(/12/i);
});

test('Can render without bad savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={getValidity}
      name="Contestant BBQ Experience Years"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="-1f"
    />
  );

  getByPlaceholderText(numberPlaceholderTextRegex);
  expect(() => getByDisplayValue(/-1f/i)).toThrow();
});

test('Can render user-provided extra text string', () => {
  const { getByText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={getValidity}
      inputExtraText="Contestant BBQ Experience Years extra text"
      name="Contestant BBQ Experience Years"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );
  
  getByText(/contestant bbq experience years extra text/i);
});

test('Can insert "1e19"', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={getValidity}
      name="Contestant BBQ Experience Years"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  fireEvent.change(getByPlaceholderText(numberPlaceholderTextRegex), { target: { value: '1e19' } });

  getByPlaceholderText(numberPlaceholderTextRegex);
  getByDisplayValue(/1e19/i);
});

test('Can insert "1,000,000,000,000,000,000"', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={getValidity}
      name="Contestant BBQ Experience Years"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  fireEvent.change(
    getByPlaceholderText(
      numberPlaceholderTextRegex
    ),
    { target: { value: '1000000000000000000' } },
  );

  getByPlaceholderText(numberPlaceholderTextRegex);
  getByDisplayValue(/1000000000000000000/i);
});

test('Can insert "-1,000,000,000,000,000,000"', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={getValidity}
      name="Contestant BBQ Experience Years"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  fireEvent.change(
    getByPlaceholderText(
      numberPlaceholderTextRegex
    ),
    { target: { value: '-1000000000000000000' } },
  );

  getByPlaceholderText(numberPlaceholderTextRegex);
  getByDisplayValue(/-1000000000000000000/i);
});

test('Can insert "-0.000000009"', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={getValidity}
      name="Contestant BBQ Experience Years"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  fireEvent.change(
    getByPlaceholderText(
      numberPlaceholderTextRegex
    ),
    { target: { value: '-0.000000009' } },
  );

  getByPlaceholderText(numberPlaceholderTextRegex);
  getByDisplayValue(/-0\.000000009/i);
});

test('Can insert "0.000000009"', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={getValidity}
      name="Contestant BBQ Experience Years"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  fireEvent.change(
    getByPlaceholderText(
      numberPlaceholderTextRegex
    ),
    { target: { value: '0.000000009' } },
  );

  getByPlaceholderText(numberPlaceholderTextRegex);
  getByDisplayValue(/0\.000000009/i);
});

test('Can insert "1.09"', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={getValidity}
      name="Contestant BBQ Experience Years"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  fireEvent.change(
    getByPlaceholderText(
      numberPlaceholderTextRegex
    ),
    { target: { value: '1.09' } },
  );

  getByPlaceholderText(numberPlaceholderTextRegex);
  getByDisplayValue(/1\.09/i);
});

test('Cannot insert "1sdfsdf.09"', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={getValidity}
      name="Contestant BBQ Experience Years"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  fireEvent.change(
    getByPlaceholderText(
      numberPlaceholderTextRegex
    ),
    { target: { value: '1sdfsdf.09' } },
  );

  getByPlaceholderText(numberPlaceholderTextRegex);
  expect(() => getByDisplayValue(/1sdfsdf\.09/i)).toThrow();
});

test('Can call onChangeFunction', () => {
  const changeSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.change(
    getByPlaceholderText(numberTemplatePlaceholderTextRegex),
    { target: { value: '1.09' } },
  );
  fireEvent.blur(getByPlaceholderText(numberTemplatePlaceholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(changeSpy.mock.calls[0][0]).toMatch(numberPlaceholderTextRegex);
  expect(changeSpy.mock.calls[0][1]).toMatch(/1\.09/i);
});

test('Can call inputProps: onChange, onBlur', () => {
  const changeSpy = jest.fn();
  const blurSpy = jest.fn();

  const { getByDisplayValue, getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      inputProps={{
        'Number': {
          onChange: changeSpy,
          onBlur: blurSpy,
        },
      }}
    />
  );

  fireEvent.change(
    getByPlaceholderText(numberTemplatePlaceholderTextRegex),
    { target: { value: '1.09' } },
  );
  fireEvent.blur(getByDisplayValue(/1\.09/i));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(blurSpy.mock.calls.length).toBe(1);
});

/**
 * onBlur
 */

test('Can show field-level, user-provided error onValidate (blur)', () => {
  const { getByText, getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      onValidate={({ eventType }) => {
        if (eventType === 'blur') {
          return {
            errorMessage: 'This is a custom Number error',
          };
        }
      }}
    />
  );

  fireEvent.blur(getByPlaceholderText(numberTemplatePlaceholderTextRegex));

  // error message field
  getByText(/this is a custom number error/i);
});

test('Should not show error onBlur with no content', () => {
  const { getByText, getByPlaceholderText } = render(
    <TestOpenLawFormComponent />
  );

  fireEvent.focus(getByPlaceholderText(numberTemplatePlaceholderTextRegex));
  fireEvent.blur(getByPlaceholderText(numberTemplatePlaceholderTextRegex));

  // error message field should not show
  expect(() => getByText(numberErrorTextRegex)).toThrow();
});

test('Should not show error onBlur with valid value', () => {
  const { getByText, getByPlaceholderText } = render(
    <TestOpenLawFormComponent />
  );

  fireEvent.change(getByPlaceholderText(numberTemplatePlaceholderTextRegex), { target: { value: '123' } });
  fireEvent.blur(getByPlaceholderText(numberTemplatePlaceholderTextRegex));

  // error message field should not show
  expect(() => getByText(numberErrorTextRegex)).toThrow();
});

/**
 * onChange
 */

test('Can show field-level, user-provided error onValidate (change)', () => {
  const { getByText, getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      onValidate={({ eventType }) => {
        if (eventType === 'change') {
          return {
            errorMessage: 'This is a custom number error',
          };
        }
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(numberTemplatePlaceholderTextRegex), { target: { value: '123' } });

  // error message field
  getByText(/this is a custom number error/i);
});

test('Should not show error onChange with valid value', () => {
  const { getByText, getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      onValidate={({ eventType }) => {
        if (eventType === 'change') {
          return {
            errorMessage: 'This is a custom number error',
          };
        }
      }}
    />
  );

  fireEvent.change(getByPlaceholderText(numberTemplatePlaceholderTextRegex), { target: { value: '123' } });

  // error message field should not show
  expect(() => getByText(numberErrorTextRegex)).toThrow();
});
