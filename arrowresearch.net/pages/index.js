// @flow

import * as React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import * as UI from 'ui';
import * as Style from 'ui/Style';
import { Content, Link } from 'ui/Content';
import { Page } from '../Page';

export default (props: {| shouldRestoreScrollPosition?: boolean |}) => {
  let styles = Style.useStyles(theme => ({
    me: {
      paddingVertical: 50,
    },
  }));
  return (
    <Page shouldRestoreScrollPosition={props.shouldRestoreScrollPosition}>
      <View style={styles.me}>
        <Content>
          <p>
            <bold>ARROW</bold>RESEARCH is a group of software engineers who do
            love working on challenging problems. We specialize in building
            products for <bold>data management</bold> and{' '}
            <bold>development tools</bold>. We know how to incrementally improve{' '}
            <bold>legacy systems</bold> without disruptions.
          </p>
          <p>
            We prioritize working on robust and maintainable software and
            therefore our technology of choice is <bold>ReasonML/OCaml</bold>.
            We also have expertise working with <bold>JavaScript</bold>,{' '}
            <bold>Python</bold>, <bold>Erlang</bold>, <bold>C</bold> programming
            languages.
          </p>
        </Content>
      </View>
    </Page>
  );
};
