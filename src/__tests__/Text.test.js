import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { Openlaw } from 'openlaw';

import { Text } from '../Text';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';

const getValidity = (name, value) => {
  const v = executedVariables.filter(v =>
    Openlaw.getName(v) === name
  );

  return Openlaw.checkValidity(v[0], value, executionResult);
};

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

test('Can render Text', () => {
  const { getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-Name"
      description="Contestant Name"
      getValidity={getValidity}
      name="Contestant Name"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  getByPlaceholderText(/contestant name/i);
});

test('Can render with savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-Name"
      description="Contestant Name"
      getValidity={getValidity}
      name="Contestant Name"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="Alex Smith"
    />
  );

  getByPlaceholderText(/contestant name/i);
  getByDisplayValue(/alex smith/i);
});

test('Can render with savedValue and type another value', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-Name"
      description="Contestant Name"
      getValidity={getValidity}
      name="Contestant Name"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="Alex Smith"
    />
  );

  getByPlaceholderText(/contestant name/i);
  getByDisplayValue(/alex smith/i);

  fireEvent.change(getByDisplayValue(/alex smith/i), { target: { value: 'Morgan Smith' } });
  
  getByDisplayValue(/morgan smith/i);
});

/**
 * Period
 */

test('Can render with savedValue (Period)', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-Longest-BBQ"
      description="Contestant Longest BBQ"
      getValidity={getValidity}
      name="Contestant Longest BBQ"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="1 week"
    />
  );

  getByPlaceholderText(/contestant longest bbq/i);
  getByDisplayValue(/1 week/i);
});

test('Can render with savedValue and type another value (Period)', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-Longest-BBQ"
      description="Contestant Longest BBQ"
      getValidity={getValidity}
      name="Contestant Longest BBQ"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="1 week"
    />
  );

  getByPlaceholderText(/contestant longest bbq/i);
  getByDisplayValue(/1 week/i);

  fireEvent.change(getByDisplayValue(/1 week/i), { target: { value: '12 months' } });
  
  getByDisplayValue(/12 months/i);
});

test('Can render without bad savedValue (Period)', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-Longest-BBQ"
      description="Contestant Longest BBQ"
      getValidity={getValidity}
      name="Contestant Longest BBQ"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="1 we"
    />
  );

  getByPlaceholderText(/contestant longest bbq/i);
  expect(() => getByDisplayValue(/1 we/i)).toThrow();
});

/**
 * EthAddress
 */

test('Can render with savedValue (EthAddress)', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-ETH-Address"
      description="Contestant ETH Address"
      getValidity={getValidity}
      name="Contestant ETH Address"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="0xc0ffee254729296a45a3885639AC7E10F9d54979"
    />
  );

  getByPlaceholderText(/contestant eth address/i);
  getByDisplayValue(/0xc0ffee254729296a45a3885639AC7E10F9d54979/i);
});

test('Can render with savedValue and type another value (EthAddress)', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-ETH-Address"
      description="Contestant ETH Address"
      getValidity={getValidity}
      name="Contestant ETH Address"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="0xc0ffee254729296a45a3885639AC7E10F9d54979"
    />
  );

  getByPlaceholderText(/contestant eth address/i);
  getByDisplayValue(/0xc0ffee254729296a45a3885639AC7E10F9d54979/i);

  fireEvent.change(getByDisplayValue(/0xc0ffee254729296a45a3885639AC7E10F9d54979/i), { target: { value: '0xd9AAee254729296a45a3885639AC7E10F9d54979' } });
  
  getByDisplayValue(/0xd9AAee254729296a45a3885639AC7E10F9d54979/i);
});

test('Can render without bad savedValue (EthAddress)', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <Text
      cleanName="Contestant-ETH-Address"
      description="Contestant ETH Address"
      getValidity={getValidity}
      name="Contestant ETH Address"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="0xc0ffe"
    />
  );

  getByPlaceholderText(/contestant eth address/i);
  expect(() => getByDisplayValue(/0xc0ffe/i)).toThrow();
});
