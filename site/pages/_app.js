// @flow

import * as React from 'react';
import { View, Text } from 'react-native';
import App, { Container } from 'next/app';
import * as UI from 'ui';

function Preloader() {
  let styles = UI.useStyles(_theme => ({
    root: {
      backgroundColor: UI.darkTheme.backgroundColor,
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: UI.darkTheme.textColor,
      fontSize: '18pt',
      fontWeight: '900',
    },
  }));
  return (
    <View style={styles.root}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

class MyApp extends App {
  static async getInitialProps({ Component, ctx }: Object) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  state: { loaded: boolean } = { loaded: false };

  render() {
    const { Component, pageProps } = this.props;

    if (!this.state.loaded) {
      return (
        <Container>
          <Preloader />
        </Container>
      );
    }

    return (
      <UI.WithTheme>
        <Container>
          <Component {...pageProps} />
        </Container>
      </UI.WithTheme>
    );
  }

  componentDidMount() {
    document.title = 'action*';
    this.setState({ loaded: true });
  }
}

export default MyApp;
