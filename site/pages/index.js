// @flow

import * as React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import * as UI from 'ui';
import * as Style from 'ui/Style';
import { Content, Link } from 'ui/Content';
import { Page } from '../Page';
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
  let style = Style.useStyle(theme => ({
    textTransform: 'uppercase',
    color: theme.linkColor,
    fontWeight: '800',
  }));
  return (
    <TouchableOpacity>
      <Text
        accessibilityRole="link"
        style={[style]}
        href={writing.href}
        onPress={_handlePress}
      >
        {writing.title}
      </Text>
    </TouchableOpacity>
  );
};

let WritingsIndex = ({ writings }) => {
  let styles = Style.useStyle(theme => ({
    list: {
      textTransform: 'uppercase',
      color: theme.linkColor,
      fontWeight: '800',
    },
  }));
  return (
    <View style={styles.list}>
      {writings.map(item => (
        <View style={styles.item} key={item.href}>
          <WritingLink writing={item} />
        </View>
      ))}
    </View>
  );
};

export default (props: {}) => {
  return (
    <Page>
      <Content>
        <p>Recently:</p>
      </Content>
      <WritingsIndex writings={writingsIndex.slice(0, 3)} />
      <Content>
        <p>I'm Andrey Popp, software engineer based in {geoloc}.</p>
        <p>
          You can follow me on {twitter} which is mostly about tech. If you have
          something to say to me directly you can reach me via {email}.
        </p>
        <p>
          The list of my current interests include: Reason/OCaml, query
          languages, end-user programming, development tooling, programming
          language theory, vim/neovim, ...
        </p>
        <p>More:</p>
      </Content>
      <WritingsIndex writings={writingsIndex} />
    </Page>
  );
};
