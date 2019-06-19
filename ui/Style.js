// @flow

import polychrome from 'polychrome';
import keyboardFocus from 'keyboard-focus';

if (typeof document !== 'undefined') {
  keyboardFocus(document);
}

import * as React from 'react';
import { StyleSheet } from 'react-native';

export type TextStyle = Object;
export type ViewStyle = Object;
export type color = string;

export type Theme = {|
  themeName: string,

  borderColor: color,

  textColor: color,
  titleColor: color,
  labelColor: color,
  linkColor: color,

  dimmedColor: color,

  backgroundColor: color,
  backgroundSecondaryColor: color,
  backgroundSelectedColor: color,
  backgroundHighlightedColor: color,

  success: {|
    backgroundColor: color,
    textColor: color,
  |},
  danger: {|
    backgroundColor: color,
    textColor: color,
  |},
|};

export let iOSPalette = {
  tint: {
    red: polychrome('rgb(255, 59, 48)'),
    orange: polychrome('rgb(255, 149, 0)'),
    yellow: polychrome('rgb(255, 204, 0)'),
    green: polychrome('rgb(76, 217, 100)'),
    teal: polychrome('rgb(90, 200, 250)'),
    blue: polychrome('rgb(0, 122, 255)'),
    purple: polychrome('rgb(88, 86, 214)'),
    pink: polychrome('rgb(255, 45, 85)'),
  },
};

function makeLightTheme(): Theme {
  let backgroundColor = polychrome('#f9f5f3');
  let backgroundSecondaryColor = polychrome('rgba(139, 75, 96, 0.10)');
  let titleColor = polychrome('#9c4663');
  let textColor = polychrome('#69273e');
  let linkColor = polychrome('#9c4663');
  let labelColor = polychrome('#9c4663');
  return {
    themeName: 'light',

    backgroundColor: backgroundColor.rgb(),
    backgroundSecondaryColor: backgroundSecondaryColor.rgb(),
    backgroundSelectedColor: '#93ddff',
    backgroundHighlightedColor: '#ffd12f',

    borderColor: backgroundColor.darken(25).rgb(),
    titleColor: titleColor.rgb(),
    textColor: textColor.rgb(),
    labelColor: labelColor.rgb(),
    linkColor: linkColor.rgb(),
    dimmedColor: labelColor.fadeOut(40).rgb(),

    success: {
      backgroundColor: '#008641',
      textColor: '#F7F7F7',
    },
    danger: {
      backgroundColor: '#FF3B30',
      textColor: '#F7F7F7',
    },
  };
}

function makeDarkTheme(): Theme {
  let backgroundColor = polychrome('#181818');
  return {
    themeName: 'dark',

    backgroundColor: backgroundColor.rgb(),
    backgroundSecondaryColor: backgroundColor.lighten(70).rgb(),
    backgroundSelectedColor: '#0b61a5',
    backgroundHighlightedColor: '#444444',

    borderColor: backgroundColor.lighten(100).rgb(),

    textColor: '#CCCCCC',
    titleColor: '#CCCCCC',
    labelColor: '#DDDDDD',
    linkColor: '#5AC8FA',
    dimmedColor: '#888888',

    success: {
      backgroundColor: '#00c861',
      textColor: '#F7F7F7',
    },
    danger: {
      backgroundColor: '#ff756d',
      textColor: '#F7F7F7',
    },
  };
}

export let lightTheme = makeLightTheme();
export let darkTheme = makeDarkTheme();

export let useFocusState = ({
  trackOnlyKeyboardFocus = false,
}: {|
  trackOnlyKeyboardFocus?: boolean,
|} = {}) => {
  let [focus, setFocus] = React.useState(false);
  let props = React.useMemo(() => {
    let onFocus = (e: UIEvent) => {
      if (trackOnlyKeyboardFocus) {
        // $FlowFixMe: ...
        if (typeof e.target.getAttribute === 'function') {
          // $FlowFixMe: ...
          let isKeyboard = e.target.getAttribute('keyboard-focus') != null;
          if (isKeyboard) {
            setFocus(true);
          }
        } else {
          setFocus(true);
        }
      } else {
        setFocus(true);
      }
    };
    let onBlur = () => setFocus(false);
    return { onFocus, onBlur };
  });
  return [focus, props];
};

let createDummyMediaQueryList = matches => {
  return {
    matches,
    addListener: _listener => {},
    removeListener: _listener => {},
  };
};

export function useMediaQuery(queryExpression: string, defaultValue?: boolean) {
  let dependencies = [queryExpression];

  let query = React.useMemo(
    () =>
      typeof window !== 'undefined'
        ? window.matchMedia(queryExpression)
        : createDummyMediaQueryList(Boolean(defaultValue)),
    dependencies,
  );

  let [matches, setMatches] = React.useState(query.matches);

  let handleQueryChange = React.useCallback(e => {
    setMatches(e.matches);
  }, dependencies);

  React.useEffect(() => {
    query.addListener(handleQueryChange);
    return () => query.removeListener(handleQueryChange);
  }, dependencies);

  return matches;
}

let prefersColorSchemeDark = '(prefers-color-scheme: dark)';

export function useDarkMode() {
  return useMediaQuery(prefersColorSchemeDark);
}

export type ThemeState = [Theme, (Theme) => void];

export type ThemeConfig = {|
  lightTheme: Theme,
  darkTheme?: Theme,
|};

export let useThemeState = (config: ThemeConfig) => {
  let lightTheme = config.lightTheme;
  let darkTheme = config.darkTheme || config.lightTheme;

  let isDarkMode = useDarkMode();
  let systemTheme = isDarkMode ? darkTheme : lightTheme;

  let [currentTheme, setTheme] = React.useState<?Theme>(null);
  let value = React.useMemo(() => {
    let theme: Theme = currentTheme != null ? currentTheme : systemTheme;
    return [theme, (setTheme: Theme => void)];
  }, [lightTheme, darkTheme, systemTheme, currentTheme]);
  return value;
};

export let useTheme = (defaultTheme?: Theme) => {
  let [theme, _setTheme] = React.useContext(ThemeContext);
  return theme;
};

export let ThemeContext = React.createContext<ThemeState>([
  typeof window !== 'undefined'
    ? window.matchMedia(prefersColorSchemeDark).matches
      ? darkTheme
      : lightTheme
    : lightTheme,
  () => {},
]);

export let WithTheme = ({
  children,
  themeConfig = {lightTheme, darkTheme}
}: {|
  children: React.Node,
  themeConfig?: ThemeConfig,
|}) => {
  let value = useThemeState(themeConfig);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export let useStyles = <T: { [name: string]: Object, ... }>(
  spec: Theme => T,
  dependencies?: $ReadOnlyArray<mixed>,
): $ObjMap<T, <V>(V) => Object> => {
  let [theme, _setTheme] = React.useContext(ThemeContext);
  if (dependencies == null) {
    dependencies = [theme.themeName];
  } else {
    dependencies = [...dependencies, theme.themeName];
  }
  let styles = React.useMemo(
    () => StyleSheet.create(spec(theme)),
    dependencies,
  );
  return styles;
};

export let useStyle = (
  spec: Theme => Object,
  dependencies?: $ReadOnlyArray<mixed>,
): Object => {
  let [theme, _setTheme] = React.useContext(ThemeContext);
  if (dependencies == null) {
    dependencies = [theme.themeName];
  } else {
    dependencies = [...dependencies, theme.themeName];
  }
  let styles = React.useMemo(
    () => StyleSheet.create({ root: spec(theme) }),
    dependencies,
  );
  return styles.root;
};

export let styles = StyleSheet.create({
  focus: {
    outlineStyle: 'auto',
    outlineColor: '-webkit-focus-ring-color',
  },
});
