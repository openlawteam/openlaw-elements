/* eslint-disable react/prop-types */

import React, { Fragment, useState } from 'react';
import mockAxios from 'axios';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { APIClient, Openlaw } from 'openlaw';

import { Text } from '../Text';
import { OpenLawForm } from '../OpenLawForm';
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

/**
 * Errors
 */

describe('Text: Errors', () => {
  const FakeOpenlawComponent = props => {
    const compiledTemplate = Openlaw.compileTemplate(SampleTemplateText).compiledTemplate;
    const parameters = {};
    const executionResult = Openlaw.execute(compiledTemplate, {}, parameters).executionResult;
    const executedVariables = Openlaw.getExecutedVariables(executionResult, {});
    const onValidate = ({ errorMessage, eventType }) => {
      // you probably wouldn't show a big message on every event (e.g. change)
      // but a general message helps our tests.
      setErrorMessage(errorMessage ? `Please correct the form errors. (test event: ${eventType})` : '');
    };

    const [ errorMessage, setErrorMessage ] = useState('');

    return (
      <Fragment>
        {errorMessage && <div data-testid="error-message">{errorMessage}</div>}

        <OpenLawForm
          apiClient={apiClient}
          executionResult={executionResult}
          onValidate={onValidate}
          parameters={parameters}
          onChangeFunction={() => {}}
          openLaw={Openlaw}
          variables={executedVariables}

          {...props}
        />
      </Fragment>
    );
  };

  const periodPlaceholderTextRegex = /what is the longest bbq you ever conducted/i;
  const periodErrorTextRegex = /period of time: something looks incorrect/i;
  const ethPlaceholderTextRegex = /your eth address for the registration fee/i;
  const ethErrorTextRegex = /ethereum address: something looks incorrect/i;
  const topErrorMessageRegex = /please correct the form errors/i;

  let apiClient;

  beforeEach(() => {
    apiClient = new APIClient('');
  });

  afterEach(() => {
    mockAxios.get.mockClear();
    
    cleanup();
  });

  /**
  * Period
  */

  test('Can validate Period type', () => {
    const { getByDisplayValue, getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '22 weeks' } });
    fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

    // value should be set
    getByDisplayValue(/22 weeks/i);
    // no error message field
    expect(() => getByText(periodErrorTextRegex)).toThrow();
    // no error message top
    expect(() => getByTestId('error-message')).toThrow();
  });

  // Period onChange

  test('Can show user error(s) onChange using inputProps (Period type)', () => {
    const { getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent
        inputProps={{
          'Text': {
            onChange(event, validationResult) {
              !validationResult.value && (
                validationResult.setFieldError('Please provide a period of time')
              );
            },
          },
        }}
      />
    );

    fireEvent.change(
      getByPlaceholderText(ethPlaceholderTextRegex),
      { target: { value: '22 weeks' } },
    );
    fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '' } });

    // error message field
    getByText(/please provide a period of time/i);
  });

  test('Can clear previous error onChange after valid entry (Period type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 wee' } });
    fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

    getByText(periodErrorTextRegex);
    // error message top
    expect(getByTestId('error-message').textContent)
      .toMatch(topErrorMessageRegex);

    fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 week' } });

    // don't show error message on the field
    expect(() => getByText(periodErrorTextRegex)).toThrow();
    // don't show top error message
    expect(() => getByTestId('error-message')).toThrow();
  });


  test('Field error is reset when no value and doesn\'t show onChange (Period type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '12 wee' } });
    fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

    getByText(periodErrorTextRegex);
    // error message top
    expect(getByTestId('error-message').textContent)
      .toMatch(topErrorMessageRegex);

    fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '' } });
    fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '22 w' } });

    // don't show error message on the field
    expect(() => getByText(periodErrorTextRegex)).toThrow();
  });

  test('Can show error onChange (Period type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 wee' } });

    // don't show error message on the field
    expect(() => getByText(periodErrorTextRegex)).toThrow();
    // error message top
    expect(getByTestId('error-message').textContent)
      .toMatch(/please correct the form errors\. \(test event: change\)/i);
  });

  test('Can clear previous error onChange (Period type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 wee' } });
    fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

    getByText(periodErrorTextRegex);
    // error message top
    expect(getByTestId('error-message').textContent)
      .toMatch(topErrorMessageRegex);

    fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '1 week' } });

    // don't show error message on the field
    expect(() => getByText(periodErrorTextRegex)).toThrow();
    // don't show top error message
    expect(() => getByTestId('error-message')).toThrow();
  });

  // Period onBlur

  test('Can show error(s) onBlur (Period type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '22 wee' } });
    fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

    // error message field
    getByText(periodErrorTextRegex);
    // error message top
    expect(getByTestId('error-message').textContent).toMatch(topErrorMessageRegex);
  });

  test('Should not show error(s) onBlur with no content (Period type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.focus(getByPlaceholderText(periodPlaceholderTextRegex));
    fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

    // error message field should not show
    expect(() => getByText(periodErrorTextRegex)).toThrow();
    // error message top should not show
    expect(() => getByTestId('error-message').textContent).toThrow();
  });

  test('Should not show error(s) onBlur with no content, after previous content typed (Period type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '22 wee' } });
    fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

    // error message field
    getByText(periodErrorTextRegex);
    // error message top
    expect(getByTestId('error-message').textContent).toMatch(topErrorMessageRegex);

    fireEvent.change(getByPlaceholderText(periodPlaceholderTextRegex), { target: { value: '' } });
    fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

    // error message field should not show
    expect(() => getByText(periodErrorTextRegex)).toThrow();
    // error message top should not show
    expect(() => getByTestId('error-message').textContent).toThrow();
  });

  test('Can show user error(s) onBlur using inputProps (Period type)', () => {
    const { getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent
        inputProps={{
          'Text': {
            onBlur(event, validationResult) {
              !validationResult.value && (
                validationResult.setFieldError('Please provide a period of time')
              );
            },
          },
        }}
      />
    );

    fireEvent.blur(getByPlaceholderText(periodPlaceholderTextRegex));

    // error message field
    getByText(/please provide a period of time/i);
  });

  /**
  * EthAddress
  */

  test('Can validate EthAddress type', () => {
    const { getByDisplayValue, getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(
      getByPlaceholderText(ethPlaceholderTextRegex),
      { target: { value: '0xc0ffee254729296a45a3885639AC7E10F9d54979' } },
    );
    fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

    // value should be set
    getByDisplayValue(/0xc0ffee254729296a45a3885639AC7E10F9d54979/i);
    // no error message field
    expect(() => getByText(ethErrorTextRegex)).toThrow();
    // no error message top
    expect(() => getByTestId('error-message')).toThrow();
  });
  
  // EthAddress onBlur

  test('Can show error(s) onBlur (EthAddress type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
    fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

    // error message field
    getByText(ethErrorTextRegex);
    // error message top
    expect(getByTestId('error-message').textContent).toMatch(topErrorMessageRegex);
  });

  test('Should not show error(s) onBlur with no content (EthAddress type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.focus(getByPlaceholderText(ethPlaceholderTextRegex));
    fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

    // error message field should not show
    expect(() => getByText(ethErrorTextRegex)).toThrow();
    // error message top should not show
    expect(() => getByTestId('error-message').textContent).toThrow();
  });

  test('Should not show error(s) onBlur with no content, after previous content typed (EthAddress type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
    fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

    // error message field
    getByText(ethErrorTextRegex);
    // error message top
    expect(getByTestId('error-message').textContent).toMatch(topErrorMessageRegex);

    fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '' } });
    fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

    // error message field should not show
    expect(() => getByText(ethErrorTextRegex)).toThrow();
    // error message top should not show
    expect(() => getByTestId('error-message').textContent).toThrow();
  });

  test('Can show user error(s) onBlur using inputProps (EthAddress type)', () => {
    const { getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent
        inputProps={{
          'Text': {
            onBlur(event, validationResult) {
              !validationResult.value && (
                validationResult.setFieldError('Please provide an Ethereum Address')
              );
            },
          },
        }}
      />
    );

    fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

    // error message field
    getByText(/please provide an ethereum address/i);
  });

  // EthAddress onChange

  test('Can show user error(s) onChange using inputProps (EthAddress type)', () => {
    const { getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent
        inputProps={{
          'Text': {
            onChange(event, validationResult) {
              !validationResult.value && (
                validationResult.setFieldError('Please provide an Ethereum Address')
              );
            },
          },
        }}
      />
    );

    fireEvent.change(
      getByPlaceholderText(ethPlaceholderTextRegex),
      { target: { value: '0xc0ffee254729296a45a3885639AC7E10F9d54979' } },
    );
    fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '' } });

    // error message field
    getByText(/please provide an ethereum address/i);
  });

  test('Can clear previous error onChange with valid entry (EthAddress type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
    fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

    getByText(ethErrorTextRegex);
    // error message top
    expect(getByTestId('error-message').textContent)
      .toMatch(topErrorMessageRegex);

    fireEvent.change(
      getByPlaceholderText(ethPlaceholderTextRegex),
      { target: { value: '0xc0ffee254729296a45a3885639AC7E10F9d54979' } },
    );

    // don't show error message on the field
    expect(() => getByText(ethErrorTextRegex)).toThrow();
    // don't show top error message
    expect(() => getByTestId('error-message')).toThrow();
  });

  test('Field error is reset when no value and doesn\'t show onChange (EthAddress type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
    fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

    getByText(ethErrorTextRegex);
    // error message top
    expect(getByTestId('error-message').textContent)
      .toMatch(topErrorMessageRegex);

    fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '' } });
    fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x' } });

    // don't show error message on the field
    expect(() => getByText(ethErrorTextRegex)).toThrow();
  });

  test('Can show error onChange (EthAddress type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });

    // don't show error message on the field
    expect(() => getByText(ethErrorTextRegex)).toThrow();
    // error message top
    expect(getByTestId('error-message').textContent)
      .toMatch(/please correct the form errors\. \(test event: change\)/i);
  });

  test('Can clear previous error onChange (EthAddress type)', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <FakeOpenlawComponent />
    );

    fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0x123' } });
    fireEvent.blur(getByPlaceholderText(ethPlaceholderTextRegex));

    getByText(ethErrorTextRegex);
    // error message top
    expect(getByTestId('error-message').textContent)
      .toMatch(topErrorMessageRegex);

    fireEvent.change(getByPlaceholderText(ethPlaceholderTextRegex), { target: { value: '0xc0ffee254729296a45a3885639AC7E10F9d54979' } });

    // don't show error message on the field
    expect(() => getByText(ethErrorTextRegex)).toThrow();
    // don't show top error message
    expect(() => getByTestId('error-message')).toThrow();
  });
});
