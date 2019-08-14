import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { APIClient, Openlaw } from 'openlaw';

import { Choice } from '../Choice';
import { OpenLawForm } from '../OpenLawForm';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';

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
let choiceValues;
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
  choiceValues = Openlaw.getChoiceValues(
    executedVariables.filter(v =>
      Openlaw.getName(v) === 'Contestant BBQ Region'
    )[0], executionResult
  );
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
    <Choice
      choiceValues={choiceValues}
      cleanName="Contestant-BBQ-Region"
      description="Contestant BBQ Region"
      getValidity={getValidity}
      name="Contestant BBQ Region"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
      variableType="Choice"
    />
  );

  getByLabelText(/contestant bbq region/i);
});

test('Can render with savedValue', () => {
  const { getByDisplayValue, getByLabelText } = render(
    <Choice
      choiceValues={choiceValues}
      cleanName="Contestant-BBQ-Region"
      description="Contestant BBQ Region"
      getValidity={getValidity}
      name="Contestant BBQ Region"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="Kansas City"
      variableType="Choice"
    />
  );

  getByLabelText(/contestant bbq region/i);
  getByDisplayValue(/kansas city/i);
});

test('Can render with savedValue and select another value', () => {
  const { getByDisplayValue, getByLabelText } = render(
    <Choice
      choiceValues={choiceValues}
      cleanName="Contestant-BBQ-Region"
      description="Contestant BBQ Region"
      getValidity={getValidity}
      name="Contestant BBQ Region"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="Kansas City"
      variableType="Choice"
    />
  );

  getByLabelText(/contestant bbq region/i);
  getByDisplayValue(/kansas city/i);

  fireEvent.change(getByDisplayValue(/kansas city/i), { target: { value: 'Memphis' } });
  
  getByDisplayValue(/memphis/i);
});

test('Should render without bad savedValue', () => {
  const { getByDisplayValue, getByLabelText } = render(
    <Choice
      choiceValues={choiceValues}
      cleanName="Contestant-BBQ-Region"
      description="Contestant BBQ Region"
      getValidity={getValidity}
      name="Contestant BBQ Region"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="Bad, Bad Leroy Brown"
      variableType="Choice"
    />
  );

  getByLabelText(/contestant bbq region/i);
  expect(() => getByDisplayValue(/bad, bad leroy brown/i)).toThrow();
});

test('Can render field-level error message onBlur with savedValue', () => {
  const { getByDisplayValue, getByText } = render(
    <Choice
      choiceValues={choiceValues}
      cleanName="Contestant-BBQ-Region"
      description="Contestant BBQ Region"
      getValidity={getValidity}
      name="Contestant BBQ Region"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="Bad Location"
      variableType="Choice"
    />
  );

  fireEvent.focus(getByDisplayValue(/please choose/i));
  fireEvent.blur(getByDisplayValue(/please choose/i));

  expect(getByText(/something looks incorrect\./i));
});

test('Can render user-provided, field-level error message onValidate (blur)', () => {
  // we can't force <select> to have a value that it doesn't contain,
  // so this test isn't so much to get <Choice> to fail as it is to reliably show
  // a user-provided error via onValidate.

  const { getByDisplayValue, getByText } = render(
    <Choice
      choiceValues={choiceValues}
      cleanName="Contestant-BBQ-Region"
      description="Contestant BBQ Region"
      getValidity={getValidity}
      name="Contestant BBQ Region"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ eventType, value }) => {
        if (eventType === 'blur' && !value) {
          return {
            errorMessage: 'Hey, provide a value!',
          };
        }
      }}
      openLaw={Openlaw}
      savedValue=""
      variableType="Choice"
    />
  );

  fireEvent.focus(getByDisplayValue(/please choose/i));
  fireEvent.blur(getByDisplayValue(/please choose/i));

  expect(getByText(/hey, provide a value!/i));
  expect(() => getByText(/something looks incorrect\./i)).toThrow();
});

test('Can render user-provided, field-level error message onValidate (blur) with savedValue', () => {
  const { getByDisplayValue, getByText } = render(
    <Choice
      choiceValues={choiceValues}
      cleanName="Contestant-BBQ-Region"
      description="Contestant BBQ Region"
      getValidity={getValidity}
      name="Contestant BBQ Region"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ eventType }) => {
        if (eventType === 'blur') {
          return {
            errorMessage: 'This is a custom error.',
          };
        }
      }}
      openLaw={Openlaw}
      savedValue="Bad Location"
      variableType="Choice"
    />
  );

  fireEvent.focus(getByDisplayValue(/please choose/i));
  fireEvent.blur(getByDisplayValue(/please choose/i));

  expect(getByText(/this is a custom error\./i));
  expect(() => getByText(/something looks incorrect\./i)).toThrow();
});

test('Can render user-provided, field-level error message onValidate (change event)', () => {
  // we can't force <select> to have a value that it doesn't contain,
  // so this test isn't so much to get <Choice> to fail as it is to reliably show
  // a user-provided error via onValidate.

  const { getByDisplayValue, getByText } = render(
    <Choice
      choiceValues={choiceValues}
      cleanName="Contestant-BBQ-Region"
      description="Contestant BBQ Region"
      getValidity={getValidity}
      name="Contestant BBQ Region"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ eventType, elementType, value }) => {
        if (eventType === 'change' && elementType === 'Choice' && !value) {
          return {
            errorMessage: 'Looks like that value is bad.',
          };
        }
      }}
      openLaw={Openlaw}
      savedValue=""
      variableType="Choice"
    />
  );

  fireEvent.change(getByDisplayValue(/please choose/i), { target: { value: 'Bad Memphis' } });

  expect(getByText(/looks like that value is bad\./i));
  expect(() => getByText(/something looks incorrect\./i)).toThrow();
});

test('Should not render error message onChange, if blank value.', () => {
  const { getByDisplayValue, getByText } = render(
    <Choice
      choiceValues={choiceValues}
      cleanName="Contestant-BBQ-Region"
      description="Contestant BBQ Region"
      getValidity={getValidity}
      name="Contestant BBQ Region"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
      variableType="Choice"
    />
  );

  fireEvent.change(getByDisplayValue(/please choose/i), { target: { value: '' } });

  expect(() => getByText(/something looks incorrect\./i)).toThrow();
});

test('Can call onChangeFunction', () => {
  const changeSpy = jest.fn();

  const { getByDisplayValue } = render(
    <FakeOpenlawComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.change(getByDisplayValue(/please choose/i), { target: { value: 'Memphis' } });
  fireEvent.blur(getByDisplayValue(/memphis/i));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(changeSpy.mock.calls[0][0]).toMatch(/contestant bbq region/i);
  expect(changeSpy.mock.calls[0][1]).toMatch(/memphis/i);
});

test('Can call inputProps: onChange, onBlur', () => {
  const changeSpy = jest.fn();
  const blurSpy = jest.fn();

  const { getByDisplayValue } = render(
    <FakeOpenlawComponent
      inputProps={{
        'Choice': {
          onChange: changeSpy,
          onBlur: blurSpy,
        },
      }}
    />
  );

  fireEvent.change(getByDisplayValue(/please choose/i), { target: { value: 'Memphis' } });
  fireEvent.blur(getByDisplayValue(/memphis/i));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(blurSpy.mock.calls.length).toBe(1);
});
