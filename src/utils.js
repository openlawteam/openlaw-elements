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
