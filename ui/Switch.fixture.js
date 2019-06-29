// @flow

import * as React from 'react';
import * as Icon from 'react-feather';
import { Show as Demo } from './Fixture';
import * as Lang from './Lang';
import * as Style from './Style';
import { View, Text } from 'react-native';
import { Switch, type P } from './Switch';

let SwitchDemo = ({
  label,
  render,
  desc,
}: {|
  label: string,
  desc?: string,
  render: P => React.Node,
|}) => {
  let styles = Style.useStyles(theme => ({
    root: {
      padding: 10,
    },
    demos: {
      flexDirection: 'row',
    },
    label: {
      paddingBottom: 10,
    },
    labelText: {
      fontSize: '12pt',
      fontWeight: '600',
      color: theme.dimmedColor,
    },
    desc: {
      paddingBottom: 10,
    },
    descText: {
      fontSize: '9pt',
      fontWeight: '400',
      color: theme.dimmedColor,
    },
  }));
  return (
    <View style={styles.root}>
      <View style={styles.label}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      {desc != null ? (
        <View style={styles.desc}>
          <Text style={styles.descText}>{desc}</Text>
        </View>
      ) : null}
      <View style={styles.demos}>
        <Demo label="false">
          {render({
            disabled: false,
            value: false,
            onValueChange: Lang.emptyFunction,
          })}
        </Demo>
        <Demo label="true">
          {render({
            disabled: false,
            value: true,
            onValueChange: Lang.emptyFunction,
          })}
        </Demo>
        <Demo label="false, disabled">
          {render({
            disabled: true,
            value: false,
            onValueChange: Lang.emptyFunction,
          })}
        </Demo>
        <Demo label="true, disabled">
          {render({
            disabled: true,
            value: true,
            onValueChange: Lang.emptyFunction,
          })}
        </Demo>
      </View>
    </View>
  );
};

let Render = (props: {||}) => {
  return (
    <View>
      <SwitchDemo
        label="Simple"
        desc="This showcases switch in multiple states"
        render={props => <Switch {...props} />}
      />
      <SwitchDemo
        label="Custom size set"
        desc="Same as regular switch but of a bigger size"
        render={props => <Switch {...props} size={24} />}
      />
      <SwitchDemo
        label="With ThumbIconOn"
        desc="This has an icon which is shown if switch is in On state"
        render={props => <Switch {...props} ThumbIconOn={Icon.Wifi} />}
      />
      <SwitchDemo
        label="With ThumbIconOff"
        desc="This has an icon which is shown if switch is in Off state"
        render={props => <Switch {...props} ThumbIconOff={Icon.WifiOff} />}
      />
      <SwitchDemo
        label="With TrackIconOn"
        desc="This has an icon on track which is shown if switch is in On state"
        render={props => <Switch {...props} TrackIconOn={Icon.Wifi} />}
      />
      <SwitchDemo
        label="With TrackIconOff"
        desc="This has an icon on track which is shown if switch is in Off state"
        render={props => <Switch {...props} TrackIconOff={Icon.WifiOff} />}
      />
    </View>
  );
};

export default {
  Basic: <Render />,
};
