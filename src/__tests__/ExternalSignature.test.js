/* eslint-disable react/prop-types, react/display-name */

import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { APIClient, Openlaw } from 'openlaw';

import { ExternalSignature } from '../ExternalSignature';
import { OpenLawForm } from '../OpenLawForm';
import { FIELD_DEFAULT_ERROR_MESSAGE, TYPE_TO_READABLE } from '../constants';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';

const apiClient = new APIClient('');
const getValidity = (name, value) => {
  const v = executedVariables.filter(v => Openlaw.getName(v) === name);
  return Openlaw.checkValidity(v[0], value, executionResult);
};
let parameters;
let compiledTemplate;
let executionResult;
let executedVariables;
let FakeOpenlawComponent;

beforeEach(() => {
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
      getValidity={getValidity}
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
      getValidity={getValidity}
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
      getValidity={getValidity}
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

test('Can call onChangeFunction', () => {
  const changeSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <FakeOpenlawComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.change(
    getByPlaceholderText(/docusign signatory/i),
    { target: { value: 'alex@openlaw.io' } },
  );
  fireEvent.blur(getByPlaceholderText(/docusign signatory/i));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(changeSpy.mock.calls[0][0]).toMatch(/docusign signatory/i);
  expect(changeSpy.mock.calls[0][1]).toBe('{"identity":{"email":"alex@openlaw.io"},"serviceName":""}');
});

test('Can call inputProps: onChange, onBlur', () => {
  const changeSpy = jest.fn();
  const blurSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <FakeOpenlawComponent
      inputProps={{
        'ExternalSignature': {
          onChange: changeSpy,
          onBlur: blurSpy,
        },
      }}
    />
  );

  fireEvent.change(
    getByPlaceholderText(/docusign signatory/i),
    { target: { value: 'alex@openlaw.io' } },
  );
  fireEvent.blur(getByPlaceholderText(/docusign signatory/i));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(blurSpy.mock.calls.length).toBe(1);
});

test('Can show field-level error onBlur with bad value', () => {
  const { getByDisplayValue, getByPlaceholderText, getByText } = render(
    <ExternalSignature
      cleanName="DocuSign-Signatory"
      description="DocuSign Signatory"
      getValidity={getValidity}
      name="DocuSign Signatory"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
      variableType="ExternalSignature"
    />
  );

  fireEvent.change(getByPlaceholderText(/docuSign signatory/i), { target: { value: 'morgan@' } });
  fireEvent.blur(getByDisplayValue(/morgan@/i));

  getByText(`${TYPE_TO_READABLE.Identity}: ${FIELD_DEFAULT_ERROR_MESSAGE}`);
});

test('Should not show error onChange by default', () => {
  const { getByPlaceholderText, getByText } = render(
    <ExternalSignature
      cleanName="DocuSign-Signatory"
      description="DocuSign Signatory"
      getValidity={getValidity}
      name="DocuSign Signatory"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
      variableType="ExternalSignature"
    />
  );

  fireEvent.change(getByPlaceholderText(/docuSign signatory/i), { target: { value: 'morgan@' } });

  expect(() => getByText(`${TYPE_TO_READABLE.Identity}: ${FIELD_DEFAULT_ERROR_MESSAGE}`)).toThrow();
});

test('Can show generic, field-level error onChange with bad value', () => {
  const { getByPlaceholderText, getByText } = render(
    <ExternalSignature
      cleanName="DocuSign-Signatory"
      description="DocuSign Signatory"
      getValidity={getValidity}
      name="DocuSign Signatory"
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
      variableType="ExternalSignature"
    />
  );

  fireEvent.change(getByPlaceholderText(/docuSign signatory/i), { target: { value: 'morgan@' } });

  getByText(`${TYPE_TO_READABLE.Identity}: ${FIELD_DEFAULT_ERROR_MESSAGE}`);
});

test('Can show a user-provided, field-level error onChange with bad value', () => {
  const { getByPlaceholderText, getByText } = render(
    <ExternalSignature
      cleanName="DocuSign-Signatory"
      description="DocuSign Signatory"
      getValidity={getValidity}
      name="DocuSign Signatory"
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
      variableType="ExternalSignature"
    />
  );

  fireEvent.change(getByPlaceholderText(/docuSign signatory/i), { target: { value: 'morgan@' } });

  getByText(/this is a custom error/i);
});
