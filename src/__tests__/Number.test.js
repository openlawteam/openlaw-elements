import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { Openlaw } from 'openlaw';

import { NumberInput } from '../NumberInput';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';

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

test('Can render', () => {
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

  getByPlaceholderText(/contestant bbq experience years/i);
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

  getByPlaceholderText(/contestant bbq experience years/i);
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

  getByPlaceholderText(/contestant bbq experience years/i);
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

  getByPlaceholderText(/contestant bbq experience years/i);
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

  fireEvent.change(getByPlaceholderText(/contestant bbq experience years/i), { target: { value: '1e19' } });

  getByPlaceholderText(/contestant bbq experience years/i);
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
      /contestant bbq experience years/i
    ),
    { target: { value: '1000000000000000000' } },
  );

  getByPlaceholderText(/contestant bbq experience years/i);
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
      /contestant bbq experience years/i
    ),
    { target: { value: '-1000000000000000000' } },
  );

  getByPlaceholderText(/contestant bbq experience years/i);
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
      /contestant bbq experience years/i
    ),
    { target: { value: '-0.000000009' } },
  );

  getByPlaceholderText(/contestant bbq experience years/i);
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
      /contestant bbq experience years/i
    ),
    { target: { value: '0.000000009' } },
  );

  getByPlaceholderText(/contestant bbq experience years/i);
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
      /contestant bbq experience years/i
    ),
    { target: { value: '1.09' } },
  );

  getByPlaceholderText(/contestant bbq experience years/i);
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
      /contestant bbq experience years/i
    ),
    { target: { value: '1sdfsdf.09' } },
  );

  getByPlaceholderText(/contestant bbq experience years/i);
  expect(() => getByDisplayValue(/1sdfsdf\.09/i)).toThrow();
});
