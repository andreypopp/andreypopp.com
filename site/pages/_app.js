// @flow

import * as React from 'react';
import { View, Text } from 'react-native';
import App, { Container } from 'next/app';
import * as UI from 'ui';
import * as Style from 'ui/Style';
import { Logo } from '../Page';

function Preloader() {
  let styles = UI.useStyles(theme => ({
    root: {
      backgroundColor: theme.backgroundColor,
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    text: {
      color: theme.textColor,
      fontSize: '18pt',
      fontWeight: '900',
    },
  }));
  return (
    <View style={styles.root}>
      <Logo />
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
        <UI.WithTheme defaultTheme={UI.darkTheme}>
          <Container>
            <Preloader />
          </Container>
        </UI.WithTheme>
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
    document.title = '@andreypopp';
    this.setState({ loaded: true });
  }
}

export default MyApp;
