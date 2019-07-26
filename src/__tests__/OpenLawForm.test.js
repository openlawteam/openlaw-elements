import React, { useState } from 'react';
import {
  cleanup,
  fireEvent,
  render,
  waitForDomChange,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { apiClient, Openlaw } from 'openlaw';

import { OpenLawForm } from '../OpenLawForm';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';

const { Fragment } = React;

const isEveryInputDisabled = () => Array.from(
  document.querySelector('.openlaw-form').querySelectorAll('input, select, textarea')
).every(el => {
  return el.disabled;
});

const isEveryInputEnabled = () => Array.from(
  document.querySelector('.openlaw-form').querySelectorAll('input, select, textarea')
).every(el => {
  return (!el.disabled || el.disabled === false);
});

let parameters;
let compiledTemplate;
let executionResult;
let executedVariables;
let onChange;

beforeEach(() => {
  parameters = {};
  compiledTemplate = Openlaw.compileTemplate(SampleTemplateText).compiledTemplate;
  executionResult = Openlaw.execute(compiledTemplate, {}, parameters).executionResult;
  executedVariables = Openlaw.getExecutedVariables(executionResult, {});
  onChange = () => {};
});

afterEach(cleanup);

test('Can render (simple test)', () => {
  const { getByText } = render(
    <OpenLawForm
      apiClient={apiClient}
      executionResult={executionResult}
      parameters={parameters}
      onChangeFunction={onChange}
      openLaw={Openlaw}
      variables={executedVariables}
    />
  );

  // first section
  getByText(/personal info/i);
  // an input
  getByText(/contestant email/i);
  // last section
  getByText(/miscellaneous/i);
});

test('Can render all types of inputs', () => {
  const { getByText } = render(
    <OpenLawForm
      apiClient={apiClient}
      executionResult={executionResult}
      parameters={parameters}
      onChangeFunction={onChange}
      openLaw={Openlaw}
      variables={executedVariables}
    />
  );

  // Address
  getByText(/mailing address/i);
  // Choice
  getByText(/please choose from the list/i);
  // Date
  getByText(/date of birth/i);
  // Date (Date + Time)
  getByText(/date & time of signature/i);
  // Identity
  getByText(/contestant email/i);
  // Image
  getByText(/select contestant picture/i);
  // LargeText
  getByText(/please write a brief personal statement/i);
  // Number
  getByText(/how many years of bbq experience/i);
  // Text
  getByText(/contestant name/i);
  // YesNo
  getByText(/do you love bbq\?/i);
});

test('Can render with passed inputProps (separate types, e.g. "Address")', () => {
  const inputProps = {
    Address: {
      disabled: true,
    },
    Choice: {
      disabled: true,
    },
    Date: {
      disabled: true,
    },
    Identity: {
      disabled: true,
    },
    Image: {
      disabled: true,
    },
    LargeText: {
      disabled: true,
    },
    Number: {
      disabled: true,
    },
    Text: {
      disabled: true,
    },
    YesNo: {
      disabled: true,
    },
    ExternalSignature: {
      disabled: true,
    },
  };

  render(
    <OpenLawForm
      apiClient={apiClient}
      executionResult={executionResult}
      inputProps={inputProps}
      parameters={parameters}
      onChangeFunction={onChange}
      openLaw={Openlaw}
      variables={executedVariables}
    />
  );

  expect(isEveryInputDisabled()).toBe(true);
});

test('Can render with passed inputProps (all types, e.g. "*")', () => {
  const inputProps = {
    '*': {
      disabled: true,
    },
  };

  render(
    <OpenLawForm
      apiClient={apiClient}
      executionResult={executionResult}
      inputProps={inputProps}
      parameters={parameters}
      onChangeFunction={onChange}
      openLaw={Openlaw}
      variables={executedVariables}
    />
  );

  expect(isEveryInputDisabled()).toBe(true);
});

test('Can render with passed inputProps (merged: all + specific types)', () => {
  const inputProps = {
    '*': {
      disabled: true,
    },
    Address: {
      placeholder: 'Is this thing on?',
    },
  };

  render(
    <OpenLawForm
      apiClient={apiClient}
      executionResult={executionResult}
      inputProps={inputProps}
      parameters={parameters}
      onChangeFunction={onChange}
      openLaw={Openlaw}
      variables={executedVariables}
    />
  );

  const addressElement = document
    .querySelector('.openlaw-form')
    .querySelector('input[placeholder="Is this thing on?"]');

  expect(isEveryInputDisabled()).toBe(true);
  expect(addressElement).toBeTruthy();
});

test('Can toggle passed inputProps (all types, e.g. "*") and expect opposite state when "off"', async () => {
  /**
  * In this test we want to make sure all `disabled={true}`
  * HTML input, select, textarea can be toggled to `disabled={false}`.
  */

  function FakeComponent() {
    const initialInputProps = {
      '*': {
        disabled: true,
      },
    };
    const [inputProps, setInputProps] = useState(initialInputProps);

    return (
      <Fragment>
        <button
          id="start"
          onClick={() => {
            // toggle
            setInputProps({
              '*': {
                disabled: !inputProps['*'].disabled,
              },
            });
          }}
        >
          Start
        </button>
        <OpenLawForm
          apiClient={apiClient}
          executionResult={executionResult}
          inputProps={inputProps}
          parameters={parameters}
          onChangeFunction={onChange}
          openLaw={Openlaw}
          variables={executedVariables}
        />
      </Fragment>
    );
  }

  // render with initial props
  const { container, getByText } = render(<FakeComponent />);

  // every element should be disabled
  expect(isEveryInputDisabled()).toBe(true);

  // fire a click event on the "Start" button
  // to trigger a props change
  fireEvent.click(getByText(/start/i));

  await waitForDomChange({ container });

  // every element should be enabled
  expect(isEveryInputEnabled()).toBe(true);
});
