// @flow

import * as React from 'react';
import { View, Text } from 'react-native-web';
import { ThemeSwitch } from './ThemeSwitch';
import * as Style from './Style';

let DemoInner = ({ children }: { children: React.Node }) => {
  let styles = Style.useStyles(theme => ({
    root: {
      backgroundColor: theme.backgroundColor,
    },
    toolbar: {
      paddingVertical: 20,
    },
    wrapper: {
      padding: 20,
    },
  }));
  return (
    <View style={styles.root}>
      <View style={styles.toolbar}>
        <ThemeSwitch />
      </View>
      <View style={styles.wrapper}>{children}</View>
    </View>
  );
};

export let Show = ({
  label,
  desc,
  children,
}: {|
  label: string,
  desc?: string,
  children: React.Node,
|}) => {
  let styles = Style.useStyles(theme => ({
    demo: {
      padding: 10,
      flexGrow: 1,
      flexShrink: 0,
    },
    label: {
      paddingBottom: 10,
    },
    labelText: {
      fontSize: '10pt',
      fontWeight: '600',
      color: theme.dimmedColor,
    },
  }));
  return (
    <View style={styles.demo}>
      <View style={styles.label}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <View>{children}</View>
    </View>
  );
};

export let Demo = ({ children }: { children: React.Node }) => {
  return (
    <Style.WithTheme>
      <DemoInner>{children}</DemoInner>
    </Style.WithTheme>
  );
};
