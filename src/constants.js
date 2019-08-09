// @flow

import type { FieldEnumType, ValidationEventType } from './flowTypes';

/**
 * Constants
 *
 * "Immutable" values we use again, and again.
 */

type CSSClassNamesEnumType =
  'button'
  | 'buttonDisabled'
  | 'buttonSecondary'
  | 'field'
  | 'fieldImageEditor'
  | 'fieldImageEditorActions'
  | 'fieldImageEditorActionsStacked'
  | 'fieldInputError'
  | 'fieldInput'
  | 'fieldErrorMessage'
  | 'fieldLabel'
  | 'fieldLabelText'
  | 'fieldRadio'
  | 'fieldSelect'
  | 'fieldTextarea'
  | 'getFieldTypeToLower';

type CSSClassNamesType = {
  [CSSClassNamesEnumType]: string,
  fieldTypeToLower: (any) => string,
};

type TypeToReadableType = {
  [FieldEnumType]: string,
};

const CSS_CLASS_NAMESPACE = 'openlaw-el';

export const BLUR_EVENT_ENUM: ValidationEventType = 'blur';
export const CHANGE_EVENT_ENUM: ValidationEventType = 'change';

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
  button: `${CSS_CLASS_NAMESPACE}-button`,
  buttonDisabled: `${CSS_CLASS_NAMESPACE}-button--disabled`,
  buttonSecondary: `${CSS_CLASS_NAMESPACE}-button-secondary`,
  field: `${CSS_CLASS_NAMESPACE}-field`,
  fieldErrorMessage: `${CSS_CLASS_NAMESPACE}-field__error-message`,
  fieldImageEditor: `${CSS_CLASS_NAMESPACE}-field-image__editor`,
  fieldImageEditorActions: `${CSS_CLASS_NAMESPACE}-field-image__editor-actions`,
  fieldImageEditorActionsStacked: `${CSS_CLASS_NAMESPACE}-field-image__editor-actions--stacked`,
  fieldInput: `${CSS_CLASS_NAMESPACE}-field__input`,
  fieldInputError: `${CSS_CLASS_NAMESPACE}-field__input--error`,
  fieldLabel: `${CSS_CLASS_NAMESPACE}-field__label`,
  fieldLabelText: `${CSS_CLASS_NAMESPACE}-field__label-text`,
  fieldRadio: `${CSS_CLASS_NAMESPACE}-field__radio`,
  fieldSelect: `${CSS_CLASS_NAMESPACE}-field__select`,
  fieldTextarea: `${CSS_CLASS_NAMESPACE}-field__textarea`,
  fieldTypeToLower: (type: string) => type ? `${CSS_CLASS_NAMESPACE}-field-${type.toLowerCase()}` : '',
};

export const TYPE_TO_READABLE: TypeToReadableType = {
  Address: 'Address',
  Choice: 'Choice',
  Collection: 'Collection',
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
