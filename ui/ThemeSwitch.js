// @flow

import * as React from 'react';
import * as Style from './Style';
import { View, TouchableOpacity } from 'react-native';
import { Sun, Moon } from 'react-feather';
import { Switch } from './Switch';

export let ThemeSwitch = () => {
  let [theme, setTheme] = React.useContext(Style.ThemeContext);
  let isDark = theme === Style.darkTheme;
  let onThemeChange = React.useCallback(isActive => {
    if (isActive) {
      setDarkTheme();
    } else {
      setLightTheme();
    }
  });
  let setLightTheme = React.useCallback(() => {
    setTheme(Style.lightTheme);
  });
  let setDarkTheme = React.useCallback(() => {
    setTheme(Style.darkTheme);
  });
  let styles = Style.useStyles(theme => ({
    root: {
      display: 'inline-flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
  }));
  return (
    <View style={styles.root}>
      <Switch
        accessibilityLabel="Dark/Light theme switcher"
        thumbColor={{ on: theme.labelColor, off: theme.labelColor }}
        value={isDark}
        onValueChange={onThemeChange}
        size={24}
        TrackIconOn={Sun}
        TrackIconOff={Moon}
        ThumbIconOn={Moon}
        ThumbIconOff={Sun}
      />
    </View>
  );
};
