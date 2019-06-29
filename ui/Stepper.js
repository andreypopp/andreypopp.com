// @flow

import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native-web';
import { useStyles, fontSize } from 'ui/Style';

export type Step = {|
  title: string,
  disabled?: boolean,
|};

export type StepperProps = {|
  steps: Step[],
  activeIdx: number,
  isStepDisabled?: (Step, activeId: number) => boolean,
  onPress?: (Step, number) => void,
|};

export function Stepper(props: StepperProps) {
  let stepWidth = `${100 / props.steps.length}%`;
  let styles = useStyles(theme => ({
    root: {
      flexDirection: 'row',
      flexGrow: 1,
      flexShrink: 0,
      alignItems: 'flex-end',
    },
    step: {
      flexGrow: 0,
      flexShrink: 0,
      marginHorizontal: 4,
      paddingVertical: 8,
      borderColor: theme.titleColor,
      borderBottomWidth: 2,
      width: stepWidth,
    },
    stepActive: {
      borderBottomWidth: 6,
    },
    stepTitle: {
      color: theme.titleColor,
      fontSize: fontSize.normal,
    },
    stepTitleActive: {
      color: theme.titleColor,
      fontWeight: '600',
    },
  }), [stepWidth]);
  let { onPress, activeIdx, isStepDisabled } = props;
  let steps = props.steps.map((step, idx) => {
    let active = activeIdx === idx;
    let disabled =
      isStepDisabled != null ? isStepDisabled(step, activeIdx) : false;
    let handlePress = onPress != null ? () => onPress(step, idx) : null;
    return (
      <TouchableOpacity
        key={idx}
        style={[styles.step, active && styles.stepActive]}
        disabled={disabled}
        onPress={handlePress}
      >
        <Text style={[styles.stepTitle, active && styles.stepTitleActive]}>
          {step.title}
        </Text>
      </TouchableOpacity>
    );
  });
  return <View style={styles.root}>{steps}</View>;
}
