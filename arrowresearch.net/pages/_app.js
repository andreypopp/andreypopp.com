// @flow

import AppBase from 'site/App';
import * as Style from 'ui/Style';
import { Logo } from '../Logo';

export default class App extends AppBase {
  Logo = Logo;
  themeConfig = {
    lightTheme: Style.darkTheme,
    darkTheme: Style.darkTheme,
  };
}
