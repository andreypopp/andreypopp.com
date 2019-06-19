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
          <p>heello</p>
        </Content>
      </View>
    </Page>
  );
};
