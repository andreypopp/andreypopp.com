// @flow

import * as React from 'react';
import { Text } from 'react-native-web';
import { Link } from './Link';
import * as Lang from './Lang';
import * as Style from './Style';

let Render = (props: {||}) => {
  let style = Style.useStyle(theme => ({ color: theme.textColor }));
  return (
    <Text style={style}>
      This is a{' '}
      <Link href="/somepage" onPress={Lang.emptyFunctionThatReturns(true)}>
        link to some page
      </Link>{' '}
      in the app.
    </Text>
  );
};

export default {
  Basic: <Render />,
};
