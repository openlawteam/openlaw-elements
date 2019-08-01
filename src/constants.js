// @flow

import type { FieldEnumType } from './flowTypes';

/**
 * Constants
 *
 * "Immutable" values we use again, and again.
 */

type CSSClassNamesEnumType =
  'field'
  | 'fieldInputError'
  | 'fieldInput'
  | 'fieldErrorMessage'
  | 'fieldLabel'
  | 'fieldLabelText'
  | 'getFieldTypeToLower';

type CSSClassNamesType = {
  [CSSClassNamesEnumType]: string,
  fieldTypeToLower: (any) => string,
};

type TypeToReadableType = {
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

export const CSS_CLASS_NAMES: CSSClassNamesType = {
  field: `${CSS_CLASS_NAMESPACE}-field`,
  fieldErrorMessage: `${CSS_CLASS_NAMESPACE}-field__error-message`,
  fieldInput: `${CSS_CLASS_NAMESPACE}-field__input`,
  fieldInputError: `${CSS_CLASS_NAMESPACE}-field__input--error`,
  fieldLabel: `${CSS_CLASS_NAMESPACE}-field__label`,
  fieldLabelText: `${CSS_CLASS_NAMESPACE}-field__label-text`,
  fieldTypeToLower: (type: string) => type ? `${type.toLowerCase()}` : '',
};

export const TYPE_TO_READABLE: TypeToReadableType = {
  Address: 'Address',
  Choice: 'Choice',
  Date: 'Date',
  DateTime: 'Date \u0026 Time', /* Date & Time */
  EthAddress: 'Ethereum Address',
  ExternalSignature: 'Email',
  Identity: 'Email',
  Image: 'Image',
  LargeText: 'Text box',
  Number: 'Number',
  Period: 'Period of time',
  Text: 'Text',
  YesNo: 'Yes or No',
};
