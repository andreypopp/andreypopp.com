// @flow

import * as React from 'react';
import { Text, ScrollView, View, TouchableOpacity } from 'react-native-web';
import {Content} from 'ui';
import { Page } from './Page';

type P = {
  children: React.Node,
  title?: string | string[],
};

export let Post = (props: P) => {
  let { children, title } = props;
  return (
    <Page showBackLink title={title}>
      <Content>{children}</Content>
    </Page>
  );
};
