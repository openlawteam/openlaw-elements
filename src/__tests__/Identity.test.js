import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { Openlaw } from 'openlaw';

import { Identity } from '../Identity';
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
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={(name, value) => Openlaw.checkValidity(executedVariables[name], value, executionResult)}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  getByPlaceholderText(/contestant email/i);
});

test('Can render with savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue={'{"email": "alex@openlaw.io"}'}
    />
  );

  getByPlaceholderText(/contestant email/i);
  getByDisplayValue(/alex@openlaw\.io/i);
});

test('Can render with savedValue and type another value', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue={'{"email": "alex@openlaw.io"}'}
    />
  );

  getByPlaceholderText(/contestant email/i);
  getByDisplayValue(/alex@openlaw\.io/i);

  fireEvent.change(getByDisplayValue(/alex@openlaw\.io/i), { target: { value: 'morgan@openlaw.io' } });
  
  getByDisplayValue(/morgan@openlaw\.io/i);
});

test('Can render without bad savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Identity
      cleanName="Contestant-Email"
      description="Contestant Email"
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
      name="Contestant Email"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue={'{"email": "alex.bad@"}'}
    />
  );

  getByPlaceholderText(/contestant email/i);
  expect(() => getByDisplayValue(/alex\.bad@/i)).toThrow();
});
