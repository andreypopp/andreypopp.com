// @flow

import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native-web';
import Router from 'next/router';
import * as Style from './Style';
import * as Lang from './Lang';
import { Button } from './Button';

type LinkProps = {|
  href: string,
  children: React.Node,
  onPress?: UIEvent => boolean,
  style?: Style.TextStyle,
|};

export let Link = ({
  href,
  children,
  onPress = Lang.emptyFunctionThatReturns(false),
  style: extraStyle,
}: LinkProps) => {
  let _handlePress = React.useCallback(
    (e: UIEvent) => handlePress(e, href, onPress),
    [href, onPress],
  );
  let style = Style.useStyle(theme => ({
    color: theme.linkColor,
    fontWeight: '600',
    textDecorationLine: 'underline',
  }));
  return (
    <Text
      accessibilityRole="link"
      style={[style, extraStyle]}
      href={href}
      onPress={_handlePress}
    >
      {children}
    </Text>
  );
};

type IconProps = { size: number | string, style: Object };

type LinkButtonProps = {|
  href: string,
  label: string,
  onPress?: UIEvent => void,
  renderIcon?: IconProps => React.Node,
  backgroundColor?: Style.color,
  labelColor?: Style.color,
|};

export let LinkButton = ({ href, ...props }: LinkButtonProps) => {
  let onPress = React.useCallback(
    (e: UIEvent) => handlePress(e, href, Lang.emptyFunctionThatReturns(false)),
    [href],
  );
  return <Button {...props} onPress={onPress} />;
};

export let handlePress = (
  e: UIEvent,
  href: string,
  onPress: ?(UIEvent) => boolean,
) => {
  if (isExternalHref(href)) {
    return;
  }
  e.preventDefault();
  if (onPress != null && onPress(e)) {
    return;
  }
  Router.push(href);
};

let isExternalHref = href => {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:')
  );
};
