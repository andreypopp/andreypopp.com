// @flow

import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import * as Icon from 'react-feather';
import * as UI from 'ui';
import * as Style from 'ui/Style';

let useLayoutStyle = () => {};

export let Page = ({
  children,
  title,
  showBackLink,
}: {|
  children: React.Node,
  title?: string | string[],
  showBackLink?: boolean,
|}) => {
  let [size, sizeRef] = UI.useDOMSize();
  let isWideScreen = size != null && size.width > 700;

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
    },
    wrapper: {
      alignItems: 'center',
      flexBasis: 0,
    },
  }));

  let headerElement = React.useMemo(() => {
    return <PageHeader showBackLink={showBackLink} title={title} />;
  }, [showBackLink, title]);

  let footerElement = React.useMemo(() => {
    return <PageFooter layoutStyle={layoutStyle} />;
  }, [layoutStyle]);

  return (
    <View ref={sizeRef} style={styles.root}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={[layoutStyle, styles.children]}>{headerElement}</View>
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
      color: theme.dimmedColor,
      fontSize: '10pt',
      fontWeight: '600',
    },
    creditTextEm: {
      color: theme.dimmedColor,
      fontWeight: '900',
    },
  }));
  return (
    <View style={styles.root}>
      <View style={[styles.wrapper, layoutStyle]}>
        <View style={styles.credit}>
          <Text style={styles.creditText}>
            by ANDREY<Text style={styles.creditTextEm}>POPP</Text>
          </Text>
        </View>
        <UI.ThemeSwitch />
      </View>
    </View>
  );
};

export let Logo = () => {
  let styles = UI.useStyles(theme => ({
    titleText: {
      color: theme.titleColor,
      fontSize: '22pt',
      fontWeight: '600',
    },
    titleTextBold: {
      color: theme.titleColor,
      fontSize: '22pt',
      fontWeight: '900',
    },
  }));
  return (
    <>
      <Text style={styles.titleText}>ANDREY</Text>
      <Text style={styles.titleTextBold}>POPP</Text>
    </>
  );
};

export let PageHeader = ({
  title,
  showBackLink,
}: {|
  title?: string | string[],
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
      fontSize: '12pt',
      fontWeight: '600',
      textDecorationLine: 'none',
    },
    titleRoot: {
      paddingTop: 50,
      paddingBottom: 10,
      flexDirection: 'row',
    },
    titleText: {
      color: theme.titleColor,
      fontSize: '22pt',
      fontWeight: '600',
    },
    titleTextBold: {
      color: theme.titleColor,
      fontSize: '22pt',
      fontWeight: '900',
    },
  }));
  let titleElement = null;
  if (title != null) {
    titleElement = <Text style={styles.titleText}>{title}</Text>;
  } else {
    titleElement = <Logo />;
  }
  return (
    <View style={styles.root}>
      {showBackLink ? (
        <UI.Link href="/" style={styles.backLink}>
          <Icon.ArrowLeft size={18} /> back home
        </UI.Link>
      ) : null}
      <View style={styles.titleRoot}>{titleElement}</View>
    </View>
  );
};
