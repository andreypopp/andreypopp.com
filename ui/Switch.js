/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Andrey Popp
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import { View, StyleSheet, createElement } from 'react-native';
import { Sun, Moon } from 'react-feather';
import * as Style from './Style';

type IconProps = {|
  size?: number,
  style?: Object,
|}

export type P = {|
  value: boolean,
  onValueChange: boolean => void,
  accessibilityLabel?: string,
  disabled?: boolean,
  size?: number,
  ThumbIconOff?: React.AbstractComponent<IconProps>,
  ThumbIconOn?: React.AbstractComponent<IconProps>,
  TrackIconOff?: React.AbstractComponent<IconProps>,
  TrackIconOn?: React.AbstractComponent<IconProps>,
  trackColor?: {| on: Style.color, off: Style.color |},
  thumbColor?: {| on: Style.color, off: Style.color |},
|};

export function Switch(props: P) {
  let theme = Style.useTheme();
  let {
    value,
    onValueChange,
    accessibilityLabel,
    disabled = false,
    size = 20,
    ThumbIconOn,
    ThumbIconOff,
    TrackIconOn,
    TrackIconOff,
    trackColor = { on: theme.dimmedColor, off: theme.dimmedColor },
    thumbColor = { on: theme.labelColor, off: theme.dimmedColor },
  } = props;

  let iconSize = size - 12;
  let disabledOpacity = 0.5;

  let styles = Style.useStyles(
    theme => ({
      root: {
        cursor: 'pointer',
        userSelect: 'none',
        height: size,
        width: size * 2,
      },
      cursorDefault: {
        cursor: 'default',
      },
      cursorInherit: {
        cursor: 'inherit',
      },
      track: {
        ...StyleSheet.absoluteFillObject,
        borderColor: trackColor.off,
        borderWidth: 2,
        borderRadius: size * 0.5,
        height: '100%',
        margin: 'auto',
        transitionDuration: '0.1s',
        width: '100%',
      },
      trackOn: {
        borderColor: trackColor.on,
      },
      trackDisabled: {
        opacity: disabledOpacity,
      },
      thumb: {
        height: size,
        width: size,
        alignSelf: 'flex-start',
        borderWidth: 2,
        borderRadius: '100%',
        borderColor: thumbColor.off,
        start: '0%',
        transform: [{ translateZ: 0 }],
        transitionDuration: '0.1s',
      },
      thumbOn: {
        start: '100%',
        borderColor: thumbColor.on,
      },
      thumbDisabled: {
        borderColor: theme.dimmedColor,
        opacity: disabledOpacity,
      },
      nativeControl: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
        margin: 0,
        opacity: 0,
        padding: 0,
        width: '100%',
      },
      iconOff: {
        position: 'absolute',
        top: (size - iconSize) / 2,
        left: (size - iconSize) / 2,
      },
      iconOn: {
        position: 'absolute',
        top: (size - iconSize) / 2,
        right: (size - iconSize) / 2,
      },
    }),
    [
      size,
      iconSize,
      trackColor.on,
      trackColor.off,
      thumbColor.on,
      thumbColor.off,
    ],
  );

  let [focus, focusProps] = Style.useFocusState({
    trackOnlyKeyboardFocus: true,
  });

  let trackStyle = [
    styles.track,
    value && styles.trackOn,
    focus && Style.styles.focus,
    disabled && styles.trackDisabled,
  ];

  let thumbStyle = [
    styles.thumb,
    value && styles.thumbOn,
    disabled && styles.thumbDisabled,
    { marginStart: value ? size * -1 : 0 },
  ];

  let _handleChange = React.useCallback(
    (event: Object) => {
      if (onValueChange != null) {
        onValueChange(event.nativeEvent.target.checked);
      }
    },
    [onValueChange],
  );

  let nativeControl = createElement('input', {
    accessibilityLabel,
    checked: value,
    disabled: disabled,
    onChange: _handleChange,
    style: [styles.nativeControl, styles.cursorInherit],
    type: 'checkbox',
    ...focusProps,
  });

  return (
    <View style={[styles.root, disabled && styles.cursorDefault]}>
      <View style={trackStyle} />
      {!value && ThumbIconOff != null ? (
        <View style={styles.iconOff}>
          <ThumbIconOff
            style={{
              color: thumbColor.off,
              opacity: disabled ? disabledOpacity : 1,
            }}
            size={iconSize}
          />
        </View>
      ) : null}
      {value && TrackIconOn != null ? (
        <View style={styles.iconOff}>
          <TrackIconOn
            style={{
              color: trackColor.on,
              opacity: disabled ? disabledOpacity : 1,
            }}
            size={iconSize}
          />
        </View>
      ) : null}
      {value && ThumbIconOn != null ? (
        <View style={styles.iconOn}>
          <ThumbIconOn
            style={{
              color: thumbColor.on,
              opacity: disabled ? disabledOpacity : 1,
            }}
            size={iconSize}
          />
        </View>
      ) : null}
      {!value && TrackIconOff != null ? (
        <View style={styles.iconOn}>
          <TrackIconOff
            style={{
              color: trackColor.off,
              opacity: disabled ? disabledOpacity : 1,
            }}
            size={iconSize}
          />
        </View>
      ) : null}
      <View style={thumbStyle} />
      {nativeControl}
    </View>
  );
}
