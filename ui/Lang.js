// @flow

export function emptyFunction(...args: mixed[]) {
  return;
}

export function idFunction<T>(v: T): T {
  return v;
}

export function preventDefault(e: UIEvent): void {
  e.preventDefault();
}

export function emptyFunctionThatReturns<T>(v: T): (...args: mixed[]) => T {
  return () => v;
}

export let emptyObject = {};

let alphabet =
  'bjectSymhasOwnPropABCDEFGHIJKLMNQRTUVWXYZ_dfgiklquvxz';

/**
 * Vendored non-secure nanoid
 *
 * @license MIT
 * @copyright 2017 Andrey Sitnik <andrey@sitnik.ru>
 */
export function randomId(size?: number = 21) {
  let id = '';
  while (0 < size--) {
    id += alphabet[(Math.random() * 53) | 0];
  }
  return id;
}
