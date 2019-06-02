import {Post} from '../../Post';
export default Post;
export let title = "React Style"

Authoring [React][] components always was a joy as it gives you a codebase with
clear boundaries between concerns.

However React.js, like most other solutions, doesn’t help with styling
components. Should I write one big CSS file, or one separate file per component?
You are basically left on your own.

By leaving styling out of the equation, you are most likely to face one of the
following problems:

* I have to maintain styles separately from user interface definitions. React
  eliminated "templates" so why do we still write stylesheets?
* There are no variables, functions and other abstraction mechanisms available
  while writing styles.
* Everything ends up in a flat namespace which makes maintaining a nightmare.
* Cascading makes it hard to reason about styles and even a single little change
  can break seemingly unrelated things.
* There's always a separation between static and dynamic styles in an
  application.

Of course CSS preprocessors such as Sass or Less alleviate some of the
listed points but certainly not all.

We need a solution.

In this blog post I want to introduce [React Style][], a novel approach to
styling React components which, I think, comes close to addressing the listed
problems.

## Introducing React Style

The main idea of React Style is that styles are defined within the component
boundaries that React.js offers. This is similar to what we already do when
declaring inline styles for DOM components:

    <button style={{backgroundColor: 'white'}}>
      Hello
    </button>

In fact, this solution addresses all the problems we listed above. But at the
cost of a huge performance penalty.

Instead React Style makes it possible to extract parts of styles into CSS
classes while still allowing to use JavaScript to define style rules.

Example:

    var ToggeButton = React.createClass({

      normal: ReactStyle(function() {
        return {
          color: 'white',
          backgroundColor: 'black'
        }
      }),

      active: ReactStyle(function() {
        return {
          backgroundColor: this.props.activeColor
        }
      }),

      render() {
        var styles = this.state.active ? this.active() : this.normal()
        return (
          <button styles={styles}>
            Toggle
          </button>
        )
      },

      getInitialState() {
        return {active: false}
      }
    })

All styles are defined within methods decorated with `ReactStyle()` decorator.
The `styles` property is used to apply styles to DOM components.

Overall that's not much different than using the `style` prop to define styles
inline. But these small distinctions allow to extract some of the styles into
generated CSS classes.

The example above will result in the following stylesheet:

    .a {
      color: 'white';
      background-color: 'black';
    }

The JavaScript code itself is transformed into:

    var ToggeButton = React.createClass({

      normal: function() {
        return ' a'
      },

      active: ReactStyle(function() {
        return {backgroundColor: this.props.activeColor}
      }),

      getInitialState() {
        return {active: false}
      },

      render() {
        var styles = [this.normal(), this.state.active && this.active()]
        return (
          <button styles={styles}>
            Toggle
          </button>
        )
      }
    })

Note that the method `normal()` now returns corresponding CSS class name instead
of inline style declarations.

The other style, `active()` is left as-is, because it references dynamic value
`this.props.activeColor`.

That way React Style allows you to manage both static and dynamic styles in an
uniform way while still having performance benefits of CSS classes.

## How to write styles with JavaScript

At first, the idea to write styles in JavaScript can seem a little strange.

The first advantage we gain is that we use the same language and so the same
unified API to define static and dynamic styles.

The second advantage is that the full power of a programming language is at our
hands: we automatically gain variables, functions (which also can be used as
mixins), proper namespaces and full range of control flow constructs.

    var {darken} = require('./functions')
    var {colors} = require('./vars')
    var {buttonSmall} = require('./mixins')

    var Component = React.createClass({

      style: ReactStyle(function() {
        return Object.assign({}, buttonSmall, {
          backgroundColor: darken(colors.brand, 10)
        })
      }),

      ...

    })

## Programmatic usage

Programmatic usage is as simple as the following two lines of code:

    var transformString = require('react-style/lib/transformString')
    var {source, css} = transformString(source)

The `source` variable will contain transformed JavaScript code while `css` the
generated CSS code.

One could use this API to implement plugins for their favourite bundler,
Browserify or Require.js.

## Webpack integration

The recommended way to use React Style at the moment is to use it with
[Webpack][].

Webpack is a module bundler that is similar to [Browserify][], but is more powerful
and configurable. One of the advantages it has over Browserify is that it can
bundle stylesheets and static assets along with JavaScript code.

The example Webpack configuration with React Style looks like:

    var ExtractTextPlugin = require('extract-text-webpack-plugin')

    module.exports = {
      entry: './index.js',
      output: {
        filename: 'bundle.js',
        path: __dirname + '/assets',
        publicPath: 'assets/'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loaders: ['react-style/lib/webpack', 'jsx-loader']
          },
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin('styles.css')
      ]
    }

The generated CSS code will be automatically extracted and bundled into
`styles.css` while transformed JavaScript code will end up in `bundle.js`.

If we add [file-loader][] for `.png` and `.jpeg` files, for example, we will be
able to reference images with `require(..)` function. Same for fonts.

    function image(url) {
      return 'url(' + url + ')'
    }

    var Component = React.createClass({

      normal: ReactStyle(function() {
        return {
          background: image(require('./img/bg.png'))
        }
      }),

      ...

    })

The file at `./img/bg.png` will be moved by Webpack to the bundle output directory
and `require('./img/bg.png')` will resolve to the correct URL.


You can try the described setup of React Style and Webpack in the [example][]
directory in the repository:

    % npm install
    % webpack
    % open index.html

Note though, that at the moment, React Style Webpack loader depends on a fork of
`extract-text-webpack-plugin` (see `package.json` in the examples directory).

## Epilogue

React Style development takes place at [GitHub][React Style]. Have fun!

Don't forget to leave feedback or make pull request for missing functionality
and bug fixes.

Thanks to [@SanderSpies][] for React Style and for the feedback to this blog
post.

[@SanderSpies]: https://github.com/SanderSpies
[React Style]: https://github.com/SanderSpies/react-style
[Webpack]: https://webpack.github.io
[Browserify]: http://browserify.org
[file-loader]: https://github.com/webpack/file-loader
[React]: https://facebook.github.io/react
[example]: https://github.com/SanderSpies/react-style/tree/master/example
