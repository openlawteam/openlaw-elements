/* eslint-disable react/prop-types, react/display-name */

import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { Openlaw } from 'openlaw';

import { DatePicker } from '../DatePicker';
import { FIELD_DEFAULT_ERROR_MESSAGE, TYPE_TO_READABLE } from '../constants';
import SampleTemplateText from '../../example/SAMPLE_TEMPLATE';

const genericDateErrorMessage = `${TYPE_TO_READABLE.Date}: ${FIELD_DEFAULT_ERROR_MESSAGE}`;
const genericDateTimeErrorMessage = `${TYPE_TO_READABLE.DateTime}: ${FIELD_DEFAULT_ERROR_MESSAGE}`;
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

/**
 * DATE
 */

describe('Date type', () => {
  test('Can render', () => {
    const { getByLabelText } = render(
      <DatePicker
        cleanName="Contestant-DOB"
        description="Date of Birth"
        getValidity={getValidity}
        name="Contestant DOB"
        onChange={() => {}}
        onKeyUp={() => {}}
        savedValue=""
        variableType="Date"
      />
    );

    getByLabelText(/date of birth/i);
  });

  test('Can render with savedValue', () => {
    const { getByLabelText, getByDisplayValue } = render(
      <DatePicker
        cleanName="Contestant-DOB"
        description="Date of Birth"
        getValidity={getValidity}
        name="Contestant DOB"
        onChange={() => {}}
        onKeyUp={() => {}}
        savedValue="441738000000"
        variableType="Date"
      />
    );

    getByLabelText(/date of birth/i);
    getByDisplayValue(/january 1, 1984/i);
  });

  test('Can select a date', () => {
    const { getByDisplayValue, getByPlaceholderText } = render(
      <DatePicker
        cleanName="Contestant-DOB"
        description="Date of Birth"
        getValidity={getValidity}
        name="Contestant DOB"
        onChange={() => {}}
        onKeyUp={() => {}}
        savedValue="441738000000"
        variableType="Date"
      />
    );
    
    const flatpickrEnabledInput = getByPlaceholderText(/date of birth/i);
    
    // open flatpickr
    fireEvent.focus(flatpickrEnabledInput);

    // click on a day
    fireEvent.mouseDown(document.querySelector('span[aria-label="January 3, 1984"]'),
      {
        which: 1,
      },
    );

    expect(document.querySelector('span[aria-label="January 3, 1984"].selected')).not.toBeNull();
    getByDisplayValue('January 3, 1984');
  });
  
  test('Can press backspace to clear input', () => {
    const { getAllByDisplayValue , getByPlaceholderText } = render(
      <DatePicker
        cleanName="Contestant-DOB"
        description="Date of Birth"
        getValidity={getValidity}
        name="Contestant DOB"
        onChange={() => {}}
        onKeyUp={() => {}}
        savedValue="441738000000"
        variableType="Date"
      />
    );
    
    const flatpickrEnabledInput = getByPlaceholderText(/date of birth/i);

    fireEvent.focus(flatpickrEnabledInput);
    fireEvent.keyDown(flatpickrEnabledInput, { key: 'Backspace', keyCode: 8 });
    expect(() => getAllByDisplayValue(/january 1, 1984/i)).toThrow();
  });

  test('Can call onChangeFunction', () => {
    const changeSpy = jest.fn();

    const { getByPlaceholderText } = render(
      <DatePicker
        cleanName="Contestant-DOB"
        description="Date of Birth"
        getValidity={getValidity}
        name="Contestant DOB"
        onChange={changeSpy}
        onKeyUp={() => {}}
        savedValue="441738000000"
        variableType="Date"
      />
    );
    
    const flatpickrEnabledInput = getByPlaceholderText(/date of birth/i);
    
    // open flatpickr
    fireEvent.focus(flatpickrEnabledInput);

    // click on a day
    fireEvent.mouseDown(document.querySelector('span[aria-label="January 3, 1984"]'),
      {
        which: 1,
      },
    );

    expect(changeSpy.mock.calls.length).toBe(1);
    expect(changeSpy.mock.calls[0][0]).toMatch(/Contestant DOB/i);
    expect(changeSpy.mock.calls[0][1]).toBe('441910800000');  
    expect(changeSpy.mock.calls[0][2].errorMessage).toBe('');  
    expect(changeSpy.mock.calls[0][2].isError).toBe(false);
  });

  test('Can validate a date', () => {
    const { getByText, getByPlaceholderText } = render(
      <DatePicker
        cleanName="Contestant-DOB"
        description="Date of Birth"
        getValidity={getValidity}
        name="Contestant DOB"
        onChange={() => {}}
        onKeyUp={() => {}}
        savedValue="441738000000"
        variableType="Date"
      />
    );

    const flatpickrEnabledInput = getByPlaceholderText(/date of birth/i);
    
    // open flatpickr
    fireEvent.focus(flatpickrEnabledInput);

    // click on a day
    fireEvent.mouseDown(document.querySelector('span[aria-label="January 3, 1984"]'),
      {
        which: 1,
      },
    );

    expect(() => getByText(genericDateErrorMessage)).toThrow();
  });

  test('Can validate date and render user-provided error message', () => {
    const { getByText, getByPlaceholderText } = render(
      <DatePicker
        cleanName="Contestant-DOB"
        description="Date of Birth"
        getValidity={getValidity}
        name="Contestant DOB"
        onChange={() => {}}
        onKeyUp={() => {}}
        onValidate={() => {
          return {
            errorMessage: 'This is a custom Date error.',
          };
        }}
        savedValue="441738000000"
        variableType="Date"
      />
    );

    const flatpickrEnabledInput = getByPlaceholderText(/date of birth/i);
    
    // open flatpickr
    fireEvent.focus(flatpickrEnabledInput);

    // click on a day
    fireEvent.mouseDown(document.querySelector('span[aria-label="January 3, 1984"]'),
      {
        which: 1,
      },
    );

    getByText(/this is a custom date error/i);
  });

  test('Can call user-provided onValidate', () => {
    const validateSpy = jest.fn();

    const { getByPlaceholderText } = render(
      <DatePicker
        cleanName="Contestant-DOB"
        description="Date of Birth"
        getValidity={getValidity}
        name="Contestant DOB"
        onChange={() => {}}
        onKeyUp={() => {}}
        onValidate={validateSpy}
        savedValue="441738000000"
        variableType="Date"
      />
    );

    const flatpickrEnabledInput = getByPlaceholderText(/date of birth/i);
    
    // open flatpickr
    fireEvent.focus(flatpickrEnabledInput);

    // click on a day
    fireEvent.mouseDown(document.querySelector('span[aria-label="January 3, 1984"]'),
      {
        which: 1,
      },
    );

    expect(validateSpy.mock.calls[0][0]).toStrictEqual({
      elementName: 'Contestant-DOB',
      elementType: 'Date',
      errorMessage: '',
      eventType: 'change',
      isError: false,
      value: '441910800000',
    });

    expect(validateSpy.mock.calls[1][0]).toStrictEqual({
      elementName: 'Contestant-DOB',
      elementType: 'Date',
      errorMessage: '',
      eventType: 'blur',
      isError: false,
      value: '441910800000',
    });
  });
});

/**
 * DATE & TIME
 */

describe('DateTime type', () => {
  test('Can render', () => {
    const { getByPlaceholderText } = render(
      <DatePicker
        cleanName="Contestant-Signature-Date-Time"
        description="Date & Time of Signature"
        getValidity={getValidity}
        name="Contestant Signature Date Time"
        onChange={() => {}}
        onKeyUp={() => {}}
        savedValue=""
        variableType="DateTime"
      />
    );

    getByPlaceholderText(/date & time of signature/i);
  });

  test('Can render with savedValue', () => {
    const { getByDisplayValue, getByLabelText } = render(
      <DatePicker
        cleanName="Contestant-Signature-Date-Time"
        description="Date & Time of Signature"
        getValidity={getValidity}
        name="Contestant Signature Date Time"
        onChange={() => {}}
        onKeyUp={() => {}}
        savedValue="441738000000"
        variableType="DateTime"
      />
    );

    getByLabelText(/date & time of signature/i);
    
    getByDisplayValue(/january 1, 1984/i);
  });

  test('Can select a date with time', () => {
    const { getByDisplayValue, getByPlaceholderText } = render(
      <DatePicker
        cleanName="Contestant-Signature-Date-Time"
        description="Date & Time of Signature"
        getValidity={getValidity}
        name="Contestant Signature Date Time"
        onChange={() => {}}
        onKeyUp={() => {}}
        savedValue="441738000000"
        variableType="DateTime"
      />
    );

    const flatpickrEnabledInput = getByPlaceholderText(/date & time of signature/i);
    
    // open flatpickr
    fireEvent.focus(flatpickrEnabledInput);

    // click on a day
    fireEvent.mouseDown(document.querySelector('span[aria-label="January 3, 1984"]'),
      {
        which: 1,
      },
    );

    // take focus away
    fireEvent.focus(document.body);

    expect(document.querySelector('span[aria-label="January 3, 1984"].selected')).not.toBeNull();
    getByDisplayValue('January 3, 1984 12:00 AM');
  });

  test('Can press backspace to clear input', () => {
    const { getByDisplayValue, getByPlaceholderText } = render(
      <DatePicker
        cleanName="Contestant-Signature-Date-Time"
        description="Date & Time of Signature"
        getValidity={getValidity}
        name="Contestant Signature Date Time"
        onChange={() => {}}
        onKeyUp={() => {}}
        savedValue="441738000000"
        variableType="DateTime"
      />
    );
    
    const flatpickrEnabledInput = getByPlaceholderText(/date & time of signature/i);
    
    fireEvent.focus(flatpickrEnabledInput);
    fireEvent.keyDown(flatpickrEnabledInput, { key: 'Backspace', keyCode: 8 });
    // take focus away
    fireEvent.focus(document.body);

    expect(() => getByDisplayValue(/january 1, 1984/i)).toThrow();
  });

  test('Can call onChangeFunction', async () => {
    const changeSpy = jest.fn();

    const { getByPlaceholderText } = render(
      <DatePicker
        cleanName="Contestant-Signature-Date-Time"
        description="Date & Time of Signature"
        getValidity={getValidity}
        name="Contestant Signature Date Time"
        onChange={changeSpy}
        onKeyUp={() => {}}
        savedValue="441738000000"
        variableType="DateTime"
      />
    );

    const flatpickrEnabledInput = getByPlaceholderText(/date & time of signature/i);
    
    // open flatpickr
    fireEvent.focus(flatpickrEnabledInput);

    // click on a day
    fireEvent.mouseDown(document.querySelector('span[aria-label="January 3, 1984"]'),
      {
        which: 1,
      },
    );
  
    // take focus away
    fireEvent.focus(document.body);

    expect(changeSpy.mock.calls[0][0]).toMatch(/Contestant Signature Date Time/i);
    expect(changeSpy.mock.calls[0][1]).toBe('441910800000');  
    expect(changeSpy.mock.calls[0][2].errorMessage).toBe('');  
    expect(changeSpy.mock.calls[0][2].isError).toBe(false);  
  });

  test('Can validate a date & time', () => {
    const { getByPlaceholderText, getByText } = render(
      <DatePicker
        cleanName="Contestant-Signature-Date-Time"
        description="Date & Time of Signature"
        getValidity={getValidity}
        name="Contestant Signature Date Time"
        onChange={() => {}}
        onKeyUp={() => {}}
        savedValue="441738000000"
        variableType="DateTime"
      />
    );

    const flatpickrEnabledInput = getByPlaceholderText(/date & time of signature/i);
    
    // open flatpickr
    fireEvent.focus(flatpickrEnabledInput);

    // click on a day
    fireEvent.mouseDown(document.querySelector('span[aria-label="January 3, 1984"]'),
      {
        which: 1,
      },
    );

    // take focus away
    fireEvent.focus(document.body);

    expect(() => getByText(genericDateTimeErrorMessage)).toThrow();
  });

  test('Can validate date & time and render user-provided error message', () => {
    const { getByPlaceholderText, getByText } = render(
      <DatePicker
        cleanName="Contestant-Signature-Date-Time"
        description="Date & Time of Signature"
        getValidity={getValidity}
        name="Contestant Signature Date Time"
        onChange={() => {}}
        onKeyUp={() => {}}
        onValidate={() => {
          return {
            errorMessage: 'This is a custom DateTime error.',
          };
        }}
        savedValue="441738000000"
        variableType="DateTime"
      />
    );

    const flatpickrEnabledInput = getByPlaceholderText(/date & time of signature/i);
    
    // open flatpickr
    fireEvent.focus(flatpickrEnabledInput);

    // click on a day
    fireEvent.mouseDown(document.querySelector('span[aria-label="January 3, 1984"]'),
      {
        which: 1,
      },
    );

    getByText(/this is a custom datetime error/i);
  });

  test('Can call user-provided onValidate', () => {
    const validateSpy = jest.fn();

    const { getByPlaceholderText } = render(
      <DatePicker
        cleanName="Contestant-Signature-Date-Time"
        description="Date & Time of Signature"
        getValidity={getValidity}
        name="Contestant Signature Date Time"
        onChange={() => {}}
        onKeyUp={() => {}}
        onValidate={validateSpy}
        savedValue="441738000000"
        variableType="DateTime"
      />
    );

    const flatpickrEnabledInput = getByPlaceholderText(/date & time of signature/i);
    
    // open flatpickr
    fireEvent.focus(flatpickrEnabledInput);

    // click on a day
    fireEvent.mouseDown(document.querySelector('span[aria-label="January 3, 1984"]'),
      {
        which: 1,
      },
    );
  
    // take focus away
    fireEvent.focus(document.body);

    expect(validateSpy.mock.calls[0][0]).toStrictEqual({
      elementName: 'Contestant-Signature-Date-Time',
      elementType: 'DateTime',
      errorMessage: '',
      eventType: 'change',
      isError: false,
      value: '441910800000',
    });

    expect(validateSpy.mock.calls[1][0]).toStrictEqual({
      elementName: 'Contestant-Signature-Date-Time',
      elementType: 'DateTime',
      errorMessage: '',
      eventType: 'blur',
      isError: false,
      value: '441910800000',
    });
  });
});
