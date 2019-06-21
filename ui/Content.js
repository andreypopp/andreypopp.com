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
    color: theme.linkColor,
    backgroundColor: theme.backgroundHighlightedColor,
    paddingHorizontal: 2,
    fontWeight: '600',
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

  let styles = React.useMemo(
    () => (
      <style global jsx>{`
        .content {
          width: 100%;
        }
        .content * {
          font-size: ${fontSize};
          line-height: 1.4em;
        }
        .content p,
        .content h1,
        .content h2,
        .content h3,
        .content h4,
        .content h5,
        .content h6,
        .content ul,
        .content ol,
        .content li {
          color: ${theme.textColor};
          font-size: ${fontSize};
          font-weight: 500;
          line-height: 1.4em;
        }

        .content h1 {
          color: ${theme.labelColor};
          font-size: 20pt;
        }
        .content h2 {
          color: ${theme.labelColor};
          font-size: 18pt;
        }
        .content h3 {
          color: ${theme.labelColor};
          font-size: 18pt;
        }
        .content h4 {
          color: ${theme.labelColor};
          font-size: 16pt;
        }
        .content h5 {
          color: ${theme.labelColor};
          font-size: 14pt;
        }
        .content h6 {
          color: ${theme.labelColor};
          font-size: 12pt;
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
          line-height: 1.1em;
          margin-top: 1em;
          margin-bottom: 1em;
          background-color: ${theme.backgroundSecondaryColor};
          color: ${theme.textColor};
          border-left: 3px solid ${theme.dimmedColor};
          padding-top: 15px;
          padding-bottom: 15px;
          padding-left: 15px;
        }
        .content code {
          font-size: 10pt;
          font-weight: 700;
          font-family: Menlo, Monaco, monospace;
          padding: 2px;
          background-color: ${theme.backgroundSecondaryColor};
        }
        .content pre > code {
          font-size: 10pt;
          font-weight: 700;
          font-family: Menlo, Monaco, monospace;
          padding: 0;
          background-color: transparent;
        }
        .content em {
          font-weight: 900;
          font-style: normal;
        }
      `}</style>
    ),
    [theme],
  );
  return (
    <MDXProvider components={contentComponents}>
      <div className="content">{children}</div>
      {styles}
    </MDXProvider>
  );
};
