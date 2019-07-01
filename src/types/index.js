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
	| "YesNo";

export type InputPropsType = {
	[InputTypeEnums]: { [key: string]: any },
};

export type InputPropsValueType = { [key: string]: any };