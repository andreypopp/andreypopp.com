// @flow

import * as React from 'react';
import {View} from 'react-native-web';

export type Step = {|
  title: string,
  children: React.Node,
|};

export type StepperProps = {|
  steps: Step[]
|};

export function Stepper(props: StepperProps) {
  return <View>
  </View>;
}
