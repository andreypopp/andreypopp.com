import {Post} from '../../Post';
export default Post;
export let title = "xcss: bundler for modular CSS components"

I like how [browserify][1] works on pair with [npm][2] — this is what I call
"out-of-the-box" experience. The only issue I have with these tools is they
don't care about my CSS. Of course they shouldn't, because every tool has to do
just one thing and do it well, that's the [Unix philosophy][3] which is followed
by browserify and npm design decisions.

Now I want to introduce you [xcss][4] — bundler for writing modular CSS
components in the spirit of browserify. Install it via npm:

    % npm install -g xcss

And see how to use it:

    % xcss --help
    Usage: xcss [options] entry

    Options:
      -h, --help       Show this message and exit
      -v, --version    Print xcss version and exit
      -d, --debug      Emit source maps
      -c, --compress   Compress output
      --class-map      Use class map to remove unused stylesheet rules
      -t, --transform  Apply transform

It features:

  * support for running rework transforms
  * fine-grained source maps generation
  * elimination of unused class rules
  * class name compression

But let's talk about all of these later and speak instead about xcss's main
selling point which is using [Node module resolution algorithm][5] to resolve
dependencies between CSS files. In other words it supports importing
CSS code from packages installed via npm.

For example if you need `normalize.css` you just do:

    % npm install normalize-css

    % cat ./styles.css
    @import "normalize-css/normalize.css";

    body {
      background: white;
    }

    % xcss ./styles.css > ./bundle.css

and have `normalize.css` bundled in resulted `bundle.css`.

But easy to install and use `normalize.css` isn't the only reason loading from
npm packages is so awesome — npm ecosystem is huge and thanks to browserify
there are a lot of packages which work in browser.

Now with xcss you can distribute via npm not only javascript code but also CSS.
Imagine reusable UI widgets which are just a single *"npm install"* step away
from you to use.

Of course there needs to be some conventions to appear like prefixing all class
names with a package name prefix when writing components which will be
released to public.

## Source maps generation

Another useful feature is source maps generation. To generate bundle with source
maps you can use `--debug` command line option:

    % xcss --debug ./styles.css > bundle.css

That way source maps and file sources are inlined into resulted bundle as a chunk of
base64 encoded data. That way you don't bother serving them to a browser
separately.

The feature is implemented through my fork of [visionmedia/css-stringify][9]
which adds source map generation with "declaration-level" precision.

That means that apart from showing correct filenames and line numbers for CSS in
DOM inspector in Chrome Dev Tools, you can `⌘ + click` on a CSS declaration and
it will show you right the place where it is defined in the original source file
not in the bundle.

Unfortunately I still didn't get my [pull request][8] to css-stringify merged
upstream. If you feel this feature is important please comment and vote on the
issue.

## CSS transforms

Writing plain CSS has never been a pleasure. Fortunately there's [rework][10]
library which provides transforms over CSS which implement various
features found in full-fledged preprocessors like LESS or SASS and even more.

This includes [variable support][18] which polyfills upcoming [CSS variables
specification][21], [rule extensions][19], [mixins][20], functions and
[many][14] [others][15].

While most of rework transforms require some sort of configuration I provide a
thin wrappers on top of most used ones which configure them with sane default
options. This allows using them from a command line:

    % xcss \
      --transform xcss/transforms/vars \
      --transform xcss/transforms/extend \
      ./styles.css > bundle.css

When using xcss via Node API you can pass rework transforms directly, no
wrappers are required.

## "Dead classes" elimination

There's an advanced feature which is enabled by `--class-map` command line
option which allows you to pass an information to xcss on which class names are
in use.

This information can be used by xcss to eliminate unused CSS rules and so reduce
the size of CSS bundle and the time needed to parse and apply CSS declarations
in a browser at runtime.

So what's the format of a class map? It's just a JSON object which have class
names as keys and values set to `true`:

    {
      ".some-class": true,
      ".another-class": true
    }

That's all you need to left only class rules for `.some-class` and
`.another-class` in a bundle. Others will be stripped out.

Of course you don't have to maintain such class maps manually — that would be
crazy. Instead there's a `xcss-classmap` command line utility which extracts
class map from your javascript application if you use some predefined convention
for marking up CSS class names in your code.

The convention is borrowed from [React][11] UI library which has a little
function called `cx()`. There are two ways to use this function. You can call it
with a variable number of string literals and it will join them with a space:

    var cx = require('xcss/cx');

    cx('.some-class', '.another-class'); // '.some-class .another-class'

Or for conditional class name inclusion, you can call it with an object literal
with class names as keys and boolean expressions as values. Value of boolean
expression evaluated at runtime will indicate if corresponding class should be
present in a returned class string or not:

    cx({
      '.some-class': truthy(),
      '.another-class: false
    }); // '.some-class' if truthy() returns "truthy" value

Remember that in both cases arguments must be literal values so `xcss-classmap`
utility can statically analyze `cx()` calls and return names of classes in a
resulted class map.

The basic workflow with `xcss-classmap` would look like this:

    % xcss-classmap ./app.js > app.classmap.json
    % xcss --class-map ./app.classmap.json ./styles.css > bundle.css

That way you get all unused class rules stripped out from `bundle.css`.

Of course if you use some sort of templating where you define you CSS class
names or you write them directly in HTML, you would need to write your own
version of `xcss-classmap` specifically for it.

Fortunately, it's quite easy, [my implementation][12] for extracting `cx()`
calls from JavaScript source is just 67 lines of code.

## Class name compression

Another experimental feature is class name compression. It is also implemented
through the `--class-map` option. But the format of class map is a little
different than in the previous case.

Instead of containing `true` values class map should be a mapping from class
names to compressed class names:

    {
      ".some-class": ".A",
      ".another-class": ".B"
    }

Unfortunately this introduces a little more complexity into the build process
because now you need not only to extact class names from your app sources but
also to transform it so it will match the compressed class names in the bundled
CSS.

Facebook is using this technique and it's quite effective because class names
are unique and are mostly not affected by gzip compression.

There's no transform in the open source yet, but I'll deliver it shortly,
[follow me][13] on GitHub to know when it happens.

## API usage

So far I only gave examples of using xcss through command-line utility. But
that's not the only way to use it. If someone wants to implement a Grunt plugin
or integrate xcss with some other build systems — there's Node.js API for that
which consists of an only function `xcss`:

    var xcss = require('xcss');

    xcss('./styles.css', {debug: true}).pipe(process.stdout);

the function takes an entry point as its first argument and options (`debug`,
`compress`, `transform` and `classMap` are possible keys) as its second
argument.

It returns a Node stream which you can pipe to process's stdout or into stream
created by `fs.createWriteStream` or even over an internet directly to a user's
browser.

For example, the simplest connect/express middleware would look like this:

    function xcssMiddleware(entry, options) {
      return function(req, res, next) {
        xcss(entry, options).on('error', next).pipe(res);
      }
    }

And that's it.

## Why not SASS/LESS/Stylus?

The usual response to that is that using plain CSS doesn't require you to learn
new syntax and abstractions.

Let's be fair instead and say that using plain CSS is painful and after you
plugged a bunch of transforms in your xcss/rework workflow you are already far
ahead of what people call "plain CSS".

So the real reasons for me are:

  * performance
  * extensibility
  * better tooling

### Performance

All features in xcss except for dependency resolution are optional so you don't
pay for what you don't use.

In addition to that, css-parse and css-stringify libraries which underlies xcss
are designed to be fast.

These all make developer experience quite efficient especially in comparison to
SASS which is slow as hell.

### Extensibility

xcss can be extended with arbitrary source transformations. Apart from those
already in the wild you can write your own for your own exotic needs.

That has downsides as well because SASS/LESS/Stylus have well defined syntax and
you know the exact semantics of each construct. Fortunately most rework
transforms are designed in a way which preserves CSS semantics so if you don't
abuse them everything will be fine.

### Better tooling

Using plain CSS and overall simplicity and modular architecture built on top of
css-parse and css-stringify enables better tooling. That allows such wonderful
utilities like [autoprefixer][16] to appear (by the way you can use it with xcss
easily).

Another feature enabled by this approach is a [build tool][17] which can handle
interleaved JS and CSS dependency graphs. That would allow you to write
JavaScript code which can call `require('./button.css')` and have `./button.css`
inserted in a resulted bundle.

Full-fledged preprocessors like SASS/LESS/Stylus are monolithic and don't allow
you to implement such tools without a major effort.

[1]: http://browserify.org
[2]: http://npmjs.org
[3]: http://en.wikipedia.org/wiki/Unix_philosophy
[4]: https://github.com/andreypopp/xcss
[5]: http://nodejs.org/api/modules.html#modules_all_together
[6]: http://nodejs.org/api/modules.html#modules_folders_as_modules
[7]: http://topcoat.io/
[8]: https://github.com/visionmedia/css-stringify/pull/23
[9]: https://github.com/visionmedia/css-stringify
[10]: https://github.com/visionmedia/rework
[11]: http://reactjs.org
[12]: https://github.com/andreypopp/xcss/blob/master/classmap.js
[13]: https://github.com/andreypopp
[14]: https://github.com/visionmedia/rework#plugins
[15]: https://github.com/visionmedia/rework/wiki/Plugins
[16]: https://github.com/ai/autoprefixer
[17]: https://github.com/andreypopp/dcompose
[18]: https://github.com/visionmedia/rework-vars
[19]: https://github.com/reworkcss/rework-inherit
[20]: https://github.com/andreypopp/rework-macro
[21]: http://dev.w3.org/csswg/css-variables/
