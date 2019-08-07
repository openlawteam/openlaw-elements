// @flow

import React from 'react';

import { CSS_CLASS_NAMES } from './constants';

type FieldErrorData = {
  cleanName: string,
  errorMessage: string,
  shouldShowError: boolean,
};

export const FieldError = ({ cleanName, errorMessage, shouldShowError }: FieldErrorData) =>
  (shouldShowError && errorMessage) && (
    <div>
      <div
        className={CSS_CLASS_NAMES.fieldErrorMessage}
        data-element-name={cleanName}>
        {errorMessage}
      </div>
    </div>
  );
