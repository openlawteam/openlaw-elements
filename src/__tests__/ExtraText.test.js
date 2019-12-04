/* eslint-disable react/prop-types, react/display-name */

import React from 'react';
import {
  cleanup,
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ExtraText from '../ExtraText';

afterEach(cleanup);

test('Can render with string', () => {
  const { getByText } = render(
    <ExtraText text={'Hello there'} />
  );

  getByText(/hello there/i);
});

test('Can render with function', () => {
  const { getByText } = render(
    <ExtraText text={() => <p>Hello there</p>} />
  );

  getByText(/hello there/i);
});

test('Should throw with no text', () => {
  const { getByText } = render(
    <ExtraText />
  );

  expect(() => getByText(/hello there/i)).toThrow();
});
