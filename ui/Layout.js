// @flow

import invariant from 'invariant';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ResizeObserver from 'resize-observer-polyfill';

/**
 * Compute size of the DOM element.
 *
 * Usage:
 *
 *   let WithSize = (props) => {
 *     let [size, ref] = useDOMSize()
 *
 *     return (
 *       <div ref={ref}>
 *         {size != null ? JSON.stringify(size) : null}
 *       </div>
 *     )
 *   }
 */
export function useDOMSize(): [
  ?{ height: number, width: number },
  (null | HTMLElement) => void,
] {
  let [size, setSize] = React.useState(null);
  let elementRef = React.useRef(null);
  let observerRef = React.useRef(null);

  // Recalculate dimensions on ResizeObserver callback
  let onResize = entries => {
    let entry = entries[0];
    invariant(
      entry != null,
      'useDOMSize: missing records in ResizeObserver callback',
    );
    invariant(
      entry.target === elementRef.current,
      'useDOMSize: invalid target in ResizeObserver callback entries',
    );
    let { width, height } = entry.contentRect;
    setSize({ width, height });
  };

  // Handle element mount/unmount
  let onElement = React.useMemo(
    () => component => {
      let element = ReactDOM.findDOMNode(component);

      if (elementRef.current === element) {
        // Skip doing work if element is the same.
        return;
      }

      if (element != null) {
        invariant(
          element instanceof HTMLElement,
          'useDOMSize: Not an HTMLElement',
        );
        let { width, height } = element.getBoundingClientRect();
        setSize({ width, height });

        if (observerRef.current == null) {
          observerRef.current = new ResizeObserver(onResize);
        }
        observerRef.current.observe(element);
        elementRef.current = element;
      } else {
        if (observerRef.current != null && elementRef.current != null) {
          observerRef.current.unobserve(elementRef.current);
        }
        elementRef.current = null;
      }
    },
    [],
  );

  // Tear down ResizeObserver on unmount
  React.useEffect(() => {
    return function cleanup() {
      if (observerRef.current != null) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return [size, onElement];
}
