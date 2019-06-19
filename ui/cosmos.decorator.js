// @flow

import * as React from 'react';
import * as Fixture from './Fixture';

export default ({ children }: {| children: React.Node |}) => (
  <Fixture.Demo>{children}</Fixture.Demo>
);
