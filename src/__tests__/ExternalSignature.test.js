import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { Openlaw } from 'openlaw';

import { ExternalSignature } from '../ExternalSignature';
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

test('Can render ExternalSignature', () => {
  const { getByPlaceholderText } = render(
    <ExternalSignature
      cleanName="DocuSign Signatory"
      description="DocuSign Signatory"
      getValidity={(name, value) => Openlaw.checkValidity(executedVariables[name], value, executionResult)}
      name="DocuSign Signatory"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  getByPlaceholderText(/docusign signatory/i);
});

test('Can render with savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <ExternalSignature
      cleanName="DocuSign Signatory"
      description="DocuSign Signatory"
      getValidity={(name, value) => {
        const v = executedVariables.filter(v => Openlaw.getName(v) === name);
        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
      name="DocuSign Signatory"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue={'{"identity": {"email": "test@openlaw.io"}, "serviceName": "DocuSign"}'}
    />
  );

  getByPlaceholderText(/docusign signatory/i);
  getByDisplayValue(/test@openlaw\.io/i);
});

test('Can render with savedValue and type another value', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <ExternalSignature
      cleanName="DocuSign Signatory"
      description="DocuSign Signatory"
      getValidity={(name, value) => {
        const v = executedVariables.filter(v => Openlaw.getName(v) === name);
        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
      name="DocuSign Signatory"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue={'{"identity": {"email": "test@openlaw.io"}, "serviceName": "DocuSign"}'}
    />
  );

  getByPlaceholderText(/docusign signatory/i);
  getByDisplayValue(/test@openlaw\.io/i);

  fireEvent.change(getByDisplayValue(/test@openlaw\.io/i), { target: { value: 'testB@openlaw.io' } });
  
  getByDisplayValue(/testB@openlaw\.io/i);
});

test('Can render without bad savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <ExternalSignature
      cleanName="DocuSign Signatory"
      description="DocuSign Signatory"
      getValidity={(name, value) => {
        const v = executedVariables.filter(v => Openlaw.getName(v) === name);
        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
      name="DocuSign Signatory"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue={'{"identity": {"email": "test@openlaw.io"}, "serviceName": "DocuSign"}'}
    />
  );

  getByPlaceholderText(/docusign signatory/i);
  expect(() => getByDisplayValue(/test\.bad@/i)).toThrow();
});
