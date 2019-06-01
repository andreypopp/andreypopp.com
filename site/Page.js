// @flow

import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import * as Icon from 'react-feather';
import * as UI from 'ui';

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
      alignItems: 'center',
      flexGrow: 1,
    },
    wrapper: {
      alignItems: 'flex-start',
      paddingBottom: 100,
    },
  }));

  let headerElement = React.useMemo(() => {
    return title != null ? (
      <PageHeader showBackLink={showBackLink}>{title}</PageHeader>
    ) : null;
  }, [showBackLink, title]);

  let footerElement = React.useMemo(() => {
    return (
      <View style={layoutStyle}>
        <PageFooter />
      </View>
    );
  }, [layoutStyle]);

  return (
    <ScrollView ref={sizeRef} contentContainerStyle={styles.root}>
      <View style={[styles.wrapper, layoutStyle]}>
        {headerElement}
        {children}
      </View>
      {footerElement}
    </ScrollView>
  );
};

export let PageFooter = ({ style }: { style?: Object }) => {
  let styles = UI.useStyles(theme => ({
    root: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 40,
    },
    credit: {
      flexGrow: 1,
    },
    creditText: {
      color: theme.dimmedColor,
      fontSize: '10pt',
      fontWeight: '700',
    },
  }));
  return (
    <View style={[styles.root, style]}>
      <View style={styles.credit}>
        <Text style={styles.creditText}>by ARROW</Text>
      </View>
      <UI.ThemeSwitch />
    </View>
  );
};

export let PageHeader = ({
  children,
  showBackLink,
}: {|
  children: string | string[],
  showBackLink?: boolean,
|}) => {
  let styles = UI.useStyles(theme => ({
    root: {
      paddingTop: 50,
      paddingBottom: 50,
    },
    text: {
      color: theme.textColor,
      fontSize: '30pt',
      fontWeight: '900',
    },
    backLink: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      fontSize: '12pt',
      fontWeight: '600',
      textDecorationLine: 'none',
    },
  }));
  return (
    <View style={styles.root}>
      {showBackLink ? (
        <UI.Link href="/" style={styles.backLink}>
          <Icon.ArrowLeft size={18} /> back home
        </UI.Link>
      ) : null}
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};
