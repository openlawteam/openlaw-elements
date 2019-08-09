import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  wait,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { APIClient, Openlaw } from 'openlaw';

import { YesNo } from '../YesNo';
import { OpenLawForm } from '../OpenLawForm';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';
import { CSS_CLASS_NAMES } from '../constants';

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
let compiledTemplate;
let executionResult;
let executedVariables;
let getValidity;
let parameters;

beforeEach(() => {
  parameters = {};
  compiledTemplate = Openlaw.compileTemplate(SampleTemplateText).compiledTemplate;
  executionResult = Openlaw.execute(compiledTemplate, {}, parameters).executionResult;
  executedVariables = Openlaw.getExecutedVariables(executionResult, {});
  getValidity = (name, value) => {
    const v = executedVariables.filter(v =>
      Openlaw.getName(v) === name
    );

    return Openlaw.checkValidity(v[0], value, executionResult);
  };
});

afterEach(cleanup);

test('Can render Choice', () => {
  const { getByLabelText } = render(
    <YesNo
      cleanName="BBQ-Love-Limit"
      description="BBQ Love Limit"
      getValidity={getValidity}
      name="BBQ Love Limit"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
      variableType="YesNo"
    />
  );

  getByLabelText(/bbq love limit/i);
});

test('Can render with "true" savedValue', async () => {
  const { getByLabelText } = render(
    <YesNo
      cleanName="BBQ-Love-Limit"
      description="BBQ Love Limit"
      getValidity={getValidity}
      name="BBQ Love Limit"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="true"
      variableType="YesNo"
    />
  );

  getByLabelText(/bbq love limit/i);
  
  // wait for setTimeout in componentDidMount
  await wait(() => {
    expect(document.querySelector('input[value="true"]').checked).toBe(true);
  });
});

test('Can render with "false" savedValue', async () => {
  const { getByLabelText } = render(
    <YesNo
      cleanName="BBQ-Love-Limit"
      description="BBQ Love Limit"
      getValidity={getValidity}
      name="BBQ Love Limit"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="false"
      variableType="YesNo"
    />
  );

  getByLabelText(/bbq love limit/i);

  // wait for setTimeout in componentDidMount
  await wait(() => {
    expect(document.querySelector('input[value="false"]').checked).toBe(true);
  });
});

test('Can render with savedValue and select another value', async () => {
  const { getByLabelText } = render(
    <YesNo
      cleanName="BBQ-Love-Limit"
      description="BBQ Love Limit"
      getValidity={getValidity}
      name="BBQ Love Limit"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="false"
      variableType="YesNo"
    />
  );

  // wait for setTimeout in componentDidMount
  await wait(() => {
    expect(document.querySelector('input[value="false"]').checked).toBe(true);
  });

  fireEvent.click(getByLabelText(/yes/i));
  
  expect(document.querySelector('input[value="true"]').checked).toBe(true);
});

test('Should render without bad savedValue', () => {
  render(
    <YesNo
      cleanName="BBQ-Love-Limit"
      description="BBQ Love Limit"
      getValidity={getValidity}
      name="BBQ Love Limit"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="bad bad bad"
      variableType="YesNo"
    />
  );

  expect(document.querySelector('input[value="true"]').checked).toBe(false);
  expect(document.querySelector('input[value="false"]').checked).toBe(false);
});

test('Can render user-provided, field-level error message onValidate (blur)', () => {
  const { getByText } = render(
    <YesNo
      cleanName="BBQ-Love-Limit"
      description="BBQ Love Limit"
      getValidity={getValidity}
      name="BBQ Love Limit"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ eventType }) => {
        if (eventType === 'blur') {
          return {
            errorMessage: 'This is a custom blur message',
          };
        }
      }}
      openLaw={Openlaw}
      savedValue=""
      variableType="YesNo"
    />
  );

  const yesRadio = document.querySelector('input[value="true"]');

  fireEvent.focus(yesRadio);
  fireEvent.blur(yesRadio);

  expect(getByText(/this is a custom blur message/i));
});

test('Can render user-provided, field-level error message onValidate (blur) with savedValue', () => {
  const { getByText } = render(
    <YesNo
      cleanName="BBQ-Love-Limit"
      description="BBQ Love Limit"
      getValidity={getValidity}
      name="BBQ Love Limit"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ eventType }) => {
        if (eventType === 'blur') {
          return {
            errorMessage: 'This is a custom blur message',
          };
        }
      }}
      openLaw={Openlaw}
      savedValue="true"
      variableType="YesNo"
    />
  );

  const yesRadio = document.querySelector('input[value="true"]');

  fireEvent.focus(yesRadio);
  fireEvent.blur(yesRadio);

  expect(getByText(/this is a custom blur message/i));
});

test('Can render user-provided, field-level error message onValidate (change event)', () => {
  const { getByText } = render(
    <YesNo
      cleanName="BBQ-Love-Limit"
      description="BBQ Love Limit"
      getValidity={getValidity}
      name="BBQ Love Limit"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ eventType }) => {
        if (eventType === 'change') {
          return {
            errorMessage: 'This is a custom change message',
          };
        }
      }}
      openLaw={Openlaw}
      savedValue=""
      variableType="YesNo"
    />
  );

  fireEvent.click(document.querySelector('input[value="false"]'));

  expect(getByText(/this is a custom change message/i));
});

test('Should hide error if blank, user-provided error message onValidate (change)', () => {
  render(
    <YesNo
      cleanName="BBQ-Love-Limit"
      description="BBQ Love Limit"
      getValidity={getValidity}
      name="BBQ Love Limit"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ eventType }) => {
        if (eventType === 'change') {
          return {
            errorMessage: '',
          };
        }
      }}
      openLaw={Openlaw}
      savedValue=""
      variableType="YesNo"
    />
  );

  fireEvent.click(document.querySelector('input[value="false"]'));

  expect(document.querySelector(`.${CSS_CLASS_NAMES.fieldErrorMessage}`)).toBeNull();
});

test('Should hide error if blank, user-provided error message onValidate (blur)', () => {
  render(
    <YesNo
      cleanName="BBQ-Love-Limit"
      description="BBQ Love Limit"
      getValidity={getValidity}
      name="BBQ Love Limit"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ eventType }) => {
        if (eventType === 'blur') {
          return {
            errorMessage: '',
          };
        }
      }}
      openLaw={Openlaw}
      savedValue=""
      variableType="YesNo"
    />
  );

  fireEvent.focus(document.querySelector('input[value="true"]'));
  fireEvent.blur(document.querySelector('input[value="true"]'));

  expect(document.querySelector(`.${CSS_CLASS_NAMES.fieldErrorMessage}`)).toBeNull();
});

test('Can call onChangeFunction', () => {
  const changeSpy = jest.fn();

  render(
    <FakeOpenlawComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.click(document.querySelector('input[value="true"].BBQ-Love-Limit'));

  expect(changeSpy.mock.calls[0][0]).toMatch(/bbq love limit/i);
  expect(changeSpy.mock.calls[0][1]).toMatch(/true/i);
  
  fireEvent.click(document.querySelector('input[value="false"].BBQ-Love-Limit'));

  expect(changeSpy.mock.calls[1][0]).toMatch(/bbq love limit/i);
  expect(changeSpy.mock.calls[1][1]).toMatch(/false/i);
});

test('Can call inputProps: onChange, onBlur', () => {
  const changeSpy = jest.fn();
  const blurSpy = jest.fn();

  render(
    <FakeOpenlawComponent
      inputProps={{
        'YesNo': {
          onChange: changeSpy,
          onBlur: blurSpy,
        },
      }}
    />
  );

  fireEvent.click(document.querySelector('input[value="true"].BBQ-Love-Limit'));
  fireEvent.blur(document.querySelector('input[value="true"].BBQ-Love-Limit'));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(blurSpy.mock.calls.length).toBe(1);
});
