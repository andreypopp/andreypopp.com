---
title: "small packages for node.js"
created_at: 2013/05/29
draft: true
tags: software development, javascript, node, modules, npm
---

I am by no means an expert in JavaScript and Node.js but after using it for a
couple of months I'd like to speculate on how Node.js could be implemented in
a way which is more aligned to my patterns of its use.

There's a trend in Node.js community to develop small self-contained packages
which do just one small thing and do it well, which is perfectly aligned with
the Unix philosophy by the way.

I generally like this but at the same time I think that there should be more
support from the tooling and the underlying platform.

Let's see what I'm talking about.

## require() which does more

Let's speculate what if `require()` function is implemented in way that it
automatically downloads and installs a required package from npm.

I think it's really cubersome to issue `npm install X` command before using `X`
in your code, especially if you need a lot of `X`-s. Why not? Well, _(a)_ because
you don't specify package version in `require()` calls and _(b)_ it may seems
less secure.

But let's do that only while developing, of course you still have to have
`package.json` with specified dependencies in it but I think that can be
generated afterwards with some tool which analyzes your code for `require()`-s
and given the installed versions of packages updates your `package.json`
accordingly.

## packages without package.json
