// @flow

import * as React from 'react';
import { View, Text, CheckBox } from 'react-native';
import { Show } from './Fixture';
import * as Style from './Style';

export default {
  Basic: (
    <View style={{ flexDirection: 'row' }}>
      <Show label="false">
        <CheckBox value={false} />
      </Show>
      <Show label="true">
        <CheckBox value={true} />
      </Show>
      <Show label="disabled, false">
        <CheckBox value={true} disabled={true} />
      </Show>
      <Show label="disabled, true">
        <CheckBox value={true} disabled={true} />
      </Show>
    </View>
  ),
};
