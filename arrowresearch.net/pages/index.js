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
            <em>ARROW</em>RESEARCH is a group of software engineers who do love
            working on challenging problems. We specialize in building products
            for <em>data management</em> and <em>development tools</em>. We know
            how to incrementally improve <em>legacy systems</em> without
            disruptions.
          </p>
          <p>
            We prioritize working on robust and maintainable software and
            therefore our technology of choice is <em>ReasonML/OCaml</em>. We
            also have expertise working with <em>JavaScript</em>,{' '}
            <em>Python</em>, <em>Erlang</em>, <em>C</em> programming languages.
          </p>
          <p>
            Contact us at{' '}
            <em>
              <Link href="mailto:hello@arrowresearch.net">
                hello@arrowresearch.net
              </Link>
            </em>
            .
          </p>
        </Content>
      </View>
    </Page>
  );
};
