import React, { useState } from 'react';
import mockAxios from 'axios';
import {
  cleanup,
  fireEvent,
  render,
  wait,
  waitForElement,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import { APIClient, Openlaw } from 'openlaw';

import { Address } from '../Address';

const { Fragment } = React;

const FakeComponent = (props) => {
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
        onValidate={onValidate}
        openLaw={Openlaw}
        savedValue=""
        textLikeInputClass=""

        {...props}
      />
    </Fragment>
  );
};

let apiClient;

beforeEach(() => {
  apiClient = new APIClient('');
});

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
      textLikeInputClass=""
    />
  );

  getByText(/mailing address/i);
  getByPlaceholderText(/mailing address/i);
});

test('Can select an address', async () => {
  // setup
  mockAxios.get
    .mockImplementationOnce(() =>
      Promise.resolve({
        headers: { openlaw_jwt: '' },
        data: [{
          address: '49 Bogart St., Brooklyn',
          placeId: '123xyz',
        }],
      })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
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
      })
    );

  const { getByDisplayValue, getByTestId, getByText, getByPlaceholderText } = render(
    <FakeComponent />
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
  fireEvent.click(getByText(/49 Bogart St\., Brooklyn/i));

  // value is set
  await wait(() => {
    getByDisplayValue(/49 Bogart St, Brooklyn, NY 11206, USA/i);
  });

  // expect no errors
  expect(() => getByTestId('error-message')).toThrow();
});

test('Can show error onBlur (no content)', () => {
  const { getByPlaceholderText, getByTestId, getByText } = render(
    <FakeComponent />
  );

  fireEvent.blur(getByPlaceholderText(/mailing address/i));

  getByText(/please choose a valid address from the options\./i);
  getByTestId('error-message');
});

test('Can show error onBlur (content, but no selection)', async () => {
  // setup
  mockAxios.get
    .mockImplementationOnce(() =>
      Promise.resolve({
        headers: { openlaw_jwt: '' },
        data: [{
          address: '49 Bogart St., Brooklyn',
        }],
      })
    );

  const { getByText, getByPlaceholderText } = render(
    <FakeComponent />
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
        setTimeout(() => resolve({
          headers: { openlaw_jwt: '' },
          data: [{
            address: '49 Bogart St., Brooklyn',
            placeId: '123xyz',
          }],
        }), 3000)
      )
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
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
      })
    );

  const { getByTestId, getByText, getByPlaceholderText } = render(
    <FakeComponent />
  );

  fireEvent.focus(getByPlaceholderText(/mailing address/i));
  fireEvent.change(getByPlaceholderText(/mailing address/i), { target: { value: '49 Boga' } });

  await waitForElement(() => getByText(/searching addresses/i));

  // expect no errors
  expect(() => getByTestId('error-message')).toThrow();
});
