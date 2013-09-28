---
title: How I write CoffeeScript
created_at: 2012/09/18
kind: article
tags: software development coffeescript
---

There's an article ["CoffeeScript: less typing, bad readability"][1] trending on
[Hacker News][2] recently:

> Initially, it was a nice Experience, but then I gradually realized that, while
> writing CoffeeScript code Was very pleasant, reading it wasn’t so. I started
> to notice that it was hard To read my own code a few months later. It was even
> harder to read other People’s code.

Coincidently I've been using CoffeeScript for about a month now and while I can
easily say it's an improvement over plain JavaScript I hardly couldn't notice
exactly the same problem — too noisy and too dense syntax constructs.

Given my Python background (which implies some aesthetics regarding code style)
I started to think what I can do about that and came to the simplest conclusion
— *use as little syntax sugar as possible* — `unless`, `@` and many other
syntax "shortcuts" are banned for me.

Reading code isn't the same as reading text composed in natural language — it is
much more a task of pattern recognition than the latter; so the less types of
patterns you have to recognize, the more efficiently you can understand what
this piece of code is doing. This is also why consistency across a code base
matters.

Actually CoffeeScript syntax sugar like `unless` or `@` doesn't help us to
remove boilerplate or provide more expressiveness to the language — these are
just a "shortcuts" which try to make a piece of code looks like a plain English
and bring more noise along the way.

[1]: http://ceronman.com/2012/09/17/coffeescript-less-typing-bad-readability/
[2]: http://news.ycombinator.com/item?id=4533737
