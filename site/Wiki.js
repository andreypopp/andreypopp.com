// @flow

import * as React from 'react';
import { Text, ScrollView, View, TouchableOpacity } from 'react-native-web';
import { Content, useStyles } from 'ui';
import { handlePress } from 'ui/Link';
import { Page } from './Page';
import { Section } from './Section';

let index = require('./wiki-index.compute');

type P = {
  children: React.Node,
  title?: string | string[],
  shouldRestoreScrollPosition?: boolean,
};

export let Wiki = (props: P) => {
  let { children, title, shouldRestoreScrollPosition } = props;
  let curr = null;
  for (let name of index.pages) {
    let item = index.pagesByName[name];
    if (item.title === title) {
      curr = item;
      break;
    }
  }
  let styles = useStyles(theme => ({
    index: {
      width: '100%',
      paddingTop: 50,
    },
  }));
  return (
    <Page
      showBackLink
      title={title}
      shouldRestoreScrollPosition={shouldRestoreScrollPosition}
    >
      <Content>{children}</Content>
      <View style={styles.index}>
        <Section title="pages">
          <WikiPages index={index} />
        </Section>
      </View>
    </Page>
  );
};

let WikiPages = ({ index }) => {
  let pages = [];
  for (let name of index.pages) {
    let item = index.pagesByName[name];
    pages.push(<PageLink page={item} key={item.name} />);
  }
  return pages;
};

let PageLink = ({ page }) => {
  let styles = useStyles(theme => ({
    root: {
      width: '100%',
      paddingVertical: 5,
    },
    titleText: {
      fontSize: '10pt',
      fontWeight: '900',
      textTransform: 'uppercase',
      color: theme.linkColor,
    },
  }));
  let onPress = (e: UIEvent) => handlePress(e, page.href);
  return (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      <Text accessibilityRole="link" style={styles.titleText}>
        {page.title}
      </Text>
    </TouchableOpacity>
  );
};
