import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';
import mockAxios from 'axios';
import {
  cleanup,
  fireEvent,
  render,
  wait,
  waitForElement,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { APIClient, Openlaw } from 'openlaw';

import { Address } from '../Address';
import TestOpenLawFormComponent from '../__test_utils__/OpenLawFormComponent';

/**
 * Note about mock implementations in Jest:
 * You must use the `mockImplementationOnce` functions you create.
 * This is equivalent to the code calling each of the function(s) you are mocking 1 time.
 * If your tests with mock implementations are failing check this as a possible cause.
 */

const { Fragment } = React;
const apiClient = new APIClient('');

const FakeAddressComponent = (props) => {
  const [errorMessage, setErrorMessage] = useState('');

  const onValidate = ({ errorMessage }) => {
    if (errorMessage) {
      setErrorMessage('Please correct the form errors.');
    }
  };

  return (
    <Fragment>
      {errorMessage && <div data-testid="error-message">{errorMessage}</div>}

      <Address
        apiClient={apiClient}
        cleanName="Mailing-Address"
        description="Mailing address"
        name="Mailing Address"
        onChange={() => {}}
        onValidate={validationResult => act(() => { onValidate(validationResult); })}
        openLaw={Openlaw}
        savedValue=""
        variableType="Address"

        {...props}
      />
    </Fragment>
  );
};

const bogartSearchResult = {
  headers: { openlaw_jwt: '' },
  data: [{
    address: '49 Bogart St., Brooklyn',
    placeId: '123xyz',
  }],
};
const bogartAddressResult = {
  headers: { openlaw_jwt: '' },
  data: {
    address: '49 Bogart St, Brooklyn, NY 11206, USA',
    city: 'Brooklyn',
    country: 'United States',
    placeId: '123xyz',
    state: 'New York',
    streetName: 'Bogart St.',
    streetNumber: '49',
    zipCode: '11206',
  },
};

afterEach(() => {
  mockAxios.get.mockClear();

  cleanup();
});

test('Can render', () => {
  const { getByText, getByPlaceholderText } = render(
    <Address
      apiClient={apiClient}
      cleanName="Mailing-Address"
      description="Mailing address"
      name="Mailing Address"
      onChange={() => {}}
      openLaw={Openlaw}
      savedValue=""
      variableType="Address"
    />
  );

  getByText(/mailing address/i);
  getByPlaceholderText(/mailing address/i);
});

test('Can call onChangeFunction', async () => {
  const changeSpy = jest.fn();
  mockAxios.get
    .mockImplementationOnce(() => Promise.resolve(bogartSearchResult))
    .mockImplementationOnce(() => Promise.resolve(bogartAddressResult));

  const { getByPlaceholderText, getByText } = render(
    <TestOpenLawFormComponent
      onChangeFunction={changeSpy}
    />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(
    getByPlaceholderText(/mailing address/i),
    { target: { value: '49 Boga' } },
  );

  // searching...
  await wait(() => {
    expect(mockAxios.get)
      .toHaveBeenCalledWith(
        '/address/search?term=49%20Boga',
        { 'auth': undefined, 'headers': {} },
      );
  });

  // select address from drop-down list
  fireEvent.click(getByText(/49 bogart st\., brooklyn/i));

  // value is set
  await wait(() => {
    expect(changeSpy.mock.calls.length).toBe(3);

    // value is changed, but OpenLaw Address is not yet created
    expect(changeSpy.mock.calls[0][0]).toMatch(/contestant address/i);
    expect(changeSpy.mock.calls[0][1]).toBe(undefined);

    // drop-down value is selected, and input value is changed, but OpenLaw Address is not yet created
    expect(changeSpy.mock.calls[1][0]).toMatch(/contestant address/i);
    expect(changeSpy.mock.calls[1][1]).toBe(undefined);

    // Openlaw Address is created
    expect(changeSpy.mock.calls[2][0]).toMatch(/contestant address/i);
    expect(changeSpy.mock.calls[2][1]).toMatch(
      JSON.stringify({
        placeId: '123xyz',
        streetName: 'Bogart St.',
        streetNumber: '49',
        city: 'Brooklyn',
        state: 'New York',
        country: 'United States',
        zipCode: '11206',
        formattedAddress: '49 Bogart St, Brooklyn, NY 11206, USA'
      })
    );
  });
});

test('Can call inputProps: onChange, onBlur', async () => {
  const changeSpy = jest.fn();
  const blurSpy = jest.fn();

  const { getByPlaceholderText } = render(
    <TestOpenLawFormComponent
      inputProps={{
        'Address': {
          onChange: changeSpy,
          onBlur: blurSpy,
        },
      }}
    />
  );

  fireEvent.change(
    getByPlaceholderText(/mailing address/i),
    { target: { value: '49 Bogart' } },
  );
  fireEvent.blur(getByPlaceholderText(/mailing address/i));

  await wait(() => {
    expect(changeSpy.mock.calls.length).toBe(1);
    expect(blurSpy.mock.calls.length).toBe(1);
  });
});

test('Can show results on search', async () => {
  mockAxios.get
    .mockImplementationOnce(() => Promise.resolve(bogartSearchResult));

  const { getByText, getByPlaceholderText } = render(
    <FakeAddressComponent />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '49 Boga' } });

  // searching...
  await wait(() => {
    expect(mockAxios.get)
      .toHaveBeenCalledWith(
        '/address/search?term=49%20Boga',
        { 'auth': undefined, 'headers': {} },
      );
  });

  // item is shown in drop-down list
  await wait(() => getByText(/49 bogart st\., brooklyn/i));
});

test('Can search if input length is > 2 (trimmed)', async () => {
  mockAxios.get
    .mockImplementationOnce(() => Promise.resolve(bogartSearchResult));

  const { getByPlaceholderText } = render(
    <FakeAddressComponent />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: 'Bog' } });

  // searching...
  await wait(() => {
    expect(mockAxios.get)
      .toHaveBeenCalledWith(
        '/address/search?term=Bog',
        { 'auth': undefined, 'headers': {} },
      );
  });
});

test('Should not search if input length is < 3 (trimmed)', async () => {
  const { getByPlaceholderText, getByText } = render(
    <FakeAddressComponent />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '49 ' } });

  // should not search
  await wait(() => expect(() => getByText(/searching addresses/i)).toThrow());
});

test('Can select an address by click', async () => {
  mockAxios.get
    .mockImplementationOnce(() => Promise.resolve(bogartSearchResult))
    .mockImplementationOnce(() => Promise.resolve(bogartAddressResult));

  const { getByDisplayValue, getByTestId, getByText, getByPlaceholderText } = render(
    <FakeAddressComponent />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '49 Boga' } });

  // searching...
  await wait(() => {
    expect(mockAxios.get)
      .toHaveBeenCalledWith(
        '/address/search?term=49%20Boga',
        { 'auth': undefined, 'headers': {} },
      );
  });

  // select address from drop-down list
  fireEvent.click(getByText(/49 bogart st\., brooklyn/i));

  // value is set
  await wait(() => getByDisplayValue(/49 bogart st, brooklyn, ny 11206, usa/i));

  // expect no errors
  expect(() => getByTestId('error-message')).toThrow();
});

test('Can select an address by pressing enter', async () => {
  // setup
  mockAxios.get
    .mockImplementationOnce(() =>
      Promise.resolve({
        headers: { openlaw_jwt: '' },
        data: [
          {
            address: '123 Anders St., Brooklyn',
            placeId: '123xyz',
          }, {
            address: '123 Any St., Brooklyn',
            placeId: '123defg',
          },
        ],
      })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        headers: { openlaw_jwt: '' },
        data: {
          address: '123 Anders St., Brooklyn, NY 11206, USA',
          city: 'Brooklyn',
          country: 'United States',
          placeId: '123xyz',
          state: 'New York',
          streetName: 'Bogart St.',
          streetNumber: '123',
          zipCode: '11206',
        },
      })
    );

  const { getByDisplayValue, getByTestId, getByPlaceholderText } = render(
    <FakeAddressComponent />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '123 An' } });

  // searching...
  await wait(() => {
    expect(mockAxios.get)
      .toHaveBeenCalledWith(
        '/address/search?term=123%20An',
        { 'auth': undefined, 'headers': {} },
      );
  });

  // key down through drop-down list
  fireEvent.keyDown(getByDisplayValue(/123 an/i), { key: 'ArrowDown', keyCode: 40 });
  // select by pressing enter
  // result is populated into the input, but not completely set until OpenLaw creates the address
  fireEvent.keyDown(getByDisplayValue(/123 anders st\., brooklyn/i), { key: 'Enter', keyCode: 13 });

  // value is set via OpenLaw
  await wait(() => {
    getByDisplayValue(/123 anders st\., brooklyn, ny 11206, usa/i);
  });

  // expect no errors
  expect(() => getByTestId('error-message')).toThrow();
});

test('Can clear search results on field blur', async () => {
  mockAxios.get
    .mockImplementationOnce(() => Promise.resolve(bogartSearchResult));

  const { getByDisplayValue, getByText, getByPlaceholderText } = render(
    <FakeAddressComponent />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '49 Boga' } });

  // searching...
  await wait(() => {
    expect(mockAxios.get)
      .toHaveBeenCalledWith(
        '/address/search?term=49%20Boga',
        { 'auth': undefined, 'headers': {} },
      );
  });

  // click away to other place clear search results
  fireEvent.blur(getByDisplayValue(/49 boga/i));

  // results are not shown
  expect(() => getByText(/49 bogart st\., brooklyn/i)).toThrow();
});

test('Can clear search results on escape', async () => {
  mockAxios.get
    .mockImplementationOnce(() => Promise.resolve(bogartSearchResult));

  const { getByDisplayValue, getByText, getByPlaceholderText } = render(
    <FakeAddressComponent />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '49 Boga' } });

  // searching...
  await wait(() => {
    expect(mockAxios.get)
      .toHaveBeenCalledWith(
        '/address/search?term=49%20Boga',
        { 'auth': undefined, 'headers': {} },
      );
  });

  // press escape key to tell AutoSuggest to clear results
  fireEvent.keyDown(getByDisplayValue(/49 boga/i), { key: 'Escape', keyCode: 27 });

  // results are not shown
  expect(() => getByText(/49 bogart st\., brooklyn/i)).toThrow();
});

test('Can clear input on double escape', async () => {
  mockAxios.get
    .mockImplementationOnce(() => Promise.resolve(bogartSearchResult));

  const { getByDisplayValue, getByText, getByPlaceholderText } = render(
    <FakeAddressComponent />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '49 Boga' } });

  // searching...
  await wait(() => {
    expect(mockAxios.get)
      .toHaveBeenCalledWith(
        '/address/search?term=49%20Boga',
        { 'auth': undefined, 'headers': {} },
      );
  });

  // press escape key to tell AutoSuggest to clear results
  fireEvent.keyDown(getByDisplayValue(/49 boga/i), { key: 'Escape', keyCode: 27 });
  // press escape key to tell AutoSuggest to clear input
  fireEvent.keyDown(getByDisplayValue(/49 boga/i), { key: 'Escape', keyCode: 27 });

  // results are not shown
  expect(() => getByText(/49 bogart st\., brooklyn/i)).toThrow();
  // input value is erased
  expect(() => getByDisplayValue(/49 boga/i)).toThrow();
});

test('Should not show error onBlur if no value', () => {
  const { getByPlaceholderText, getByText } = render(
    <FakeAddressComponent />
  );

  fireEvent.blur(getByPlaceholderText(/mailing address/i));

  expect(() => getByText(/please choose a valid address from the options\./i)).toThrow();
});

test('Should not show error onBlur if bad input, then input deleted.', async () => {
  const { getByDisplayValue, getByPlaceholderText, getByText } = render(
    <FakeAddressComponent />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '49 Boga' } });
  fireEvent.blur(getByPlaceholderText(/mailing address/i));

  getByText(/please choose a valid address from the options\./i);

  fireEvent.focus(getByDisplayValue(/49 boga/i));
  fireEvent.change(getByDisplayValue(/49 boga/i), { target: { value: '' } });
  fireEvent.blur(getByPlaceholderText(/mailing address/i));
  
  expect(() => getByText(/please choose a valid address from the options\./i)).toThrow();

  // wait for async processes to finish
  await new Promise(r => setTimeout(r));
});

test('Can show user-provided error onBlur via onValidate', () => {
  const { getByPlaceholderText, getByText } = render(
    <FakeAddressComponent
      onValidate={({ eventType }) => {
        if (eventType === 'blur') {
          return {
            errorMessage: 'This is a custom Address error.',
          };
        }
      }}
    />
  );

  fireEvent.blur(getByPlaceholderText(/mailing address/i));

  getByText(/this is a custom address error/i);
});

test('Can select an address by click and show user-provided error onBlur via onValidate', async () => {
  mockAxios.get
    .mockImplementationOnce(() => Promise.resolve(bogartSearchResult))
    .mockImplementationOnce(() => Promise.resolve(bogartAddressResult));

  const { getByDisplayValue, getByText, getByPlaceholderText } = render(
    <FakeAddressComponent
      onValidate={({ eventType }) => {
        if (eventType === 'blur') {
          return {
            errorMessage: 'This is a custom Address error.',
          };
        }
      }}
    />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '49 Boga' } });

  // searching...
  await wait(() => {
    expect(mockAxios.get)
      .toHaveBeenCalledWith(
        '/address/search?term=49%20Boga',
        { 'auth': undefined, 'headers': {} },
      );
  });

  // select address from drop-down list
  fireEvent.click(getByText(/49 bogart st\., brooklyn/i));

  // value is set
  await wait(() => {
    getByDisplayValue(/49 bogart st, brooklyn, ny 11206, usa/i);
  });

  // error message is showing
  expect(getByText(/this is a custom address error/i));
});

test('Can attempt to select an address by click, but catch error and show generic error onBlur', async () => {
  // setup
  mockAxios.get
    .mockImplementationOnce(() =>
      Promise.resolve(bogartSearchResult)
    )
    // reject the Promise to redirect to `catch` handler
    .mockImplementationOnce(() =>
      Promise.reject('Some error.')
    );

  const { getByDisplayValue, getByText, getByPlaceholderText } = render(
    <FakeAddressComponent />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '49 Boga' } });

  // searching...
  await wait(() => {
    expect(mockAxios.get)
      .toHaveBeenCalledWith(
        '/address/search?term=49%20Boga',
        { 'auth': undefined, 'headers': {} },
      );
  });

  // attempt to select address from drop-down list
  fireEvent.click(getByText(/49 bogart st\., brooklyn/i));

  // intermediate value should be set
  await wait(() => {
    getByDisplayValue(/49 bogart st\., brooklyn/i);
  });

  // error message is showing
  expect(getByText(/something went wrong while creating an address/i));
});

test('Can attempt to select an address by click, but catch error and show user-provided error onBlur via onValidate', async () => {
  // setup
  mockAxios.get
    .mockImplementationOnce(() =>
      Promise.resolve(bogartSearchResult)
    )
    // reject the Promise to redirect to `catch` handler
    .mockImplementationOnce(() =>
      Promise.reject('Some error.')
    );

  const { getByDisplayValue, getByText, getByPlaceholderText } = render(
    <FakeAddressComponent
      onValidate={({ eventType }) => {
        if (eventType === 'blur') {
          return {
            errorMessage: 'This is a custom Address error after catch.',
          };
        }
      }}
    />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '49 Boga' } });

  // searching...
  await wait(() => {
    expect(mockAxios.get)
      .toHaveBeenCalledWith(
        '/address/search?term=49%20Boga',
        { 'auth': undefined, 'headers': {} },
      );
  });

  // select address from drop-down list
  fireEvent.click(getByText(/49 bogart st\., brooklyn/i));

  // intermediate value should be set
  await wait(() => {
    getByDisplayValue(/49 bogart st\., brooklyn/i);
  });

  // value should not be set
  await wait(() => {
    expect(() => getByDisplayValue(/49 bogart st, brooklyn, ny 11206, usa/i)).toThrow();
  });

  // error message is showing
  expect(getByText(/this is a custom address error after catch/i));
});

test('Can show user-provided error onChange via onValidate', async () => {
  const { getByPlaceholderText, getByText } = render(
    <FakeAddressComponent
      onValidate={({ eventType }) => {
        if (eventType === 'change') {
          return {
            errorMessage: 'This is a custom catch Address error.',
          };
        }
      }}
    />
  );

  await wait(() => {
    fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '123' } });
    getByText(/this is a custom catch address error/i);
  });
});

test('Can show error onBlur (content, but no selection)', async () => {
  // setup
  mockAxios.get
    .mockImplementationOnce(() =>
      Promise.resolve(bogartSearchResult)
    );

  const { getByText, getByPlaceholderText } = render(
    <FakeAddressComponent />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '49 Boga' } });

  await wait(() => {
    expect(mockAxios.get)
      .toHaveBeenCalledWith(
        '/address/search?term=49%20Boga',
        { 'auth': undefined, 'headers': {} },
      );
  });

  fireEvent.blur(getByPlaceholderText(/mailing address/i));

  getByText(/please choose a valid address from the options\./i);
  getByText(/please correct the form errors\./i);
});

test('Can show async progress message when searching', async () => {
  // setup
  mockAxios.get
    .mockImplementationOnce(() =>
      new Promise(resolve =>
        // need to delay to simulate slow network
        setTimeout(() => resolve(bogartSearchResult), 3000)
      )
    )
    .mockImplementationOnce(() =>
      Promise.resolve(bogartAddressResult)
    );

  const { getByTestId, getByText, getByPlaceholderText } = render(
    <FakeAddressComponent />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '49 Boga' } });

  await waitForElement(() => getByText(/searching addresses/i));

  // expect no errors
  expect(() => getByTestId('error-message')).toThrow();
});
