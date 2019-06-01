// @flow

import invariant from 'invariant';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export function findHTMLElement(
  elem: React.Component<any> | HTMLElement | null | void,
): HTMLElement | null {
  if (elem == null) {
    return null;
  } else {
    let found = ReactDOM.findDOMNode(elem);
    invariant(
      found instanceof HTMLElement,
      'findHTMLElement: expected HTMLElement',
    );
    return found;
  }
}

export function setRef<T: React.ElementType>(
  ref: React.Ref<T>,
  value: null | T,
) {
  if (typeof ref === 'function') {
    // $FlowFixMe: ...
    ref(value);
  } else if (typeof ref === 'object') {
    // $FlowFixMe: ...
    ref.current = value;
  } else {
    invariant('setRef: string refs are not supported');
  }
}

export function composeRef<T: React.ElementType>(
  a: React.Ref<T>,
  b: React.Ref<T>,
): React.Ref<T> {
  // $FlowFixMe: ...
  return React.useCallback(
    (value: null | T) => {
      setRef(a, value);
      setRef(b, value);
    },
    [a, b],
  );
}
