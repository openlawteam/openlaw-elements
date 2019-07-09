// @flow

import type { VariableTypesEnumType } from './types';
/**
* Constants
*
* "Immutable" values we use again, and again.
*/

type TypeToReadableType = {
  [VariableTypesEnumType]: string,
};

export const typeToReadable: TypeToReadableType = {
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
