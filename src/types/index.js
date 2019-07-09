// @flow

export type ObjectAnyType = { [string]: any };

// All OpenLaw Elements field/input types
export type FieldEnumType =
	"Address"
	| "Choice"
	| "Date"
	| "Identity"
	| "Image"
	| "LargeText"
	| "Number"
	| "Text"
	| "YesNo"
	| "ExternalSignature";

// Extends FieldEnumType to include a special "*" for selecting all input types.
// Useful for `inputProps`.
export type FieldAndWildcardEnumType =
	"*"
	| FieldEnumType;

// All OpenLaw variable types
export type VariableTypesEnumType =
	FieldEnumType
	| "DateTime"
	| "EthAddress"
	| "Period";

// OpenLaw variable types which render into a <Text /> component
export type TextTypesEnumType =
	"EthAddress"
	| "Period"
	| "Text";

export type ValidateOnKeyUpFuncType = (SyntheticKeyboardEvent<HTMLInputElement>, ?boolean) => mixed;

export type FieldErrorType = {|
	elementName: string,
	elementType: VariableTypesEnumType,
	errorMessage: string,
	eventType: "blur" | "change",
	isError: boolean,
	value: string,
|};

export type FieldErrorFuncType = ?(FieldErrorType) => mixed;

export type FieldPropsType = {
	[FieldAndWildcardEnumType]: {
		[string]: any,
	},
};

export type FieldPropsValueType = {
	[string]: any,
};

export type ValidityErrorObjectType = {
  errorMessage?: string,
  isError: boolean,
};

export type ValidityFuncType = (string, string) => ValidityErrorObjectType;
