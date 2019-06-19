// @flow

import * as React from 'react';
import { Text, ScrollView, View, TouchableOpacity } from 'react-native-web';
import { Content, useStyles } from 'ui';
import { handlePress } from 'ui/Link';
import { Page } from './Page';
import { Section } from './Section';

let index = require('./writings-index.compute');

type P = {
  children: React.Node,
  title?: string | string[],
  shouldRestoreScrollPosition?: boolean,
};

export let Post = (props: P) => {
  let { children, title, shouldRestoreScrollPosition } = props;
  let curr = null;
  let next = null;
  for (let item of index) {
    if (item.title === title) {
      curr = item;
      continue;
    }
    if (curr != null) {
      next = item;
      break;
    }
  }
  let styles = useStyles(theme => ({
    subtitle: {
      color: theme.labelColor,
      fontWeight: '600',
    },
  }));
  let subtitle =
    curr != null ? (
      <Text style={styles.subtitle}>
        published on {curr.date.year}/{curr.date.month}/{curr.date.day}
      </Text>
    ) : null;
  return (
    <Page
      showBackLink
      title={title}
      subtitle={subtitle}
      shouldRestoreScrollPosition={shouldRestoreScrollPosition}
    >
      <Content>{children}</Content>
      {next && <NextWriting writing={next} />}
    </Page>
  );
};

let NextWriting = ({ writing }) => {
  let styles = useStyles(theme => ({
    root: {
      width: '100%',
      paddingTop: 50,
    },
    titleText: {
      fontSize: '10pt',
      fontWeight: '900',
      textTransform: 'uppercase',
      color: theme.linkColor,
    },
  }));
  let onPress = (e: UIEvent) => handlePress(e, writing.href);
  return (
    <View style={styles.root}>
      <Section title="Next">
        <TouchableOpacity onPress={onPress}>
          <Text accessibilityRole="link" style={styles.titleText}>
            {writing.title}
          </Text>
        </TouchableOpacity>
      </Section>
    </View>
  );
};
