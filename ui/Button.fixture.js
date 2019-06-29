// @flow

import * as React from 'react';
import * as Icon from 'react-feather';
import { View, Text } from 'react-native';
import { Show } from './Fixture';
import { Button } from './Button';
import { useStyles } from './Style';

function Demo({ label, render }) {
  let styles = useStyles(theme => ({
    root: {},
    demo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      maxWidth: 250,
    },
    label: {
      padding: 10,
    },
    labelText: {
      color: theme.labelColor,
      fontWeight: '700',
    },
  }));
  return (
    <View style={styles.root}>
      <View style={styles.label}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <View style={styles.demo}>
        <Show label="default">{render({})}</Show>
        <Show label="disabled">{render({ disabled: true })}</Show>
      </View>
    </View>
  );
}

export default {
  Basic: (
    <View>
      <Demo
        label="Basic"
        render={props => <Button {...props} label="Press Me" />}
      />
      <Demo
        label="With custom labelColor"
        render={props => (
          <Button {...props} label="Press Me" labelColor="#007AFF" />
        )}
      />
      <Demo
        label="With custom backgroundColor and labelColor"
        render={props => (
          <Button
            {...props}
            label="Press Me"
            backgroundColor="#007AFF"
            labelColor="#EEEEEE"
          />
        )}
      />
      <Demo
        label="With icon"
        render={props => (
          <Button
            {...props}
            renderIcon={props => <Icon.Plus {...props} />}
            label="Press Me"
          />
        )}
      />
      <Demo
        label="With icon and custom labelColor"
        render={props => (
          <Button
            {...props}
            renderIcon={props => <Icon.Plus {...props} />}
            labelColor="#FF2D55"
            label="Press Me"
          />
        )}
      />
      <Demo
        label="With icon and custom backgroundColor and labelColor"
        render={props => (
          <Button
            {...props}
            renderIcon={props => <Icon.Plus {...props} />}
            labelColor="#EEEEEE"
            backgroundColor="#5856D6"
            label="Press Me"
          />
        )}
      />
    </View>
  ),
};
