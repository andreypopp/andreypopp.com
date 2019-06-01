// @flow

import * as React from 'react';
import { Text, View, ScrollView, Switch } from 'react-native';
import * as UI from 'ui';
import * as Style from 'ui/Style';
import { Page } from '../Page';

let Header = ({ children }) => {
  let styles = UI.useStyles(theme => ({
    root: {
      paddingTop: 70,
      paddingBottom: 10,
    },
    text: {
      color: theme.textColor,
      fontSize: '16pt',
      fontWeight: '900',
    },
  }));
  return (
    <View style={styles.root}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

let Section = ({ children }) => {
  let styles = UI.useStyles(theme => ({
    root: {
      paddingVertical: 10,
      maxWidth: 350,
    },
    text: {
      color: theme.textColor,
      fontSize: '14pt',
      fontWeight: '400',
    },
  }));
  return (
    <View style={styles.root}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

let Logo = ({ children, tagline }) => {
  let styles = UI.useStyles(theme => ({
    root: {
      paddingTop: 50,
      paddingBottom: 10,
    },
    text: {
      color: theme.textColor,
      fontSize: '48pt',
      fontWeight: '900',
    },
    tagline: {
      padding: 5,
      borderRadius: 2,
      backgroundColor: Style.iOSPalette.tint.orange,
    },
    taglineText: {
      color: theme.backgroundColor,
      fontWeight: '900',
      textAlign: 'center',
    },
  }));
  return (
    <View style={styles.root}>
      <Text style={styles.text}>{children}</Text>
      <View style={styles.tagline}>
        <Text style={styles.taglineText}>{tagline.toUpperCase()}</Text>
      </View>
    </View>
  );
};

export default (props: {}) => {
  let name = 'action*';
  return (
    <Page>
      <Logo tagline="Technology demo Q1 2019">{name}</Logo>
      <Section>
        <b>{name}</b> is an <b>interactive computation environment</b>.
      </Section>
      <Section>
        It is a tool for <b>end-users</b> to build <b>apps</b> which help manage
        their <b>data</b> and implement <b>interactive workflows</b> over it.
      </Section>

      <Header>WHY</Header>
      <Section>
        <b>{name}</b> can be used as a <b>database</b>, <b>knowledge base</b> or
        just a <b>wiki</b>. You decide what you build with it.
      </Section>
      <Section>
        <b>Researchers</b> can use <b>{name}</b> to manage their experiments:
        record <b>data</b> and then produce <b>reports</b> and compute{' '}
        <b>statistics</b>.
      </Section>
      <Section>
        <b>Programmers</b> can extend <b>{name}</b> by using its JavaScript API.
      </Section>

      <Header>HOW</Header>
      <Section>
        The main <b>API</b> is the language called (amusingly) <b>{name}</b>. A
        single language to <b>query</b> data and define rich{' '}
        <b>user interfaces</b> & <b>workflows</b>.
      </Section>
      <Section>
        The <b>accessible programming environment</b> is provided. It assists
        you with autocompletion, diagnostics and helps <b>observing</b> your
        workflows running <b>live</b>.
      </Section>
      <Section>
        You start a new app with <b>{name}</b> by making queries to{' '}
        <b>explore data</b>. Then the next step is to define{' '}
        <b>user interfaces</b> for the data you want to work with. Finally you{' '}
        <b>compose workflows</b> out of them.
      </Section>

      <Header>TRY</Header>
      <Section>
        <b>{name}</b> is in progress yet but you can try the following demos.
      </Section>
      <Section>
        Check the{' '}
        <UI.Link href="/demo/issue-tracker">interactive tutorial</UI.Link> which
        implements a simple issue tracker with <b>{name}</b>.
      </Section>
      <Section>
        Play with TPCH dataset in{' '}
        <UI.Link href="/try">Read-Eval-Print-Loop</UI.Link> (REPL).
      </Section>
    </Page>
  );
};
