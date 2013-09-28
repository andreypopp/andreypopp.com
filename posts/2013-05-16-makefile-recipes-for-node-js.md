---
title: Makefile recipes for Node.js packages
created_at: 2013/05/16
kind: article
tags: npm, node.js, makefile, build, release
---

When you write code for Node.js you certainly will have a couple of things in
your build-test-release cycle to automate. I use `make` utility for that, mainly
because it is simple and concise.

To start using `make` you should create a `Makefile` file in your project root
directory. `Makefile` contains variable and tasks declarations (below I'll give
the examples). To perform some task you just call `make <task name>` from a
command line. Easy!

Below is my generic `Makefile` from which I usually start a new Node.js or
Browserify project. I'll go step by step through it.

First thing is to define some useful variables: I store sources in `src` and
compiled code in `lib` (yes, I use CoffeeScript but feel free to customize
template to any language you like).

    BIN = ./node_modules/.bin
    SRC = $(wildcard src/*.coffee)
    LIB = $(SRC:src/%.coffee=lib/%.js)

`SRC` will contain a list of `.coffee` files in `src` directory and `LIB` — a
list of corresponding (but not-yet-existent) `.js` files in `lib` directory — the
`$(VAR:pattern1=pattern2)` form  allows to specify a transformation on each item
stored in a variable.

So if we have `src/index.coffee src/mod.coffee` in filesystem then `SRC` will
capture them and `LIB` will contain `lib/index.js lib/mod.js` correspondingly.

`BIN` points to a directory with executables of local Node modules installation.

## Build

Now let's define our first task called `build` and state that it depends on all
files stored in `LIB` variable.

    build: $(LIB)

Easy, right? `$(LIB)` syntax is just a way `make` dereferences variables.

After running `make build` the utility will try to ensure all files in `LIB` are
in place and up to date. But how we tell `make` on how to get all these files in
`LIB` from corresponding files in `SRC`?

The next snippet defines a so called wildcard rule which is applicable to files
matched by a given pattern, in this case — `lib/%.js` — exactly this pattern
will match files in `LIB` variable.

    lib/%.js: src/%.coffee
      @mkdir -p $(@D)
      @$(BIN)/coffee -bcp $< > $@

This rule tells `make` that file `lib/%.js` depends on corresponding
`src/%.coffee` file and so `make` will rebuild the former file if the latter is
changed.

How it works? First it creates a directory for a target file (`$(@D)` denotes
such directory, it is a `make` magic variable), then it calls CoffeeScript
compiler on corresponding `.coffee` file denoted by `$<` which writes result
into target file denoted by `$@`.

Note the `@`-prefixed lines — by default `make` prints all lines it executes,
but lines prefixed with `@` will not be printed.

Enough for a build process — `make build` will rebuild all outdated (and only
those) files in `lib` directory from corresponding files in `src` directory.

## Test

Test `task` is very easy

    test: build
      @$(BIN)/mocha -b specs

We just specify that `test` depends on `build` — we want to run tests on fresh
code — and run our test runner of choice, `mocha` in this case.

## Auxiliary tasks

Next go auxiliary tasks — `clean` which removes all compiled code:

    clean:
      @rm -f $(LIB)

and `install` and `link` tasks which simply run corresponding subcommand of
`npm`:

    install link:
      @npm $@

Note the trick with `$@` variable and how it allows use propagate task name into
a subcommand of `npm`.

## Releases

Next thing is releases.

The following snippet may seem a bit magical but actually it's really simple.
It defines a parametrized macro for doing patch, minor and major releases and it
is used by tasks below.

    define release
      VERSION=`node -pe "require('./package.json').version"` && \
      NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
      node -e "\
        var j = require('./package.json');\
        j.version = \"$$NEXT_VERSION\";\
        var s = JSON.stringify(j, null, 2);\
        require('fs').writeFileSync('./package.json', s);" && \
      git commit -m "release $$NEXT_VERSION" -- package.json && \
      git tag "$$NEXT_VERSION" -m "release $$NEXT_VERSION"
    endef

In short, it rewrites `package.json` with a new incremented version (which part
of version is incremented is defined via `$1` variable which is a macro
parameter) then it creates a corresponding git commit and a git tag.

Next up just call a `release` macro with `patch`, `minor` and `major` parameters
to create correspondingly `release-patch`, `release-minor` and `release-major`
tasks which in turn depend on `build` and `test` tasks. That way we cannot make
releases if we fail on build or test phases.

    release-patch: build test
      @$(call release,patch)

    release-minor: build test
      @$(call release,minor)

    release-major: build test
      @$(call release,major)

The final point is a `publish` task which just pushes commits into a repo and
publish package on npm.

    publish:
      git push --tags origin HEAD:master
      npm publish

Now to make a new minor release you just need to execute `make release-minor
publish` from a command line — minor version in `package.json` will be
incremented, new commit and tag will be created and pushed into a repo and,
finally, package will be published on npm.

The entire `Makefile` is available [here](https://gist.github.com/5588256).
