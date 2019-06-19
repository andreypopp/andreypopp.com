// @flow

import invariant from 'invariant';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactUtil from './ReactUtil';
import * as Lang from './Lang';
import jsSpatialNav from './spatial-navigation';

type Directions = {|
  up?: boolean,
  down?: boolean,
  left?: boolean,
  right?: boolean,
|};

let allDirections: Directions = {
  up: true,
  down: true,
  left: true,
  right: true,
};

export type SpatialNavigation = {|
  focus(): void,
  moveUp(): void,
  moveDown(): void,
  moveLeft(): void,
  moveRight(): void,
|};

/**
 * Wrapper on top of js-spatial-navigation library.
 */
export function useSpatialNavigation(
  rootRef: {| current: ?HTMLElement |},
  options: {|
    directions?: Directions,
  |} = { directions: allDirections },
): SpatialNavigation {
  let { directions = allDirections } = options;

  let navid = React.useMemo(() => Lang.randomId(), []);

  React.useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    // This is a noop if done multiple times.
    jsSpatialNav.init();

    // This assumes:
    // 1. ref is set when effect is run
    // 2. ref doesn't change during component lifetime
    let rootElem = ReactUtil.findHTMLElement(rootRef.current);

    invariant(
      rootElem != null,
      'useSpatialNavigation: unable to determine root DOM element from ref',
    );

    rootElem.addEventListener('sn:willmove', (e: any) => {
      // check if direction is the supported one
      if (directions[e.detail.direction]) {
        return true;
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    });

    jsSpatialNav.add(navid, {
      selector: '[data-focusable="true"]',
      restrict: 'self-only',
      // straightOnly: true,
      enterTo: 'last-focused',
      navigableFilter: elem => {
        if (rootElem == null) {
          // unable to determine component root
          return false;
        } else {
          return rootElem !== elem && rootElem.contains(elem);
        }
      },
    });
    return function cleanup() {
      jsSpatialNav.remove(navid);
    };
  }, []);

  let driver = React.useMemo(() => ({
    focus: () => jsSpatialNav.focus(navid),
    moveUp: () => jsSpatialNav.move('up'),
    moveDown: () => jsSpatialNav.move('down'),
    moveLeft: () => jsSpatialNav.move('left'),
    moveRight: () => jsSpatialNav.move('right'),
  }));

  return driver;
}
