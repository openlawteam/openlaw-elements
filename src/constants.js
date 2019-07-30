// @flow

import type { FieldEnumType } from './flowTypes';

/**
 * Constants
 *
 * "Immutable" values we use again, and again.
 */

type CSSClassNamesEnumType =
  'field'
  | 'fieldError'
  | 'fieldErrorMessage';

type TYPE_TO_READABLEType = {
  [FieldEnumType]: string,
};

const CSS_CLASS_NAMESPACE = 'openlaw-el';

export const ELEMENT_TYPES: Array<FieldEnumType> = [
  'Address',
  'Choice',
  'Date',
  'DateTime',
  'EthAddress',
  'ExternalSignature',
  'Identity',
  'Image',
  'LargeText',
  'Number',
  'Period',
  'Text',
  'YesNo',
];

export const FIELD_DEFAULT_ERROR_MESSAGE = 'Something looks incorrect.';

export const CSS_CLASS_NAMES: {[CSSClassNamesEnumType]: string} = {
  field: `${CSS_CLASS_NAMESPACE}-field`,
  fieldError: `${CSS_CLASS_NAMESPACE}-field--error`,
  fieldErrorMessage: `${CSS_CLASS_NAMESPACE}-field__error-message`,
};

export const TYPE_TO_READABLE: TYPE_TO_READABLEType = {
  Address: 'Address',
  Choice: 'Choice',
  Date: 'Date',
  DateTime: 'Date \u0026 Time', /* Date & Time */
  EthAddress: 'Ethereum Address',
  Identity: 'Identity',
  Image: 'Image',
  LargeText: 'Text box',
  Number: 'Number',
  Period: 'Period of time',
  Text: 'Text',
  YesNo: 'Yes or No',
};
