/* eslint-disable react/prop-types, react/display-name */

import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Openlaw } from 'openlaw';

import { LargeText } from '../LargeText';
import TestOpenLawFormComponent from '../__test_utils__/OpenLawFormComponent';
import { getTemplateExecutionData, getValidity as testGetValidity } from '../__test_utils__/helpers';

const template = '[[Contestant Personal Statement: LargeText "Please write a brief personal statement"]]';
const getValidity = testGetValidity(
  getTemplateExecutionData(template),
);

const placeholderTextRegex = /contestant personal statement/i;
const appPlaceholderTextRegex = /please write a brief personal statement/i;

afterEach(cleanup);

test('Can render Text', () => {
  const { getByPlaceholderText } = render(
    <LargeText
      cleanName="Contestant-Personal-Statement"
      description="Contestant Personal Statement"
      getValidity={getValidity}
      name="Contestant Personal Statement"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  getByPlaceholderText(placeholderTextRegex);
});

test('Can render with savedValue', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <LargeText
      cleanName="Contestant-Personal-Statement"
      description="Contestant Personal Statement"
      getValidity={getValidity}
      name="Contestant Personal Statement"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="This is my personal statement"
    />
  );

  getByPlaceholderText(placeholderTextRegex);
  getByDisplayValue(/this is my personal statement/i);
});

test('Can render user-provided extra text string', () => {
  const { getByText } = render(
    <LargeText
      cleanName="Contestant-Personal-Statement"
      description="Contestant Personal Statement"
      getValidity={getValidity}
      inputExtraText="Contestant Personal Statement extra text"
      name="Contestant Personal Statement"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue=""
    />
  );
  
  getByText(/contestant personal statement extra text/i);
});

test('Can render with savedValue and type another value', () => {
  const { getByDisplayValue, getByPlaceholderText } = render(
    <LargeText
      cleanName="Contestant-Personal-Statement"
      description="Contestant Personal Statement"
      getValidity={getValidity}
      name="Contestant Personal Statement"
      onChange={() => {}}
      onKeyUp={() => {}}
      openLaw={Openlaw}
      savedValue="This is my personal statement"
    />
  );

  getByPlaceholderText(placeholderTextRegex);
  getByDisplayValue(/this is my personal statement/i);

  fireEvent.change(getByDisplayValue(/this is my personal statement/i), { target: { value: 'Morgan Smith' } });
  
  getByDisplayValue(/morgan smith/i);
});

test('Can render with field-level, user-provided error onValidate (change)', () => {
  const { getByPlaceholderText, getByText } = render(
    <LargeText
      cleanName="Contestant-Personal-Statement"
      description="Contestant Personal Statement"
      getValidity={getValidity}
      name="Contestant Personal Statement"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ eventType, value }) => {
        if (value && eventType === 'change') {
          return {
            errorMessage: `Sorry, ${value} is incorrect.`,
          };
        }
      }}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  fireEvent.change(getByPlaceholderText(placeholderTextRegex), { target: { value: 'Hi' } });
  
  getByText(/sorry, hi is incorrect/i);
});

test('Can render with field-level, user-provided error onValidate (blur)', () => {
  const { getByPlaceholderText, getByText } = render(
    <LargeText
      cleanName="Contestant-Personal-Statement"
      description="Contestant Personal Statement"
      getValidity={getValidity}
      name="Contestant Personal Statement"
      onChange={() => {}}
      onKeyUp={() => {}}
      onValidate={({ eventType }) => {
        if (eventType === 'blur') {
          return {
            errorMessage: 'This is a custom blur error',
          };
        }
      }}
      openLaw={Openlaw}
      savedValue=""
    />
  );

  fireEvent.focus(getByPlaceholderText(placeholderTextRegex));
  fireEvent.blur(getByPlaceholderText(placeholderTextRegex));
  
  getByText(/this is a custom blur error/i);
});

test('Can call onChangeFunction', () => {
  const changeSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.change(
    getByPlaceholderText(appPlaceholderTextRegex),
    { target: { value: 'This is my personal statement' } },
  );
  fireEvent.blur(getByPlaceholderText(appPlaceholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(changeSpy.mock.calls[0][0]).toMatch(/contestant personal statement/i);
  expect(changeSpy.mock.calls[0][1]).toMatch(/this is my personal statement/i);
});

test('Can call inputProps: onChange, onBlur', () => {
  const changeSpy = jest.fn();
  const blurSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      inputProps={{
        'LargeText': {
          onChange: changeSpy,
          onBlur: blurSpy,
        },
      }}
    />
  );

  fireEvent.change(
    getByPlaceholderText(appPlaceholderTextRegex),
    { target: { value: 'This is my personal statement' } },
  );
  fireEvent.blur(getByPlaceholderText(appPlaceholderTextRegex));

  expect(changeSpy.mock.calls.length).toBe(1);
  expect(blurSpy.mock.calls.length).toBe(1);
});
