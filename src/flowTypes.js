// @flow

export type ObjectAnyType = { [string]: any };

// All OpenLaw types which have representation in the Elements library
export type FieldEnumType =
	"Address"
	| "Choice"
	| "Date"
	| "DateTime" // renders to <DatePicker />
	| "EthAddress" // renders to <Text />
	| "ExternalSignature"
	| "Identity"
	| "Image"
	| "LargeText"
	| "Number"
	| "Period" // renders to <Text />
	| "Text"
	| "YesNo";

// Extends FieldEnumType to include a special "*" for selecting all input types.
// Useful for `inputProps`.
export type FieldAndWildcardEnumType =
	"*"
	| FieldEnumType;

export type ValidateOnKeyUpFuncType = (SyntheticKeyboardEvent<HTMLInputElement>, ?boolean) => mixed;

export type FieldErrorType = {|
	elementName: string,
	elementType: FieldEnumType,
	errorMessage: string,
	eventType: "blur" | "change",
	isError: boolean,
	value: string,
|};

export type FieldPropsType = {
	[FieldAndWildcardEnumType]: {
		[string]: any,
	},
};

export type FieldPropsValueType = {
	[string]: any,
	onBlur?: (SyntheticFocusEvent<any>) => mixed,
	onChange?: (SyntheticInputEvent<any>) => mixed,
};

export type OnChangeFuncType = (string, (string | void)) => mixed;

export type OnValidateObjectReturnType = {
	errorMessage?: string,
};

export type OnValidateFuncType = (FieldErrorType) => ?OnValidateObjectReturnType;

export type ValidityErrorObjectType = {
  errorMessage?: string,
  isError: boolean,
};

export type ValidityFuncType = (string, string) => ValidityErrorObjectType;