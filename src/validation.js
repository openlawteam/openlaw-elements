// @flow

import { FIELD_DEFAULT_ERROR_MESSAGE, TYPE_TO_READABLE } from './constants';
import type {
  FieldEnumType,
  FieldErrorType,
  ImageValueType,
  ObjectAnyType,
  OnValidateFuncType,
  ValidityFuncType,
} from './flowTypes';

type PropsType = {
  cleanName: string,
  getValidity: ValidityFuncType,
  name: string,
  onValidate: ?OnValidateFuncType,
  savedValue: string,
  variableType: FieldEnumType,
};

type ValidationReturnType = {
  errorData: FieldErrorType,
  shouldShowError: boolean,
};

export const getGenericErrorMessage = (variableType: FieldEnumType, includeVariableType: boolean = true) => {
  const readableVariableType: string = TYPE_TO_READABLE[variableType];

  if (includeVariableType) {
    return `${(readableVariableType ? `${readableVariableType}: ` : '')}${FIELD_DEFAULT_ERROR_MESSAGE}`;
  }
  return `${FIELD_DEFAULT_ERROR_MESSAGE}`;
};

export const onBlurValidation = (value: string, props: ObjectAnyType, state?: ObjectAnyType): ValidationReturnType => {
  const { cleanName, getValidity, name, onValidate, savedValue, variableType }: PropsType = props;
  const baseErrorData = {
    elementName: cleanName,
    elementType: variableType,
    errorMessage: '',
    isError: false,
    value: (savedValue || ''),
  };

  // check validity
  const { isError } = value.length > 0
    ? getValidity(name, value)
    : (variableType === 'Identity' || variableType === 'ExternalSignature') && (state && state.currentValue.length)
    ? getValidity(name, value)
    : {};

  const errorDataToSend = {
    ...baseErrorData,

    errorMessage: isError ? getGenericErrorMessage(variableType) : '',
    eventType: 'blur',
    isError: isError || false,
    value,
  };

  // call user's onValidate function
  const returnedValidationData = onValidate && onValidate(errorDataToSend);

  // determine error message & visibility
  const errorMessage = (returnedValidationData && typeof returnedValidationData.errorMessage === 'string')
    ? returnedValidationData.errorMessage
    : errorDataToSend.errorMessage;

  const shouldShowError =
    (returnedValidationData && returnedValidationData.errorMessage)
      ? true
      : (returnedValidationData && returnedValidationData.errorMessage === '')
      ? false
      : isError || false;

  return {
    errorData: {
      ...errorDataToSend,

      errorMessage,
    },
    shouldShowError,
  };
};

export const onChangeValidation = (value: string | ImageValueType, props: ObjectAnyType, state: ObjectAnyType): ValidationReturnType => {
  const { cleanName, getValidity, name, onValidate, variableType }: PropsType = props;
  const isIdentityType = (variableType === 'Identity' || variableType === 'ExternalSignature');

  // check validity
  const { isError } = (typeof value === 'string') && (value.length > 0 || isIdentityType)
    ? getValidity(name, value)
    : (typeof value === 'object') && (variableType === 'Image') 
    ? getValidity(name, value.value)
    : {};

  const errorDataToSend = {
    elementName: cleanName,
    elementType: variableType,
    errorMessage: isError ? getGenericErrorMessage(variableType) : '',
    eventType: 'change',
    isError: isError || false,
    value: value || '',
  };

  // call user's onValidate function
  const returnedValidationData = onValidate && onValidate(errorDataToSend);

  // determine error message & visibility
  const errorMessage = (returnedValidationData && typeof returnedValidationData.errorMessage === 'string')
    ? returnedValidationData.errorMessage
    : state.errorMessage;

  const shouldShowError =
    (returnedValidationData && returnedValidationData.errorMessage)
      ? true
      : (returnedValidationData && returnedValidationData.errorMessage === '')
      ? false
      : state.shouldShowError;

  return {
    errorData: {
      ...errorDataToSend,

      errorMessage,
    },
    shouldShowError,
  };
};
