// @flow

import * as React from 'react';
import { Text } from 'react-native-web';
import { MDXProvider } from '@mdx-js/react';
import * as Style from './Style';
import { handlePress } from './Link';

export let Link = ({
  href,
  children,
}: {|
  href: string,
  children: React.Node,
|}) => {
  let _handlePress = (e: UIEvent) => handlePress(e, href);
  let style = Style.useStyle(theme => ({
    // TODO: move to theme
    backgroundColor: theme.themeName === 'light' ? '#ffd12f' : '#075e7d',
    paddingHorizontal: 2,
    color: theme.linkColor,
    fontWeight: '400',
  }));
  return (
    <Text
      accessibilityRole="link"
      style={[style]}
      href={href}
      onPress={_handlePress}
    >
      {children}
    </Text>
  );
};

let contentComponents = {
  a: Link,
};

export let Content = (props: {|
  children: React.Node,
  fontSize?: number | string,
|}) => {
  let { children, fontSize = '12pt' } = props;
  let theme = Style.useTheme();
  return (
    <MDXProvider components={contentComponents}>
      <div className="content">{children}</div>
      <style global jsx>{`
        .content * {
          color: ${theme.textColor};
          font-size: ${fontSize};
          font-weight: 500;
          line-height: 1.4em;
        }
        .content ul,
        .content ol {
          padding: 0;
          padding-left: 18px;
        }
        .content ul li {
          list-style-type: square;
        }
        .content li {
          padding: 0;
          list-style-position: outside;
        }
        .content pre {
          margin-top: 1em;
          margin-bottom: 1em;
          color: ${theme.textColor};
          border-left: 3px solid ${theme.dimmedColor};
          padding-top: 15px;
          padding-bottom: 15px;
          padding-left: 15px;
        }
        .content pre > code {
          font-size: 11pt;
          font-family: Menlo, Monaco, monospace;
        }
      `}</style>
    </MDXProvider>
  );
};
