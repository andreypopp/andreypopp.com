// @flow

import * as React from 'react';
import { View, Text } from 'react-native';
import Router from 'next/router';
import AppBase, { Container } from 'next/app';
import * as UI from 'ui';
import * as Style from 'ui/Style';

function Preloader({ Logo }: {| Logo: React.AbstractComponent<{||}> |}) {
  let styles = UI.useStyles(theme => ({
    root: {
      backgroundColor: theme.backgroundColor,
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
  }));
  return (
    <View style={styles.root}>
      <Logo />
    </View>
  );
}

export default class App extends AppBase {
  static async getInitialProps({ Component, ctx }: Object) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  shouldRestoreScrollPosition: boolean = false;
  state: {| loaded: boolean |} = { loaded: false };

  render() {
    const { Component, pageProps } = this.props;
    if (!this.state.loaded) {
      return (
        <UI.WithTheme themeConfig={{ lightTheme: Style.darkTheme }}>
          <Container>
            <Preloader Logo={this.Logo} />
          </Container>
        </UI.WithTheme>
      );
    }

    return (
      <UI.WithTheme themeConfig={this.themeConfig}>
        <Container>
          <Component
            {...pageProps}
            shouldRestoreScrollPosition={this.shouldRestoreScrollPosition}
          />
        </Container>
      </UI.WithTheme>
    );
  }

  componentDidUpdate() {
    if (this.shouldRestoreScrollPosition) {
      this.shouldRestoreScrollPosition = false;
    }
  }

  componentDidMount() {
    this.setState({ loaded: true });
    Router.beforePopState(({ url, as, options }) => {
      this.shouldRestoreScrollPosition = true;
      return true;
    });
  }
}
