// @flow

import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import * as Icon from 'react-feather';
import * as UI from 'ui';
import * as Style from 'ui/Style';
import { Logo } from './Logo';

let scrollPositionByPath = new Map();

export let Page = ({
  children,
  title,
  subtitle,
  shouldRestoreScrollPosition,
  showBackLink,
}: {|
  children: React.Node,
  title?: string | string[],
  subtitle?: React.Node,
  showBackLink?: boolean,
  shouldRestoreScrollPosition?: boolean,
|}) => {
  let [size, sizeRef] = UI.useDOMSize();
  let isWideScreen = size != null && size.width > 700;

  React.useEffect(() => {
    if (title != null) {
      document.title = Array.isArray(title) ? title.join() : title;
    } else {
      document.title = `Arrow Research`;
    }
  }, [title]);

  let layoutStyle = UI.useStyle(
    theme => ({
      width: isWideScreen ? 700 : 350,
    }),
    [isWideScreen],
  );

  let styles = UI.useStyles(theme => ({
    root: {
      backgroundColor: theme.backgroundColor,
      flexGrow: 1,
    },
    children: {
      alignItems: 'flex-start',
      paddingBottom: 80,
    },
    header: {
      alignItems: 'center',
    },
    wrapper: {
      alignItems: 'center',
      flexBasis: 0,
    },
  }));

  let headerElement = React.useMemo(() => {
    return (
      <PageHeader
        showBackLink={showBackLink}
        title={title}
        subtitle={subtitle}
      />
    );
  }, [showBackLink, title, subtitle]);

  let footerElement = React.useMemo(() => {
    return <PageFooter layoutStyle={layoutStyle} />;
  }, [layoutStyle]);

  let scrollerRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollPositionByPath.has(window.location.pathname)) {
      let offsetY = scrollPositionByPath.get(window.location.pathname);
      if (shouldRestoreScrollPosition) {
        if (scrollerRef.current != null) {
          scrollerRef.current.scrollTo({ y: offsetY, x: 0, animated: false });
        }
      } else {
        scrollPositionByPath.set(window.location.pathname, 0);
      }
    }
  }, []);

  let onScroll = React.useCallback(e => {
    let offsetY = e.nativeEvent.contentOffset.y;
    scrollPositionByPath.set(window.location.pathname, offsetY);
  });

  return (
    <View ref={sizeRef} style={styles.root}>
      <ScrollView
        ref={scrollerRef}
        scrollEventThrottle={100}
        onScroll={onScroll}
        contentContainerStyle={styles.wrapper}
      >
        <View style={[layoutStyle, styles.header]}>{headerElement}</View>
        <View style={[layoutStyle, styles.children]}>{children}</View>
      </ScrollView>
      {footerElement}
    </View>
  );
};

export let PageFooter = ({ layoutStyle }: {| layoutStyle?: Object |}) => {
  let styles = UI.useStyles(theme => ({
    root: {
      alignItems: 'center',
      paddingVertical: 20,
      borderTopWidth: 1,
      borderTopColor: theme.dimmedColor,
    },
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    credit: {
      flexGrow: 1,
    },
    creditText: {
      color: theme.labelColor,
      fontSize: Style.fontSize.small,
      fontWeight: '600',
    },
    creditTextEm: {
      color: theme.labelColor,
      fontWeight: '900',
    },
  }));
  let themeConfig = Style.useThemeConfig();
  return (
    <View style={styles.root}>
      <View style={[styles.wrapper, layoutStyle]}>
        <View style={styles.credit}>
          <Text style={styles.creditText}>
            by <Text style={styles.creditTextEm}>ARROW</Text>RESEARCH
          </Text>
        </View>
        {themeConfig.lightTheme === themeConfig.darkTheme ? null : (
          <UI.ThemeSwitch />
        )}
      </View>
    </View>
  );
};

export let Title = () => {
  let theme = UI.useTheme();
  let styles = UI.useStyles(theme => {
    return {
      rootView: {
        alignItems: 'center',
      },
      textView: {
        flexDirection: 'row',
      },
    };
  });
  return (
    <>
      <View style={styles.rootView}>
        <Logo width={180} />
      </View>
    </>
  );
};

export let PageHeader = ({
  title,
  subtitle,
  showBackLink,
}: {|
  title?: string | string[],
  subtitle?: React.Node,
  showBackLink?: boolean,
|}) => {
  let styles = UI.useStyles(theme => ({
    root: {
      paddingTop: 50,
      paddingBottom: 50,
    },
    backLink: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      fontSize: Style.fontSize.small,
      fontWeight: '700',
      textDecorationLine: 'none',
    },
    titleRoot: {
      paddingTop: 50,
      paddingBottom: 10,
      flexDirection: 'row',
    },
    titleText: {
      color: theme.titleColor,
      fontSize: Style.fontSize.big2,
      fontWeight: '600',
    },
  }));
  let titleElement = null;
  if (title != null) {
    titleElement = <Text style={styles.titleText}>{title}</Text>;
  } else {
    titleElement = <Title />;
  }
  return (
    <View style={styles.root}>
      {showBackLink ? (
        <UI.Link href="/" style={styles.backLink}>
          <Icon.ArrowLeft size={16} /> BACK HOME
        </UI.Link>
      ) : null}
      <View style={styles.titleRoot}>{titleElement}</View>
      {subtitle}
    </View>
  );
};
