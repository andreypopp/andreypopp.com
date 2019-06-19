// @flow

import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native-web';
import Router from 'next/router';
import * as Style from './Style';
import * as Lang from './Lang';

type IconProps = {| size: number | string, style: Object |};

type P = {|
  label: string,
  onPress?: UIEvent => void,
  renderIcon?: IconProps => React.Node,
  backgroundColor?: Style.color,
  labelColor?: Style.color,
  borderColor?: Style.color,
  disabled?: boolean,
  pinRight?: boolean,
  pinLeft?: boolean,
|};

export let Button = ({
  onPress,
  label,
  renderIcon,
  disabled,
  backgroundColor,
  labelColor,
  borderColor,
  pinLeft,
  pinRight,
}: P) => {
  let theme = Style.useTheme();

  labelColor = labelColor != null ? labelColor : theme.labelColor;
  borderColor = borderColor != null ? borderColor : 'transparent';

  let borderRadius = 2;

  let styles = Style.useStyles(
    theme => ({
      root: {
        borderTopLeftRadius: pinLeft ? 0 : borderRadius,
        borderBottomLeftRadius: pinLeft ? 0 : borderRadius,
        borderTopRightRadius: pinRight ? 0 : borderRadius,
        borderBottomRightRadius: pinRight ? 0 : borderRadius,
        borderWidth: 2,
        borderRightWidth: pinRight ? null : 2,
        borderLeftWidth: pinLeft ? null : 2,
        borderColor: borderColor,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
        height: '1.5em',
      },
      rootDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
      label: {
        color: labelColor,
        fontSize: '9pt',
        fontWeight: '700',
        textAlign: 'center',
        textTransform: 'uppercase',
      },
      icon: {
        paddingRight: 4,
      },
    }),
    [backgroundColor, labelColor, borderColor, pinLeft, pinRight, borderRadius],
  );

  let icon = React.useMemo(() => {
    if (renderIcon != null) {
      let icon = renderIcon({
        style: { paddingTop: '0.05em', color: labelColor },
        size: '0.8em',
      });
      return <View style={styles.icon}>{icon}</View>;
    } else {
      return null;
    }
  }, [labelColor, renderIcon, styles]);

  return (
    <TouchableOpacity
      disabled={disabled}
      accessibilityRole="button"
      style={[styles.root, disabled && styles.rootDisabled]}
      onPress={onPress}
    >
      {icon}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};
