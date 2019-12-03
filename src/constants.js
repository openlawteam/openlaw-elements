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
  | 'fieldErrorMessage'
  | 'fieldExtraText'
  | 'fieldImageEditor'
  | 'fieldImageEditorActions'
  | 'fieldImageEditorActionsStacked'
  | 'fieldInputError'
  | 'fieldInput'
  | 'fieldLabel'
  | 'fieldLabelIos'
  | 'fieldLabelText'
  | 'fieldRadio'
  | 'fieldSelect'
  | 'fieldTextarea'
  | 'form'
  | 'getFieldTypeToLower'
  | 'section'
  | 'sectionTitle'
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


export const ADDRESS = 'Address';
export const CHOICE = 'Choice';
export const COLLECTION = 'Collection';
export const DATE = 'Date';
export const DATE_TIME = 'DateTime';
export const ETH_ADDRESS = 'EthAddress';
export const EXTERNAL_SIGNATURE = 'ExternalSignature';
export const IDENTITY = 'Identity';
export const IMAGE = 'Image';
export const LARGE_TEXT = 'LargeText';
export const NUMBER = 'Number';
export const PERIOD = 'Period';
export const STRUCTURE = 'Structure';
export const TEXT = 'Text';
export const YES_NO = 'YesNo';

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
  fieldExtraText: `${CSS_CLASS_NAMESPACE}-field__extra-text`,
  fieldImageEditor: `${CSS_CLASS_NAMESPACE}-field-image__editor`,
  fieldImageEditorActions: `${CSS_CLASS_NAMESPACE}-field-image__editor-actions`,
  fieldImageEditorActionsStacked: `${CSS_CLASS_NAMESPACE}-field-image__editor-actions--stacked`,
  fieldInput: `${CSS_CLASS_NAMESPACE}-field__input`,
  fieldInputError: `${CSS_CLASS_NAMESPACE}-field__input--error`,
  fieldLabel: `${CSS_CLASS_NAMESPACE}-field__label`,
  fieldLabelIos: `${CSS_CLASS_NAMESPACE}-field__label--ios`,
  fieldLabelText: `${CSS_CLASS_NAMESPACE}-field__label-text`,
  fieldRadio: `${CSS_CLASS_NAMESPACE}-field__radio`,
  fieldSelect: `${CSS_CLASS_NAMESPACE}-field__select`,
  fieldTextarea: `${CSS_CLASS_NAMESPACE}-field__textarea`,
  fieldTypeToLower: (type: string) => type ? `${CSS_CLASS_NAMESPACE}-field-${type.toLowerCase()}` : '',
  form: `${CSS_CLASS_NAMESPACE}-form`,
  section: `${CSS_CLASS_NAMESPACE}-section`,
  sectionTitle: `${CSS_CLASS_NAMESPACE}-section__title`,
  structure: `${CSS_CLASS_NAMESPACE}-structure`,
  structureRow: `${CSS_CLASS_NAMESPACE}-structure__row`,
};

// Field inputs
// Not including Collection or Structure.
export const ELEMENT_INPUT_TYPES: Array<FieldEnumType> = [
  ADDRESS,
  CHOICE,
  DATE,
  DATE_TIME,
  ETH_ADDRESS,
  EXTERNAL_SIGNATURE,
  IDENTITY,
  IMAGE,
  LARGE_TEXT,
  NUMBER,
  PERIOD,
  TEXT,
  YES_NO,
];

export const FIELD_DEFAULT_ERROR_MESSAGE = 'Something looks incorrect.';

export const TYPE_TO_READABLE: TypeToReadableType = {
  [ADDRESS]: 'Address',
  [CHOICE]: 'Choice',
  [COLLECTION]: 'Collection',
  [DATE]: 'Date',
  [DATE_TIME]: 'Date \u0026 Time', /* Date & Time */
  [ETH_ADDRESS]: 'Ethereum Address',
  [EXTERNAL_SIGNATURE]: 'Email',
  [IDENTITY]: 'Email',
  [IMAGE]: 'Image',
  [LARGE_TEXT]: 'Text box',
  [NUMBER]: 'Number',
  [PERIOD]: 'Period of time',
  [TEXT]: 'Text',
  [YES_NO]: 'Yes or No',
};
