// @flow

import type { FieldEnumType } from './flowTypes';

/**
 * TYPES
 */

type CSSClassNamesEnumType =
  'button'
  | 'buttonDisabled'
  | 'buttonSecondary'
  | 'collection'
  | 'collectionDescription'
  | 'collectionButtonRemove'
  | 'collectionRow'
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
  | 'form'
  | 'getFieldTypeToLower'
  | 'structure'
  | 'structureRow';

type CSSClassNamesType = {
  [CSSClassNamesEnumType]: string,
  fieldTypeToLower: (any) => string,
};

type TypeToReadableType = {
  [FieldEnumType]: string,
};

/**
 * CONSTANTS
 */

const CSS_CLASS_NAMESPACE = 'openlaw-el';

export const CSS_CLASS_NAMES: CSSClassNamesType = {
  button: `${CSS_CLASS_NAMESPACE}-button`,
  buttonDisabled: `${CSS_CLASS_NAMESPACE}-button--disabled`,
  buttonSecondary: `${CSS_CLASS_NAMESPACE}-button-secondary`,
  collection: `${CSS_CLASS_NAMESPACE}-collection`,
  collectionButtonRemove: `${CSS_CLASS_NAMESPACE}-collection__button-remove`,
  collectionDescription: `${CSS_CLASS_NAMESPACE}-collection__description`,
  collectionRow: `${CSS_CLASS_NAMESPACE}-collection__row`,
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
  form: `${CSS_CLASS_NAMESPACE}-form`,
  structure: `${CSS_CLASS_NAMESPACE}-structure`,
  structureRow: `${CSS_CLASS_NAMESPACE}-structure__row`,
};

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
