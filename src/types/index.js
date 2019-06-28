// @flow

export type InputTypeEnums =
	"*"
	| "Address"
	| "Choice"
	| "Date"
	| "Identity"
	| "Image"
	| "LargeText"
	| "Number"
	| "Text"
	| "YesNo"
	| "ExternalSignature";

export type InputPropsType = {
	[InputTypeEnums]: { [string]: any },
};

export type InputPropsValueType = { [string]: any };

export type ValidityErrorObjectType = {
  errorMessage?: string,
  isError: boolean,
};

export type ValidityFuncType = (string, string) => ValidityErrorObjectType;

export type ValidateOnKeyUpFuncType = (SyntheticKeyboardEvent<HTMLInputElement>, ?boolean) => mixed;

export type FieldErrorType = {|
	message: string,
	name: string,
	// these ref HTMLElement types are handled inside each component
	reactRef: {current: null | any},
	type: (
		"Address" 
		| "Choice" 
		| "Collection" 
		| "Identity" 
		| "Image" 
		| "Number" 
		| "Structure" 
		| "Text"
	),
|};

export type FieldErrorFuncType = ?(FieldErrorType) => mixed;
