// @flow

/**
* cacheValue
*
* A simple, half-implementation of a memoization function.
* We disregard the inputs needing to be the same. In our case
* the objects from Openlaw methods always will cause the arguments to change.
* 
* @param isEqualFn<(any, any) => boolean> Any function that can compare two things and return a boolean.
* @returns <any> Any value, cached, or new.
*/
export const cacheValue = (isEqualFn: (any, any) => boolean) => {
  let cachedValue: any;
  return (value: any) => {
    if (isEqualFn && isEqualFn(cachedValue, value)) return cachedValue;

    cachedValue = value;
    return value;
  };
};

/**
* classNameCleanSpace
*
* Cleans up multiple spaces and replaces with single.
* Makes things a bit easier if you ever need to split className
* to an array without empty strings. It also makes HTML source appear cleaner.
* 
* @param className<String> Any className string.
* @returns <String> Clean, single-spaced className list.
*/
export const singleSpaceString = (className: string) => {
  return className.trim().replace(/\s{2,}/, ' ');
};
