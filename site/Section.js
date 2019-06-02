// @flow

import * as React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import * as UI from 'ui';
import * as Style from 'ui/Style';

export let Section = (props: {| children: React.Node, title: string |}) => {
  let styles = Style.useStyles(theme => ({
    root: {
      width: '100%',
    },
    title: {
      paddingBottom: 5,
      borderBottomWidth: 2,
      borderBottomColor: theme.dimmedColor,
    },
    titleText: {
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
      <View style={styles.title}>
      <Text style={styles.titleText}>{props.title}</Text>
    </View>
      <View style={styles.children}>{props.children}</View>
    </View>
  );
};
