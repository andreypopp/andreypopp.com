import {Post} from '../../Post';
export default Post;
export let title = "Why you should write Makefiles"

There are a couple of reasons you should use `make` utility and write Makefiles
for your projects, even if it is 2013 now and you use modern programming
languages and platforms.

## It's easy

Your build process usually can be described in terms of sequences of commands
with some dependencies between. `make` captures this naturally as a set of build
targets (with dependencies) and associated snippets of shell script (usually
`sh`):

    lib/app.js:
      coffee -cp src/app.coffee > lib/app.js

    app.min.js: lib/app.js
      uglify-js lib/app.js > app.min.js

This reads as: to build `app.min.js` you would need to build `lib/app.js` first,
run `coffee ...` to build the former and `uglify-js ...` for the latter. To run
just issue

    % make app.min.js

Shell was designed exactly to perform command line tasks so it is the most
efficient and boilerplate-free way to execute a bunch of commands sequentially
and even compose pipelines of them.

<blockquote class="twitter-tweet">
  <p>if you want to execute some commands in order it's really hard to do any better than bash</p>
  &mdash; James Halliday (@substack) <a href="https://twitter.com/substack/status/337311603911450624">May 22, 2013</a>
</blockquote>

You write recipes using shell scripting language, `make` only organizes recipes
into dependency graph and rebuilds incrementally only needed parts of it (by
comparing timestamps of targets and their dependencies).

## But shell scripting is hard

You might say that but in fact it's not.

If you still think so then you probably didn't even try it. I think, if you use
command line as a part of your development process you should at least give it a
shot.

Yes, shell scripting has some quirks but so does any programming language and I
wouldn't say that using shell is more or less painful than using any other
language.

Again, give it at least a try — shell scripting documentation fits in one or two
man pages.

## Makefiles are good for encapsulation

The second reason to use `make` is encapsulation. Let me describe what this
means.

Nowadays most platforms have their own build tools. So does Python (distutils,
setuptools, pip), Ruby (gem, bundle), Node.js (npm) and a bunch of others and
that's completely fine. Such build tools usually perform much better for their
own platforms because they were designed exactly for these.

But even if I work on Python or Node.js project I would still consider using
Makefiles and writing targets to wrap those build tools' commands into `make`
targets:

    install link publish:
      npm $@

Why? Just for the sake of encapsulation — if in a future some of the actions
will require some additional commands to execute I'll just change this action's
recipe to be something more than a call to `npm`:

    publish:
      git tag `node -pe 'require("./package.json").version'`
      npm publish

and I will not be required to change how I run such action — Makefile allows me
to define an interface to running build processes.

If you want to know more how I use `make` for npm projects you can read one of
my previous posts on the subject — [Makefile recipies for Node.js packages][npm-make].

## What about Windows OS?

Yes, `make` is an alien in a Windows environment but so is command line.

But if a window developer is going to be serious with a command line then they
usually get [cygwin][] installed and there along comes `make` utility.

[npm-make]: http://andreypopp.com/posts/2013-05-16-makefile-recipes-for-node-js.html
[cygwin]: http://www.cygwin.com/
