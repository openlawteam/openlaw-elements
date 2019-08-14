import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';
import {
  cleanup,
  fireEvent,
  render,
  wait,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { APIClient, Openlaw } from 'openlaw';

import { OpenLawForm } from '../OpenLawForm';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';
import externalCallStructures from '../../example/externalCallStructuresHelper.js';

const { Fragment } = React;

const isEveryInputDisabled = () => Array.from(
  document.querySelector('.openlaw-el-form').querySelectorAll('input, select, textarea')
).every(el => {
  return el.disabled;
});

const isEveryInputEnabled = () => Array.from(
  document.querySelector('.openlaw-el-form').querySelectorAll('input, select, textarea')
).every(el => {
  return (!el.disabled || el.disabled === false);
});

const FakeApp = () => {
  const { compiledTemplate } = Openlaw.compileTemplate(SampleTemplateText);
  const { executionResult: initialExecutionResult } = Openlaw.execute(compiledTemplate, {}, {}, externalCallStructures);

  const [ result, setNewResult ] = useState({
    executionResult: initialExecutionResult,
    parameters: {},
    variables: Openlaw.getExecutedVariables(initialExecutionResult, {}),
  });

  const onChange = (key, value, validationResult) => {
    if (validationResult && validationResult.isError) return;

    const concatParameters = { ...result.parameters, [key]: value };
    const { compiledTemplate } = Openlaw.compileTemplate(SampleTemplateText);
    const { executionResult, errorMessage } = Openlaw.execute(compiledTemplate, {}, concatParameters, externalCallStructures);

    if (errorMessage) {
      // eslint-disable-next-line no-undef
      console.error('Openlaw Execution Error:', errorMessage);
      return;
    }

    setNewResult({
      executionResult,
      parameters: concatParameters,
      variables: Openlaw.getExecutedVariables(executionResult, {}),
    });
  };

  const { executionResult, parameters, variables } = result;

  return (
    <OpenLawForm
      apiClient={new APIClient('')}
      executionResult={executionResult}
      parameters={parameters}
      onChangeFunction={(key, value, validationResult) => (
        act(() => onChange(key, value, validationResult))
      )}
      openLaw={Openlaw}
      variables={variables}
    />
  );
};

let apiClient;
let parameters;
let compiledTemplate;
let executionResult;
let executedVariables;
let onChange;

beforeEach(() => {
  apiClient = new APIClient('');
  parameters = {};
  compiledTemplate = Openlaw.compileTemplate(SampleTemplateText).compiledTemplate;
  executionResult = Openlaw.execute(compiledTemplate, {}, parameters, externalCallStructures).executionResult;
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

test('Can render all _types_ of inputs', () => {
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
    DateTime: {
      disabled: true,
    },
    EthAddress: {
      disabled: true,
    },
    ExternalSignature: {
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
    Period: {
      disabled: true,
    },
    Text: {
      disabled: true,
    },
    YesNo: {
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
    .querySelector('.openlaw-el-form')
    .querySelector('input[placeholder="Is this thing on?"]');

  expect(isEveryInputDisabled()).toBe(true);
  expect(addressElement).toBeTruthy();
});

test('Can toggle passed inputProps (all types, e.g. "*") and expect opposite state when "off"', async () => {
  /**
  * In this test we want to make sure all `disabled={true}`
  * HTML input, select, textarea can be toggled to `disabled={false}`.
  */

  const initialInputProps = {
    '*': {
      disabled: true,
    },
  };

  function FakeComponent() {
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
  const { getByText } = render(<FakeComponent />);

  // every element should be disabled
  expect(isEveryInputDisabled()).toBe(true);

  // fire a click event on the "Start" button
  // to trigger a props change
  fireEvent.click(getByText(/start/i));

  // every element should be enabled
  await wait(() => expect(isEveryInputEnabled()).toBe(true));
});

test('Can surface error through onValidate (Period)', () => {
  /**
  * In this test we want to make sure onValidate can be called
  * with an error object when an input data validation
  * error (or other input-level `Error`) occurs.
  */

  function FakeComponent() {
    const [notification, setNotification] = useState('');
    
    const onValidate = ({ errorMessage }) => {
      if (errorMessage) {
        setNotification('Please correct the form errors.');
      }
    };

    return (
      <Fragment>
        <div data-testid="notification">{notification}</div>

        <OpenLawForm
          apiClient={apiClient}
          executionResult={executionResult}
          onValidate={onValidate}
          parameters={parameters}
          onChangeFunction={onChange}
          openLaw={Openlaw}
          variables={executedVariables}
        />
      </Fragment>
    );
  }

  // render with initial props
  const { getByText, getByLabelText, getByTestId } = render(<FakeComponent />);

  expect(getByTestId('notification').textContent).toBe('');

  fireEvent.change(getByLabelText(/what is the longest bbq you ever conducted/i), { target: { value: '1 wee' } });
  fireEvent.blur(getByLabelText(/what is the longest bbq you ever conducted/i));

  // general form error should be shown
  getByText(/please correct the form errors\./i);
  // specific, internal form error should be shown
  getByText(/period of time: something looks incorrect\./i);
});

test('Can render & toggle conditional field', () => {
  const { getByPlaceholderText } = render(
    <FakeApp />
  );

  expect(() => getByPlaceholderText(/please explain your bbq sauce medical history/i)).toThrow();

  const yes = document.querySelector('.Contestant-BBQ-Medical[value="true"]');
  const no = document.querySelector('.Contestant-BBQ-Medical[value="false"]');

  // show conditional field
  fireEvent.click(yes);

  getByPlaceholderText(/please explain your bbq sauce medical history/i);

  // hide conditional field
  fireEvent.click(no);
  
  // field should not show
  expect(() => getByPlaceholderText(/please explain your bbq sauce medical history/i)).toThrow();
});
