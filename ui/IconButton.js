// @flow

import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native-web';
import Router from 'next/router';
import * as Style from './Style';
import * as Lang from './Lang';

type IconProps = {| size: number | string, style: Object |};

type P = {|
  onPress?: UIEvent => void,
  renderIcon: IconProps => React.Node,
  backgroundColor?: Style.color,
  iconColor?: Style.color,
  borderColor?: Style.color,
  disabled?: boolean,
  pinRight?: boolean,
  pinLeft?: boolean,
|};

export let IconButton = ({
  onPress,
  renderIcon,
  disabled,
  backgroundColor,
  iconColor,
  borderColor,
  pinLeft,
  pinRight,
}: P) => {
  let theme = Style.useTheme();

  iconColor = iconColor != null ? iconColor : theme.labelColor;
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
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
        height: '1em',
      },
      rootDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    }),
    [backgroundColor, iconColor, borderColor, pinLeft, pinRight, borderRadius],
  );

  let icon = React.useMemo(() => {
    let icon = renderIcon({
      style: { paddingTop: '0.05em', color: iconColor },
      size: '1em',
    });
    return <View>{icon}</View>;
  }, [iconColor, renderIcon, styles]);

  return (
    <TouchableOpacity
      disabled={disabled}
      accessibilityRole="button"
      style={[styles.root, disabled && styles.rootDisabled]}
      onPress={onPress}
    >
      {icon}
    </TouchableOpacity>
  );
};
