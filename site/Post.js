// @flow

import * as React from 'react';
import { Text, ScrollView, View, TouchableOpacity } from 'react-native-web';
import { Content, useStyles } from 'ui';
import { Page } from './Page';

let index = require('./writings-index.compute');

type P = {
  children: React.Node,
  title?: string | string[],
};

export let Post = (props: P) => {
  let { children, title } = props;
  let post = null;
  for (let item of index) {
    if (item.title === title) {
      post = item;
      break;
    }
  }
  let styles = useStyles(theme => ({
    subtitle: {
      color: theme.dimmedColor,
      fontWeight: '600',
    },
  }));
  let subtitle =
    post != null ? (
      <Text style={styles.subtitle}>
        published on {post.date.year}/{post.date.month}/{post.date.day}
      </Text>
    ) : null;
  return (
    <Page showBackLink title={title} subtitle={subtitle}>
      <Content>{children}</Content>
    </Page>
  );
};
