// @flow

import * as React from 'react';
import { View, Text } from 'react-native';
import { Show } from './Fixture';
import * as Style from './Style';
import { Stepper } from './Stepper';

let steps = [
  {
    title: '1. Weclome',
  },

  {
    title: '2. Account Information',
  },
  {
    title: '3. Privacy',
  },
  {
    title: '4. Submit',
  },
];

function Basic() {
  let [idx, setIdx] = React.useState(1);
  return (
    <View style={{ flexDirection: 'row' }}>
      <Show label="Basic">
        <Stepper
          steps={steps}
          activeIdx={idx}
          onPress={(_step, idx) => setIdx(idx)}
        />
      </Show>
    </View>
  );
}

export default {
  Basic: <Basic />,
};
