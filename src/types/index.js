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
	[InputTypeEnums]: { [key: string]: any },
};

export type InputPropsValueType = { [string]: any };

export type ValidityErrorObjectType = {
  errorMessage?: string,
  isError: boolean,
};

export type ValidityFuncType = (string, string) => ValidityErrorObjectType;

export type ValidateOnKeyUpFuncType = (SyntheticKeyboardEvent<HTMLInputElement>, ?boolean) => mixed;
