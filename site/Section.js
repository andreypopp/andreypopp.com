// @flow

import * as React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import * as UI from 'ui';
import * as Style from 'ui/Style';

export let Section = (props: {| children: React.Node, title: string |}) => {
  let styles = Style.useStyles(theme => ({
    root: {
      padding: 10,
      backgroundColor: theme.backgroundSecondaryColor,
      width: '100%',
      borderTopWidth: 2,
      borderTopColor: theme.dimmedColor,
      paddingVertical: 10,
    },
    title: {
      color: theme.dimmedColor,
      fontWeight: '900',
      fontSize: '8pt',
      textTransform: 'uppercase',
    },
    children: {
      paddingTop: 10,
    },
  }));
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{props.title}</Text>
      <View style={styles.children}>{props.children}</View>
    </View>
  );
};
