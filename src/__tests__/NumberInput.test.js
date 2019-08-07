import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { APIClient, Openlaw } from 'openlaw';

import { NumberInput } from '../NumberInput';
import { OpenLawForm } from '../OpenLawForm';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';
import { FIELD_DEFAULT_ERROR_MESSAGE, TYPE_TO_READABLE } from '../constants';

const numberPlaceholderTextRegex = /contestant bbq experience years/i;
const numberTemplatePlaceholderTextRegex = /how many years of bbq experience do you have\?/i;
const numberErrorTextRegex = `${TYPE_TO_READABLE.Number}: ${FIELD_DEFAULT_ERROR_MESSAGE}`;
const apiClient = new APIClient('');
const FakeOpenlawComponent = props => (
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

test('Can render Number', () => {
  const { getByPlaceholderText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={(name, value) => Openlaw.checkValidity(executedVariables[name], value, executionResult)}
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
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
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
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
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
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
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

test('Can insert "1e19"', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <NumberInput
      cleanName="Contestant-BBQ-Experience-Years"
      description="Contestant BBQ Experience Years"
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
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
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
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
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
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
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
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
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
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
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
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
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
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
    <FakeOpenlawComponent
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
    <FakeOpenlawComponent
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
    <FakeOpenlawComponent
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
    <FakeOpenlawComponent />
  );

  fireEvent.focus(getByPlaceholderText(numberTemplatePlaceholderTextRegex));
  fireEvent.blur(getByPlaceholderText(numberTemplatePlaceholderTextRegex));

  // error message field should not show
  expect(() => getByText(numberErrorTextRegex)).toThrow();
});

test('Should not show error onBlur with valid value', () => {
  const { getByText, getByPlaceholderText } = render(
    <FakeOpenlawComponent />
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
    <FakeOpenlawComponent
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
    <FakeOpenlawComponent
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
