import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { Openlaw } from 'openlaw';

import { Choice } from '../Choice';
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
  const { getByLabelText } = render(
    <Choice
      choiceValues={Openlaw.getChoiceValues(
        executedVariables.filter(v =>
          Openlaw.getName(v) === 'Contestant BBQ Region'
        )[0], executionResult)
      }
      cleanName="Contestant-BBQ-Region"
      description="Contestant BBQ Region"
      getValidity={(name, value) => Openlaw.checkValidity(executedVariables[name], value, executionResult)}
      name="Contestant BBQ Region"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  getByLabelText(/contestant bbq region/i);
});

test('Can render with savedValue', () => {
  const { getByDisplayValue, getByLabelText } = render(
    <Choice
      choiceValues={Openlaw.getChoiceValues(
        executedVariables.filter(v =>
          Openlaw.getName(v) === 'Contestant BBQ Region'
        )[0], executionResult)
      }
      cleanName="Contestant-BBQ-Region"
      description="Contestant BBQ Region"
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
      name="Contestant BBQ Region"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="Kansas City"
    />
  );

  getByLabelText(/contestant bbq region/i);
  getByDisplayValue(/kansas city/i);
});

test('Can render with savedValue and select another value', () => {
  const { getByDisplayValue, getByLabelText } = render(
    <Choice
      choiceValues={Openlaw.getChoiceValues(
        executedVariables.filter(v =>
          Openlaw.getName(v) === 'Contestant BBQ Region'
        )[0], executionResult)
      }
      cleanName="Contestant-BBQ-Region"
      description="Contestant BBQ Region"
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
      name="Contestant BBQ Region"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="Kansas City"
    />
  );

  getByLabelText(/contestant bbq region/i);
  getByDisplayValue(/kansas city/i);

  fireEvent.change(getByDisplayValue(/kansas city/i), { target: { value: 'Memphis' } });
  
  getByDisplayValue(/memphis/i);
});

test('Can render without bad savedValue', () => {
  const { getByDisplayValue, getByLabelText } = render(
    <Choice
      choiceValues={Openlaw.getChoiceValues(
        executedVariables.filter(v =>
          Openlaw.getName(v) === 'Contestant BBQ Region'
        )[0], executionResult)
      }
      cleanName="Contestant-BBQ-Region"
      description="Contestant BBQ Region"
      getValidity={(name, value) => {
        const v = executedVariables.filter(v =>
          Openlaw.getName(v) === name
        );

        return Openlaw.checkValidity(v[0], value, executionResult);
      }}
      name="Contestant BBQ Region"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="Bad, Bad Leroy Brown"
    />
  );

  getByLabelText(/contestant bbq region/i);
  expect(() => getByDisplayValue(/bad, bad leroy brown/i)).toThrow();
});
