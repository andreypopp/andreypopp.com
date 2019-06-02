// @flow

import * as React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import * as UI from 'ui';
import * as Style from 'ui/Style';
import { Content, Link } from 'ui/Content';
import { Page } from '../Page';
import { Section } from '../Section';
import { handlePress } from 'ui/Link';

let writingsIndex = require('../writings-index.compute');

let geoloc = (
  <Link href="https://en.wikipedia.org/wiki/Saint_Petersburg">
    St.Petersburg, Russia
  </Link>
);

let twitter = (
  <Link href="https://twitter.com/andreypopp">twitter.com/andreypopp</Link>
);

let github = (
  <Link href="https://github.com/andreypopp">github.com/andreypopp</Link>
);

let email = <Link href="mailto:8mayday@gmail.com">8mayday@gmail.com</Link>;

let WritingLink = ({ writing }) => {
  let _handlePress = (e: UIEvent) => handlePress(e, writing.href);
  let styles = Style.useStyles(theme => ({
    root: {
      paddingVertical: 8,
    },
    date: {
      color: theme.dimmedColor,
      fontSize: '8pt',
      fontWeight: '800',
    },
    title: {
      textTransform: 'uppercase',
      color: theme.linkColor,
      fontWeight: '800',
    },
  }));
  return (
    <TouchableOpacity style={styles.root}>
      <Text
        accessibilityRole="link"
        style={styles.title}
        href={writing.href}
        onPress={_handlePress}
      >
        {writing.title}
      </Text>
      <Text style={styles.date}>
        {writing.date.year}/{writing.date.month}/{writing.date.day}
      </Text>
    </TouchableOpacity>
  );
};

let WritingsArchive = ({ writings }) => {
  let children = [];
  let lastYear = null;
  let styles = Style.useStyles(theme => ({
    root: {
      width: '100%',
    },
    year: {
      paddingTop: 30,
      paddingBottom: 5,
      borderBottomWidth: 2,
      borderBottomColor: theme.dimmedColor,
    },
    yearText: {
      color: theme.dimmedColor,
      fontWeight: '900',
      fontSize: '8pt',
    },
  }));

  for (let item of writings) {
    if (item.date.year !== lastYear) {
      lastYear = item.date.year;
      children.push(
        <View style={styles.year} key={`year-${lastYear}`}>
          <Text style={styles.yearText}>{lastYear}</Text>
        </View>,
      );
    }

    children.push(
      <View key={item.href}>
        <WritingLink writing={item} />
      </View>,
    );
  }
  return <View style={styles.root}>{children}</View>;
};

export default (props: {| shouldRestoreScrollPosition?: boolean |}) => {
  let styles = Style.useStyles(theme => ({
    me: {
      paddingVertical: 50,
    },
  }));
  let recently = writingsIndex
    .filter(item => item.date.year >= 2019)
    .slice(0, 3)
    .map(item => (
      <View key={item.href}>
        <WritingLink writing={item} />
      </View>
    ));
  return (
    <Page shouldRestoreScrollPosition={props.shouldRestoreScrollPosition}>
      {recently.lentgh > 0 ? (
        <Section title="Recently">
          <View>{recently}</View>
        </Section>
      ) : null}
      <View style={styles.me}>
        <Content>
          <p>I'm Andrey Popp, software engineer based in {geoloc}.</p>
          <p>
            You can follow me on {twitter} which is mostly about tech. If you
            have something to say to me directly you can reach me via {email}.
          </p>
        </Content>
      </View>
      <WritingsArchive writings={writingsIndex} />
    </Page>
  );
};
